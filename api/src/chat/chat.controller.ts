import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { ChatService } from './chat.service';
import { MessageDto } from './dto/message.dto';
import { UserInChatGuard } from './guards/user-in-chat.guard';

@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService, private usersService: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @Post('create/:otherUid')
    async createChat(@Request() req, @Param('otherUid') otherUid: string) {
        const chat = await this.chatService.createChat();
        await this.chatService.addUserToChat(chat.id, +req.user.id);
        await this.chatService.addUserToChat(chat.id, +otherUid);
        return chat;
    }

    @UseGuards(JwtAuthGuard)
    @Get('list')
    getUserChats(@Request() req) {
        return this.chatService.getUserChats(+req.user.id);
    }

    @UseGuards(JwtAuthGuard, UserInChatGuard)
    @Get('messages/:id')
    getChatMessages(@Param('id') id: string) {
        return this.chatService.getChatMessages(+id);
    }

    @UseGuards(JwtAuthGuard, UserInChatGuard)
    @Post('sendMessage/:id')
    sendMessage(@Request() req,@Param('id') id: string, @Body() messageDto: MessageDto) {
        return this.chatService.sendMessage(+id, +req.user.id, messageDto);
    }
}
