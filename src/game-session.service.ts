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
            gameState: { questions: [], buzzQueue: [], answeringPlayerId: null },
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

    async addPlayer(roomCode: string, nickname: string, socketId: string, userId?: string): Promise<GameSessionDocument | null> {
        const session = await this.gameSessionModel.findOne({ roomCode });
        if (!session) return null;

        if (session.host === userId) {
            // Host is joining, don't add to players but return the session
            return session;
        }

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

    async addToQueue(roomCode: string, socketId: string): Promise<GameSessionDocument | null> {
        // Atomic push to buzzQueue IF not already in queue and not currently answering
        return this.gameSessionModel.findOneAndUpdate(
            {
                roomCode,
                'gameState.buzzQueue': { $ne: socketId },
                'gameState.answeringPlayerId': { $ne: socketId },
            },
            {
                $push: { 'gameState.buzzQueue': socketId },
            },
            { new: true },
        );
    }

    async popNextPlayer(roomCode: string): Promise<GameSessionDocument | null> {
        // Find session to get first in queue
        const session = await this.gameSessionModel.findOne({ roomCode });
        if (!session || session.gameState.buzzQueue.length === 0) return null;

        const nextPlayerId = session.gameState.buzzQueue[0];

        return this.gameSessionModel.findOneAndUpdate(
            { roomCode, 'gameState.answeringPlayerId': null },
            {
                $set: { 'gameState.answeringPlayerId': nextPlayerId },
                $pull: { 'gameState.buzzQueue': nextPlayerId },
            },
            { new: true },
        );
    }

    async judgeAnswer(roomCode: string, isCorrect: boolean, points: number): Promise<GameSessionDocument | null> {
        const session = await this.gameSessionModel.findOne({ roomCode });
        if (!session || !session.gameState.answeringPlayerId) return null;

        const playerId = session.gameState.answeringPlayerId;
        const update: any = {};

        if (isCorrect) {
            update['$inc'] = { 'players.$[elem].score': points };
            update['$set'] = {
                'gameState.answeringPlayerId': null,
                'gameState.buzzQueue': [],
            };
        } else {
            update['$inc'] = { 'players.$[elem].score': -points };
            update['$set'] = { 'gameState.answeringPlayerId': null };
        }

        return this.gameSessionModel.findOneAndUpdate(
            { roomCode },
            update,
            {
                arrayFilters: [{ 'elem.socketId': playerId }],
                new: true,
            },
        );
    }

    async startGame(roomCode: string): Promise<GameSessionDocument | null> {
        return this.gameSessionModel.findOneAndUpdate(
            { roomCode },
            { $set: { status: 'PLAYING' } },
            { new: true },
        );
    }

    async resetBuzz(roomCode: string): Promise<GameSessionDocument | null> {
        return this.gameSessionModel.findOneAndUpdate(
            { roomCode },
            {
                $set: {
                    'gameState.buzzQueue': [],
                    'gameState.answeringPlayerId': null,
                },
            },
            { new: true },
        );
    }
}
