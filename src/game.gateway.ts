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
            const session = await this.gameSessionService.claimBuzz(roomCode, client.id);

            if (!session) {
                // Either room doesn't exist or someone else already buzzed
                return { success: false, message: 'Buzz failed or already locked' };
            }

            // Emit to everyone in the room that we have a winner
            this.server.to(roomCode).emit('buzz_winner', {
                buzzedPlayerId: client.id,
                nickname: session.players.find(p => p.socketId === client.id)?.nickname
            });

            return { success: true, message: 'Buzz registered' };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error processing buzz' };
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
