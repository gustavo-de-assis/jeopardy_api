import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GameSession } from './schemas/game-session.schema';
import { GameSessionService } from './game-session.service';

@WebSocketGateway({ cors: true })
export class GameGateway {
    @WebSocketServer()
    server: Server;

    constructor(
        @InjectModel(GameSession.name) private gameSessionModel: Model<GameSession>,
        private gameSessionService: GameSessionService,
    ) { }

    @SubscribeMessage('join_room')
    async handleJoinRoom(
        @MessageBody() data: { roomCode: string; playerName: string },
        @ConnectedSocket() client: Socket,
    ) {
        const { roomCode, playerName } = data;

        try {
            const session = await this.gameSessionService.addPlayer(roomCode, {
                nickname: playerName,
                socketId: client.id,
            });

            if (!session) {
                return { success: false, message: 'Room not found or invalid' };
            }

            client.join(roomCode);
            this.server.to(roomCode).emit('player_joined', { playerName, totalPlayers: session.players.length });
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
        const session = await this.gameSessionModel.findOne({ roomCode });

        if (!session) {
            return { success: false, message: 'Room not found' };
        }

        if (session.isLocked) {
            return { success: false, message: 'Room already locked' };
        }

        session.isLocked = true;
        session.buzzedPlayerId = client.id;
        await session.save();

        this.server.to(roomCode).emit('room_locked', { buzzedPlayerId: client.id });
        return { success: true, message: 'Buzz registered' };
    }
}
