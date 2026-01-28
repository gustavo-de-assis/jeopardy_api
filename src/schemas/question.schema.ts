import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Category } from './category.schema';

export type QuestionDocument = HydratedDocument<Question>;

@Schema()
export class Question {
    @Prop({ required: true })
    text: string;

    @Prop({ required: true })
    answer: string;

    @Prop({ required: true })
    level: number;

    @Prop({ required: true, enum: ['STANDARD', 'APPROXIMATION'], default: 'STANDARD' })
    type: string;

    @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
    categoryId: Category | Types.ObjectId;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
