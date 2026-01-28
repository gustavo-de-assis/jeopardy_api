import mongoose from 'mongoose';
import { CategorySchema } from 'src/schemas/category.schema';
import { QuestionSchema } from 'src/schemas/question.schema';
import { categories } from './categories.seed';
import { buildQuestions } from './questions.seed';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/jeopardy';

async function runSeed() {
    await mongoose.connect(MONGO_URI);

    const Category = mongoose.model('Category', CategorySchema);
    const Question = mongoose.model('Question', QuestionSchema);

    await Category.deleteMany({});
    await Question.deleteMany({});

    console.log('🌱 Inserindo categorias...');
    await Category.insertMany(categories);

    console.log('🔎 Lendo categorias do banco...');
    const storedCategories = await Category.find().lean();

    const categoryMap = storedCategories.reduce((acc, category) => {
        acc[category.name] = category._id;
        return acc;
    }, {} as Record<string, mongoose.Types.ObjectId>);

    console.log('🌱 Inserindo perguntas...');
    const questions = buildQuestions(categoryMap);
    await Question.insertMany(questions);

    await mongoose.disconnect();
    console.log('✅ Seed finalizado com sucesso');
}

runSeed().catch(err => {
    console.error('❌ Erro ao rodar seed', err);
    process.exit(1);
});
