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

    async getSessionByRoomCode(roomCode: string): Promise<GameSessionDocument | null> {
        return this.gameSessionModel.findOne({ roomCode }).populate('categories').exec();
    }

    async updateCategories(sessionId: string, categoryIds: string[]): Promise<GameSessionDocument | null> {
        const questions = await this.questionsService.findByCategoryIds(categoryIds);
        const finalQuestion = await this.questionsService.getRandomFinalQuestion();

        return this.gameSessionModel.findByIdAndUpdate(
            sessionId,
            {
                categories: categoryIds,
                'gameState.questions': questions,
                'gameState.finalQuestion': finalQuestion,
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
                    'gameState.isBuzzerWindowOpen': false,
                },
            },
            { new: true },
        );
    }

    async setBuzzerWindowStatus(roomCode: string, isOpen: boolean): Promise<GameSessionDocument | null> {
        return this.gameSessionModel.findOneAndUpdate(
            { roomCode },
            { $set: { 'gameState.isBuzzerWindowOpen': isOpen } },
            { new: true },
        );
    }

    async startFinalJeopardy(roomCode: string): Promise<GameSessionDocument | null> {
        return this.gameSessionModel.findOneAndUpdate(
            { roomCode },
            {
                $set: {
                    finalJeopardyState: 'WAGERING',
                    playerAnswers: []
                }
            },
            { new: true },
        );
    }

    async submitWager(roomCode: string, playerId: string, amount: number): Promise<GameSessionDocument | null> {
        const session = await this.gameSessionModel.findOne({ roomCode });
        if (!session) return null;

        const player = session.players.find(p => p.socketId === playerId);
        if (!player || amount < 0 || amount > player.score) return null;

        // Check if player already wagered to update or insert
        const existingEntryIndex = session.playerAnswers.findIndex(pa => pa.playerId === playerId);

        if (existingEntryIndex > -1) {
            session.playerAnswers[existingEntryIndex].wager = amount;
        } else {
            session.playerAnswers.push({
                playerId,
                wager: amount,
                answerText: '',
                isCorrect: false,
                isRevealed: false
            });
        }

        return session.save();
    }

    async setFinalQuestion(roomCode: string, question: any): Promise<GameSessionDocument | null> {
        return this.gameSessionModel.findOneAndUpdate(
            { roomCode },
            { $set: { 'gameState.finalQuestion': question } },
            { new: true },
        );
    }

    async revealFinalQuestion(roomCode: string): Promise<GameSessionDocument | null> {
        return this.gameSessionModel.findOneAndUpdate(
            { roomCode },
            { $set: { finalJeopardyState: 'ANSWERING' } },
            { new: true },
        );
    }

    async submitFinalAnswer(roomCode: string, playerId: string, text: string): Promise<GameSessionDocument | null> {
        return this.gameSessionModel.findOneAndUpdate(
            { roomCode, 'playerAnswers.playerId': playerId },
            { $set: { 'playerAnswers.$.answerText': text } },
            { new: true },
        );
    }

    async startJudging(roomCode: string): Promise<GameSessionDocument | null> {
        return this.gameSessionModel.findOneAndUpdate(
            { roomCode },
            { $set: { finalJeopardyState: 'JUDGING' } },
            { new: true },
        );
    }

    async revealAnswerToRoom(roomCode: string, playerId: string): Promise<GameSessionDocument | null> {
        return this.gameSessionModel.findOneAndUpdate(
            { roomCode, 'playerAnswers.playerId': playerId },
            { $set: { 'playerAnswers.$.isRevealed': true } },
            { new: true },
        );
    }

    async resolveApproximation(roomCode: string, winnerIds: string[]): Promise<GameSessionDocument | null> {
        const session = await this.gameSessionModel.findOne({ roomCode });
        if (!session) return null;

        session.playerAnswers.forEach(pa => {
            const playerIndex = session.players.findIndex(p => p.socketId === pa.playerId);
            if (playerIndex > -1) {
                if (winnerIds.includes(pa.playerId)) {
                    session.players[playerIndex].score += pa.wager;
                } else {
                    session.players[playerIndex].score -= pa.wager;
                }
            }
        });

        session.finalJeopardyState = 'FINISHED';
        session.status = 'FINISHED';
        return session.save();
    }

    async resolveStandard(roomCode: string, results: { playerId: string, isCorrect: boolean }[]): Promise<GameSessionDocument | null> {
        const session = await this.gameSessionModel.findOne({ roomCode });
        if (!session) return null;

        results.forEach(res => {
            const pa = session.playerAnswers.find(a => a.playerId === res.playerId);
            const playerIndex = session.players.findIndex(p => p.socketId === res.playerId);

            if (pa && playerIndex > -1) {
                if (res.isCorrect) {
                    session.players[playerIndex].score += pa.wager;
                } else {
                    session.players[playerIndex].score -= pa.wager;
                }
            }
        });

        session.finalJeopardyState = 'FINISHED';
        session.status = 'FINISHED';
        return session.save();
    }

    async endGame(roomCode: string): Promise<GameSessionDocument | null> {
        return this.gameSessionModel.findOneAndUpdate(
            { roomCode },
            { $set: { status: 'FINISHED', finalJeopardyState: 'FINISHED' } },
            { new: true },
        );
    }
}
