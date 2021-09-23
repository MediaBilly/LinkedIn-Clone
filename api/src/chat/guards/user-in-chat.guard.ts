import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { ChatService } from "../chat.service";

@Injectable()
export class UserInChatGuard implements CanActivate {
    constructor(private chatService: ChatService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const params = request.params;
        const user = request.user;
        
        if (!params || !user) {
            return false;
        }

        const chatId = +params.id;
        return this.chatService.getChat(chatId).then(chat => {
            return chat.users.some(u => u.id === +user.id);
        });
    }
}