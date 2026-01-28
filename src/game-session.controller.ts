import { Controller, Post, Patch, Get, Body, Param } from '@nestjs/common';
import { GameSessionService } from './game-session.service';

@Controller('game-sessions')
export class GameSessionController {
    constructor(private readonly gameSessionService: GameSessionService) { }

    @Post()
    async create(@Body() data: { hostId: string }) {
        return this.gameSessionService.createSession(data.hostId);
    }

    @Patch(':id/categories')
    async updateCategories(
        @Param('id') id: string,
        @Body() data: { categoryIds: string[] },
    ) {
        return this.gameSessionService.updateCategories(id, data.categoryIds);
    }

    @Get('room/:roomCode')
    async getByRoomCode(@Param('roomCode') roomCode: string) {
        return this.gameSessionService.getSessionByRoomCode(roomCode);
    }
}
