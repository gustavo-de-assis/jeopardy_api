import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GameSessionDocument = HydratedDocument<GameSession>;

@Schema()
export class GameSession {
  @Prop({ required: true, unique: true, length: 4 })
  roomCode: string;

  @Prop({ type: String, required: true }) // assuming host is just a userId string for now to avoid User model dependency complexity if not needed immediately
  host: string;

  @Prop([
    {
      nickname: { type: String, required: true },
      score: { type: Number, default: 0 },
      socketId: { type: String, required: true },
    },
  ])
  players: { nickname: string; score: number; socketId: string }[];

  @Prop({ default: 'LOBBY' })
  status: 'LOBBY' | 'PLAYING' | 'FINISHED';

  @Prop({ type: [{ type: String, ref: 'Category' }] })
  categories: string[];

  @Prop({
    type: {
      questions: [{ type: Object }],
      buzzQueue: [{ type: String }],
      answeringPlayerId: { type: String, default: null },
    },
    default: { questions: [], buzzQueue: [], answeringPlayerId: null },
  })
  gameState: {
    questions: any[];
    buzzQueue: string[];
    answeringPlayerId: string | null;
  };
}

export const GameSessionSchema = SchemaFactory.createForClass(GameSession);
