import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameSession, GameSessionSchema } from './schemas/game-session.schema';
import { GameSessionService } from './game-session.service';

import { GameGateway } from './game.gateway';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost/jeopardy'),
    MongooseModule.forFeature([{ name: GameSession.name, schema: GameSessionSchema }]),
    UsersModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService, GameSessionService, GameGateway],
})
export class AppModule { }
