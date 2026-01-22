import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema()
export class Category {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop()
    description: string;

    @Prop({ default: '#FF0000' })
    hexColor: string;

    @Prop({ default: true })
    isActive: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
