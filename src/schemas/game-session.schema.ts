import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GameSessionDocument = HydratedDocument<GameSession>;

@Schema()
export class GameSession {
  @Prop({ required: true, unique: true, length: 4 })
  roomCode: string;

  @Prop([
    {
      socketId: { type: String, required: true },
      name: { type: String, required: true },
    },
  ])
  players: { socketId: string; name: string }[];

  @Prop({ default: false })
  isLocked: boolean;

  @Prop({ default: null })
  buzzedPlayerId: string;
}

export const GameSessionSchema = SchemaFactory.createForClass(GameSession);
