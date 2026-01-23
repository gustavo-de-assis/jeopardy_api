import { Controller, Post, Patch, Body, Param } from '@nestjs/common';
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
}
