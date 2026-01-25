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

@WebSocketGateway({ cors: true })
export class GameGateway {
    @WebSocketServer()
    server: Server;

    constructor(
        private gameSessionService: GameSessionService,
        private usersService: UsersService,
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
}
