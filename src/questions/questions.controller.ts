import { Controller, Get, Post, Body } from '@nestjs/common';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionsController {
    constructor(private readonly questionsService: QuestionsService) { }

    @Post()
    create(@Body() createQuestionDto: any) {
        return this.questionsService.create(createQuestionDto);
    }

    @Post('by-categories')
    findByCategoryIds(@Body() data: { categoryIds: string[] }) {
        return this.questionsService.findByCategoryIds(data.categoryIds);
    }

    @Post('seed')
    seed() {
        return this.questionsService.smartSeed();
    }
}
