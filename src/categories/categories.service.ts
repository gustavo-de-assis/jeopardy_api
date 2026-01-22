import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../schemas/category.schema';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    ) { }

    async create(createCategoryDto: any): Promise<CategoryDocument> {
        const createdCategory = new this.categoryModel(createCategoryDto);
        return createdCategory.save();
    }

    async findAll(): Promise<CategoryDocument[]> {
        return this.categoryModel.find({ isActive: true }).exec();
    }

    async seed(): Promise<string> {
        const count = await this.categoryModel.countDocuments();
        if (count > 0) {
            return 'Database already seeded';
        }

        const categories = [
            { name: 'História', description: 'Perguntas sobre história mundial e local', hexColor: '#FF5733' },
            { name: 'Ciência', description: 'Física, Química, Biologia e mais', hexColor: '#33FF57' },
            { name: 'Cultura Pop', description: 'Filmes, Música e Celebridades', hexColor: '#3357FF' },
            { name: 'Geografia', description: 'Países, Capitais e Mapas', hexColor: '#F3FF33' },
            { name: 'Esportes', description: 'Futebol, Basquete e Olimpíadas', hexColor: '#FF33A8' },
        ];

        await this.categoryModel.insertMany(categories);
        return 'Database seeded successfully with 5 categories';
    }
}
