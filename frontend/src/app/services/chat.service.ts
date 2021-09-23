import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatInfo } from '../models/chat-info.model';
import { Chat } from '../models/chat.model';
import { Message } from '../models/message.model';
import { TokenStorageService } from './token-storage.service';
import { UserService } from './user.service';

const API_URL = 'http://localhost:3000/';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private httpClient: HttpClient, private usersService: UserService, private tokenStorageService: TokenStorageService) { }

  createChat(otherUserId: number): Observable<Chat> {
    return this.httpClient.post<Chat>(API_URL + 'chat/create/' + otherUserId.toString(), {}, { responseType: 'json' });
  }

  getChats(): Observable<Chat[]> {
    return this.httpClient.get<Chat[]>(API_URL + 'chat/list', { responseType: 'json' });
  }

  getChatMessages(chatId: number): Observable<Message[]> {
    return this.httpClient.get<Message[]>(API_URL + 'chat/messages/' + chatId.toString(), { responseType: 'json' });
  }

  sendMessage(chatId: number, message: string): Observable<Message> {
    return this.httpClient.post<Message>(API_URL + 'chat/sendMessage/' + chatId.toString(), { text: message }, { responseType: 'json' });
  }

  getChatInfo(chat: Chat): ChatInfo | null {
    const loggedInId = this.tokenStorageService.getLoggedInId();
    if (loggedInId) {
      const displayUser = chat.users.filter(u => u.id !== loggedInId)[0];
      const ret: ChatInfo = {
        picPath: this.usersService.getProfilePicPath(displayUser),
        name: displayUser.firstname + ' ' + displayUser.lastname
      };
      return ret;
    } else {
      return null;
    }
  }
}
