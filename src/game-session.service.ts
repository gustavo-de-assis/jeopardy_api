import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GameSession, GameSessionDocument } from './schemas/game-session.schema';
import { QuestionsService } from './questions/questions.service';

@Injectable()
export class GameSessionService {
    constructor(
        @InjectModel(GameSession.name) private gameSessionModel: Model<GameSessionDocument>,
        private questionsService: QuestionsService,
    ) { }

    private generateRoomCode(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let code = '';
        for (let i = 0; i < 4; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    async createSession(hostId: string): Promise<GameSessionDocument> {
        let roomCode = this.generateRoomCode();
        // Ensure unique room code
        let existing = await this.gameSessionModel.findOne({ roomCode });
        while (existing) {
            roomCode = this.generateRoomCode();
            existing = await this.gameSessionModel.findOne({ roomCode });
        }

        const session = new this.gameSessionModel({
            roomCode,
            host: hostId,
            players: [],
            status: 'LOBBY',
            categories: [],
            gameState: { questions: [], buzzLocked: false, buzzedPlayerId: null },
        });
        return session.save();
    }

    async updateCategories(sessionId: string, categoryIds: string[]): Promise<GameSessionDocument | null> {
        const questions = await this.questionsService.findByCategoryIds(categoryIds);

        return this.gameSessionModel.findByIdAndUpdate(
            sessionId,
            {
                categories: categoryIds,
                'gameState.questions': questions,
                status: 'PLAYING',
            },
            { new: true },
        );
    }

    async addPlayer(roomCode: string, nickname: string, socketId: string): Promise<GameSessionDocument | null> {
        return this.gameSessionModel.findOneAndUpdate(
            { roomCode },
            {
                $push: {
                    players: {
                        nickname,
                        score: 0,
                        socketId,
                    },
                },
            },
            { new: true },
        );
    }

    async claimBuzz(roomCode: string, socketId: string): Promise<GameSessionDocument | null> {
        // Atomic update: only update if buzzLocked is false
        return this.gameSessionModel.findOneAndUpdate(
            { roomCode, 'gameState.buzzLocked': false },
            {
                $set: {
                    'gameState.buzzLocked': true,
                    'gameState.buzzedPlayerId': socketId,
                },
            },
            { new: true },
        );
    }

    async resetBuzz(roomCode: string): Promise<GameSessionDocument | null> {
        return this.gameSessionModel.findOneAndUpdate(
            { roomCode },
            {
                $set: {
                    'gameState.buzzLocked': false,
                    'gameState.buzzedPlayerId': null,
                },
            },
            { new: true },
        );
    }
}
