import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';
import { ChatController } from './chat.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Message]), UsersModule],
  providers: [ChatService],
  controllers: [ChatController]
})
export class ChatModule {}
