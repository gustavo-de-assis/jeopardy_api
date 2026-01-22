import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GameSession, GameSessionDocument } from './schemas/game-session.schema';

@Injectable()
export class GameSessionService {
    constructor(
        @InjectModel(GameSession.name) private gameSessionModel: Model<GameSessionDocument>,
    ) { }

    async addPlayer(roomCode: string, player: { nickname: string; socketId: string }): Promise<GameSessionDocument | null> {
        return this.gameSessionModel.findOneAndUpdate(
            { roomCode },
            {
                $push: {
                    players: {
                        nickname: player.nickname,
                        score: 0,
                        socketId: player.socketId,
                    },
                },
            },
            { new: true },
        );
    }
}
