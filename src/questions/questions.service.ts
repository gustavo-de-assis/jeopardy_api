import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Question, QuestionDocument } from '../schemas/question.schema';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class QuestionsService {
    constructor(
        @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
        private categoriesService: CategoriesService,
    ) { }

    async create(createQuestionDto: any): Promise<QuestionDocument> {
        const createdQuestion = new this.questionModel(createQuestionDto);
        return createdQuestion.save();
    }

    async findByCategoryIds(categoryIds: string[]): Promise<QuestionDocument[]> {

        const objectIds = categoryIds.map(id => new Types.ObjectId(id))

        return this.questionModel
            .find({ categoryId: { $in: objectIds } })
            .sort({ level: 1 })
            .populate('categoryId')
            .exec();
    }

    async getRandomFinalQuestion(): Promise<QuestionDocument | null> {
        const count = await this.questionModel.countDocuments({ level: 6 }).exec();
        if (count === 0) return null;

        const random = Math.floor(Math.random() * count);
        return this.questionModel.findOne({ level: 6 }).skip(random).exec();
    }

    async getRandomFinalQuestionByCategory(categoryId: string): Promise<QuestionDocument | null> {
        const count = await this.questionModel.countDocuments({
            level: 6,
            categoryId: new Types.ObjectId(categoryId)
        }).exec();

        if (count === 0) {
            // Fallback to any final question if none found for this category
            return this.getRandomFinalQuestion();
        }

        const random = Math.floor(Math.random() * count);
        return this.questionModel.findOne({
            level: 6,
            categoryId: new Types.ObjectId(categoryId)
        }).skip(random).exec();
    }

    async smartSeed(): Promise<string> {
        const historia = await this.categoriesService.findByName('História');
        const ciencia = await this.categoriesService.findByName('Ciência');

        if (!historia || !ciencia) {
            return 'Categories not found. Please seed categories first.';
        }

        const questions = [
            { text: 'Em que ano começou a Segunda Guerra Mundial?', answer: '1939', level: 1, categoryId: historia._id },
            { text: 'Quem foi o primeiro presidente do Brasil?', answer: 'Deodoro da Fonseca', level: 2, categoryId: historia._id },
            { text: 'Qual civilização construiu as pirâmides de Gizé?', answer: 'Egípcia', level: 3, categoryId: historia._id },
            { text: 'Qual é o símbolo químico da água?', answer: 'H2O', level: 1, categoryId: ciencia._id },
            { text: 'Qual planeta é conhecido como o Planeta Vermelho?', answer: 'Marte', level: 2, categoryId: ciencia._id },
            { text: 'Qual é a velocidade da luz aproximadamente?', answer: '300.000 km/s', level: 3, categoryId: ciencia._id },
        ];

        // Simple duplicate check by text
        for (const q of questions) {
            const exists = await this.questionModel.findOne({ text: q.text }).exec();
            if (!exists) {
                await this.create(q);
            }
        }

        return 'Smart seed completed successfully';
    }
}
