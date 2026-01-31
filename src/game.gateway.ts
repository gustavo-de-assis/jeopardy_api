import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameSessionService } from './game-session.service';
import { UsersService } from './users/users.service';
import { QuestionsService } from './questions/questions.service';

@WebSocketGateway({ cors: true })
export class GameGateway {
    @WebSocketServer()
    server: Server;

    constructor(
        private gameSessionService: GameSessionService,
        private usersService: UsersService,
        private questionsService: QuestionsService,
    ) { }

    private pairingCodes = new Map<string, string>(); // code -> webSocketId
    private webToMobile = new Map<string, string>(); // webSocketId -> mobileSocketId

    @SubscribeMessage('login')
    async handleLogin(
        @MessageBody() data: { nickname: string, password: string },
    ) {
        const { nickname, password } = data;
        const user = await this.usersService.validateUser(nickname, password);

        if (user) {
            return { success: true, userId: user._id, nickname: user.nickname };
        }
        return { success: false, message: 'Credenciais inválidas' };
    }

    @SubscribeMessage('request_pairing')
    handleRequestPairing(
        @ConnectedSocket() client: Socket,
    ) {
        const code = Math.random().toString(36).substring(2, 6).toUpperCase();
        this.pairingCodes.set(code, client.id);

        // Cleanup code if socket disconnects
        client.on('disconnect', () => {
            this.pairingCodes.delete(code);
        });

        return { code };
    }

    @SubscribeMessage('authenticate_web')
    handleAuthenticateWeb(
        @MessageBody() data: { code: string, userId: string },
        @ConnectedSocket() client: Socket,
    ) {
        const { code, userId } = data;
        const webSocketId = this.pairingCodes.get(code);

        if (webSocketId) {
            this.webToMobile.set(webSocketId, client.id);
            this.server.to(webSocketId).emit('host_authenticated', { userId });
            return { success: true };
        }

        return { success: false, message: 'Invalid or expired pairing code' };
    }

    @SubscribeMessage('room_created')
    handleRoomCreated(
        @MessageBody() data: { roomCode: string },
        @ConnectedSocket() client: Socket,
    ) {
        const { roomCode } = data;
        const mobileSocketId = this.webToMobile.get(client.id);
        if (mobileSocketId) {
            this.server.to(mobileSocketId).emit('join_room_as_host', { roomCode });
        }
    }

    @SubscribeMessage('join_room')
    async handleJoinRoom(
        @MessageBody() data: { roomCode: string; nickname: string; userId?: string },
        @ConnectedSocket() client: Socket,
    ) {
        const { roomCode, nickname, userId } = data;

        try {
            const session = await this.gameSessionService.addPlayer(roomCode, nickname, client.id, userId);

            if (!session) {
                return { success: false, message: 'Room not found or invalid' };
            }

            const role = session.host === userId ? 'HOST' : 'PLAYER';

            client.join(roomCode);

            // Only emit player_joined if it's actually a player
            if (role === 'PLAYER') {
                this.server.to(roomCode).emit('player_joined', {
                    nickname,
                    players: session.players,
                    role,
                });
            } else {
                // For host, maybe just update host about the current players
                client.emit('player_joined', {
                    nickname,
                    players: session.players,
                    role,
                });
            }

            return { success: true, message: `Joined room ${roomCode}`, role };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Failed to join room' };
        }
    }

    @SubscribeMessage('buzz')
    async handleBuzz(
        @MessageBody() data: { roomCode: string },
        @ConnectedSocket() client: Socket,
    ) {
        const { roomCode } = data;

        try {
            const session = await this.gameSessionService.addToQueue(roomCode, client.id);

            if (!session) {
                return { success: false, message: 'Already in queue or answering' };
            }

            // check if anyone is answering. If not, trigger logic to pop and start answering.
            if (session.gameState.answeringPlayerId === null) {
                const updatedSession = await this.gameSessionService.popNextPlayer(roomCode);
                if (updatedSession && updatedSession.gameState.answeringPlayerId) {
                    const player = updatedSession.players.find(p => p.socketId === updatedSession.gameState.answeringPlayerId);
                    this.server.to(roomCode).emit('player_answering', {
                        nickname: player?.nickname,
                        socketId: player?.socketId
                    });
                }
            } else {
                // Anyone already answering, notify position in queue
                const position = session.gameState.buzzQueue.indexOf(client.id) + 1;
                client.emit('queue_updated', { position });
            }

            return { success: true, message: 'Buzz registered' };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error processing buzz' };
        }
    }

    @SubscribeMessage('judge_answer')
    async handleJudgeAnswer(
        @MessageBody() data: { roomCode: string, isCorrect: boolean, points: number },
    ) {
        const { roomCode, isCorrect, points } = data;

        try {
            const preSession = await this.gameSessionService.getSessionByRoomCode(roomCode);
            const answeringPlayerId = preSession?.gameState.answeringPlayerId;
            const answeringPlayer = preSession?.players.find(p => p.socketId === answeringPlayerId);

            const session = await this.gameSessionService.judgeAnswer(roomCode, isCorrect, points);
            if (!session) return { success: false };

            if (isCorrect) {
                this.server.to(roomCode).emit('round_finished', {
                    result: 'CORRECT',
                    winner: answeringPlayer?.nickname,
                    players: session.players
                });
            } else {
                // Incorrect: try to pop next one
                const nextSession = await this.gameSessionService.popNextPlayer(roomCode);
                if (nextSession && nextSession.gameState.answeringPlayerId) {
                    const nextPlayer = nextSession.players.find(p => p.socketId === nextSession.gameState.answeringPlayerId);
                    this.server.to(roomCode).emit('player_answering', {
                        nickname: nextPlayer?.nickname,
                        socketId: nextPlayer?.socketId
                    });
                } else {
                    // No more players in queue
                    this.server.to(roomCode).emit('round_finished', {
                        result: 'TIMEOUT_OR_NO_WINNER',
                        players: nextSession?.players || session.players
                    });
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    @SubscribeMessage('buzz_timeout')
    async handleBuzzTimeout(
        @MessageBody() data: { roomCode: string },
    ) {
        const { roomCode } = data;
        const session = await this.gameSessionService.getSessionByRoomCode(roomCode);
        if (!session) return;

        // ONLY finish the round if no one is in queue and no one is answering.
        // Otherwise, the 10s timer just means the "entry window" is closed.
        if (session.gameState.buzzQueue.length === 0 && session.gameState.answeringPlayerId === null) {
            this.server.to(roomCode).emit('round_finished', {
                result: 'TIMEOUT_OR_NO_WINNER',
                players: session.players
            });
        }
    }

    @SubscribeMessage('reset_buzz')
    async handleResetBuzz(
        @MessageBody() data: { roomCode: string },
    ) {
        const { roomCode } = data;
        await this.gameSessionService.resetBuzz(roomCode);
        this.server.to(roomCode).emit('buzz_reset');
    }

    @SubscribeMessage('start_game')
    async handleStartGame(
        @MessageBody() data: { roomCode: string },
    ) {
        const { roomCode } = data;
        const session = await this.gameSessionService.startGame(roomCode);
        if (session) {
            this.server.to(roomCode).emit('game_started');
        }
    }

    @SubscribeMessage('open_question')
    async handleOpenQuestion(
        @MessageBody() data: { roomCode: string, question: any },
    ) {
        const { roomCode, question } = data;
        this.server.to(roomCode).emit('question_opened', question);
    }
    @SubscribeMessage('select_final_category')
    async handleSelectFinalCategory(
        @MessageBody() data: { roomCode: string, categoryId: string, categoryName: string },
    ) {
        const { roomCode, categoryId, categoryName } = data;

        try {
            const question = await this.questionsService.getRandomFinalQuestionByCategory(categoryId);
            if (question) {
                await this.gameSessionService.setFinalQuestion(roomCode, question);

                this.server.to(roomCode).emit('final_category_selected', {
                    categoryName,
                    questionType: question.type
                });
            }
            return { success: true };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Failed to select final category' };
        }
    }

    @SubscribeMessage('start_final_jeopardy')
    async handleStartFinalJeopardy(
        @MessageBody() data: { roomCode: string },
    ) {
        const { roomCode } = data;
        let session = await this.gameSessionService.getSessionByRoomCode(roomCode);

        if (!session) return;

        // Check if at least 2 players have score > 0
        const eligiblePlayers = session.players.filter(p => p.score > 0);

        if (eligiblePlayers.length < 2) {
            // End game immediately
            await this.gameSessionService.endGame(roomCode);
            const updatedSession = await this.gameSessionService.getSessionByRoomCode(roomCode);
            if (updatedSession) {
                const leaderboard = updatedSession.players
                    .map(p => ({ nickname: p.nickname, score: p.score }))
                    .sort((a, b) => b.score - a.score)
                    .map((p, index) => ({ ...p, rank: index + 1 }));

                this.server.to(roomCode).emit('game_over', { leaderboard });
            }
            return;
        }

        await this.gameSessionService.startFinalJeopardy(roomCode);
        const finalSession = await this.gameSessionService.getSessionByRoomCode(roomCode);

        if (finalSession) {
            this.server.to(roomCode).emit('final_phase_started', {
                categories: finalSession.categories,
                players: finalSession.players
            });
        }
    }

    @SubscribeMessage('submit_wager')
    async handleSubmitWager(
        @MessageBody() data: { roomCode: string, amount: number },
        @ConnectedSocket() client: Socket,
    ) {
        const { roomCode, amount } = data;
        const session = await this.gameSessionService.submitWager(roomCode, client.id, amount);

        if (session) {
            client.emit('wager_confirmed', { amount });

            // Check if all players have wagered
            const activePlayers = session.players.length;
            const wageredPlayers = session.playerAnswers.length;

            if (wageredPlayers >= activePlayers) {
                this.server.to(roomCode).emit('all_wagers_placed');
            }
        }
    }

    @SubscribeMessage('reveal_final_question')
    async handleRevealFinalQuestion(
        @MessageBody() data: { roomCode: string },
    ) {
        const { roomCode } = data;
        const session = await this.gameSessionService.revealFinalQuestion(roomCode);
        if (session) {
            this.server.to(roomCode).emit('show_final_question', {
                text: session.gameState.finalQuestion?.text,
                duration: 30
            });
        }
    }

    @SubscribeMessage('submit_final_answer')
    async handleSubmitFinalAnswer(
        @MessageBody() data: { roomCode: string, text: string },
        @ConnectedSocket() client: Socket,
    ) {
        const { roomCode, text } = data;
        await this.gameSessionService.submitFinalAnswer(roomCode, client.id, text);
        // Maybe emit to host that a player answered? For now silent.
    }

    @SubscribeMessage('start_judging')
    async handleStartJudging(
        @MessageBody() data: { roomCode: string },
    ) {
        const { roomCode } = data;
        const session = await this.gameSessionService.startJudging(roomCode);
        if (session) {
            this.server.to(roomCode).emit('judging_phase_started', {
                playerAnswers: session.playerAnswers,
                correctAnswer: session.gameState.finalQuestion.answer,
                questionType: session.gameState.finalQuestion.type,
                players: session.players
            });
        }
    }

    @SubscribeMessage('reveal_answer_to_room')
    async handleRevealAnswerToRoom(
        @MessageBody() data: { roomCode: string, playerId: string },
    ) {
        const { roomCode, playerId } = data;
        const session = await this.gameSessionService.revealAnswerToRoom(roomCode, playerId);
        if (session) {
            const answer = session.playerAnswers.find(pa => pa.playerId === playerId);
            if (answer) {
                this.server.to(roomCode).emit('answer_revealed_on_board', {
                    playerId,
                    answerText: answer.answerText
                });
            }
        }
    }

    @SubscribeMessage('resolve_approximation_winners')
    async handleResolveApproximationWinners(
        @MessageBody() data: { roomCode: string, winnerPlayerIds: string[] },
    ) {
        const { roomCode, winnerPlayerIds } = data;
        const session = await this.gameSessionService.resolveApproximation(roomCode, winnerPlayerIds);

        if (session) {
            const leaderboard = session.players
                .map(p => ({ nickname: p.nickname, score: p.score }))
                .sort((a, b) => b.score - a.score)
                .map((p, index) => ({ ...p, rank: index + 1 }));

            this.server.to(roomCode).emit('game_over', { leaderboard });
        }
    }

    @SubscribeMessage('resolve_standard_round')
    async handleResolveStandardRound(
        @MessageBody() data: { roomCode: string, results: { playerId: string, isCorrect: boolean }[] },
    ) {
        const { roomCode, results } = data;
        const session = await this.gameSessionService.resolveStandard(roomCode, results);

        if (session) {
            const leaderboard = session.players
                .map(p => ({ nickname: p.nickname, score: p.score }))
                .sort((a, b) => b.score - a.score)
                .map((p, index) => ({ ...p, rank: index + 1 }));

            this.server.to(roomCode).emit('game_over', { leaderboard });
        }
    }
}
