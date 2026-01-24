import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameSessionService } from './game-session.service';

@WebSocketGateway({ cors: true })
export class GameGateway {
    @WebSocketServer()
    server: Server;

    constructor(
        private gameSessionService: GameSessionService,
    ) { }

    @SubscribeMessage('join_room')
    async handleJoinRoom(
        @MessageBody() data: { roomCode: string; nickname: string },
        @ConnectedSocket() client: Socket,
    ) {
        const { roomCode, nickname } = data;

        try {
            const session = await this.gameSessionService.addPlayer(roomCode, nickname, client.id);

            if (!session) {
                return { success: false, message: 'Room not found or invalid' };
            }

            client.join(roomCode);
            this.server.to(roomCode).emit('player_joined', {
                nickname,
                players: session.players
            });

            return { success: true, message: `Joined room ${roomCode}` };
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
            const session = await this.gameSessionService.judgeAnswer(roomCode, isCorrect, points);
            if (!session) return { success: false };

            if (isCorrect) {
                const winner = session.players.find(p => p.score > 0); // simplification, better to find by ID
                // Wait, finding winner by name from session state or last answering id?
                // The service already set answeringPlayerId to null. 
                // Let's pass the nickname if possible or just the result.
                this.server.to(roomCode).emit('round_finished', {
                    result: 'CORRECT',
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
}
