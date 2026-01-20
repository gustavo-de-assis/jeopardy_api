import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameSession, GameSessionSchema } from './schemas/game-session.schema';

import { GameGateway } from './game.gateway';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost/jeopardy'),
    MongooseModule.forFeature([{ name: GameSession.name, schema: GameSessionSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService, GameGateway],
})
export class AppModule { }
