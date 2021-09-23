import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { MessageDto } from './dto/message.dto';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chat) private chatRepository: Repository<Chat>,
        @InjectRepository(Message) private messagesRepository: Repository<Message>,
        private usersService: UsersService
    ) {}

    // Chats

    async createChat() {
        const newChat = this.chatRepository.create();
        return this.chatRepository.save(newChat);
    }

    getChat(id: number) {
        return this.chatRepository.findOneOrFail(id);
    }

    async getUserChats(uid: number) {
        return await (await this.chatRepository.find({ order: { last_message: 'DESC' } })).filter(chat => chat.users.some(u => u.id === uid));
    }

    addUserToChat(chatId: number, uid: number) {
        const chatPromise = this.getChat(chatId);
        const userPromise = this.usersService.findOne(uid);
        return Promise.all([chatPromise, userPromise]).then(([chat, user]) => {
            chat.users.push(user);
            return this.chatRepository.save(chat);
        });
    }

    // Messages

    async getChatMessages(id: number) {
        return this.messagesRepository.createQueryBuilder('M').innerJoinAndSelect('M.sender', 'sender').where('M.chatId = :id', { id: id }).orderBy('M.sentAt','DESC').getMany();
    }

    sendMessage(chatId: number, uid: number, messageDto: MessageDto) {
        const userPromise = this.usersService.findOne(uid);
        const chatPromise = this.getChat(chatId);
        return Promise.all([userPromise, chatPromise]).then(([user, chat]) => {
            const newMessage = this.messagesRepository.create(messageDto);
            newMessage.sender = user;
            newMessage.chat = chat;
            chat.last_message = new Date();
            return this.chatRepository.save(chat).then(_ => {
                return this.messagesRepository.save(newMessage);
            });
        });
    }
}
