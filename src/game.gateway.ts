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

@WebSocketGateway({ cors: true })
export class GameGateway {
    @WebSocketServer()
    server: Server;

    constructor(
        @InjectModel(GameSession.name) private gameSessionModel: Model<GameSession>,
    ) { }

    @SubscribeMessage('join_room')
    async handleJoinRoom(
        @MessageBody() data: { roomCode: string; playerName: string },
        @ConnectedSocket() client: Socket,
    ) {
        const { roomCode, playerName } = data;

        // Find or create session
        let session = await this.gameSessionModel.findOne({ roomCode });
        if (!session) {
            session = new this.gameSessionModel({ roomCode, players: [] });
        }

        // Add player if not already in
        const existingPlayer = session.players.find((p) => p.socketId === client.id);
        if (!existingPlayer) {
            session.players.push({ socketId: client.id, name: playerName });
            await session.save();
        }

        client.join(roomCode);
        this.server.to(roomCode).emit('player_joined', { playerName, totalPlayers: session.players.length });
        return { success: true, message: `Joined room ${roomCode}` };
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
