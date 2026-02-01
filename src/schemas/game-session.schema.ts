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

  @Prop({
    type: String,
    enum: ['IDLE', 'WAGERING', 'ANSWERING', 'JUDGING', 'FINISHED'],
    default: 'IDLE'
  })
  finalJeopardyState: 'IDLE' | 'WAGERING' | 'ANSWERING' | 'JUDGING' | 'FINISHED';

  @Prop([
    {
      playerId: { type: String, required: true },
      wager: { type: Number, default: 0 },
      answerText: { type: String, default: '' },
      isCorrect: { type: Boolean, default: false },
      isRevealed: { type: Boolean, default: false },
    },
  ])
  playerAnswers: {
    playerId: string;
    wager: number;
    answerText: string;
    isCorrect: boolean;
    isRevealed: boolean;
  }[];

  @Prop({ type: [{ type: String, ref: 'Category' }] })
  categories: string[];

  @Prop({
    type: {
      questions: [{ type: Object }],
      buzzQueue: [{ type: String }],
      answeringPlayerId: { type: String, default: null },
      finalQuestion: { type: Object, default: null },
      isBuzzerWindowOpen: { type: Boolean, default: false },
    },
    default: { questions: [], buzzQueue: [], answeringPlayerId: null, finalQuestion: null, isBuzzerWindowOpen: false },
  })
  gameState: {
    questions: any[];
    buzzQueue: string[];
    answeringPlayerId: string | null;
    finalQuestion: any;
    isBuzzerWindowOpen: boolean;
  };
}

export const GameSessionSchema = SchemaFactory.createForClass(GameSession);
