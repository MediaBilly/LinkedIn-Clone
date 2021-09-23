import { Component, OnInit } from '@angular/core';
import { Chat } from 'src/app/models/chat.model';
import { User } from 'src/app/models/user.model';
import { ChatService } from 'src/app/services/chat.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit {
  chats?: Chat[];
  activeChat?: Chat;
  isLoggedIn = false;
  loggedInUser?: User;

  constructor(private chatService: ChatService, private tokenStorageService: TokenStorageService, private usersService: UserService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.tokenStorageService.loggedIn();
    this.getLoggedInUser();
    this.getChatInfo();
  }

  getLoggedInUser() {
    if (this.isLoggedIn) {
      this.usersService.getUserProfile().subscribe(u => {
        this.loggedInUser = u;
      });
    }
  }

  getChatInfo() {
    this.chatService.getChats().subscribe(chs => {
      this.chats = chs;
      if (this.chats.length > 0) {
        this.activeChat = this.chats[0];
      }
    });
  }

  getUserProfilePicPath(user: User) {
    return this.usersService.getProfilePicPath(user);
  }

  setActiveChat(chat: Chat) {
    this.activeChat = chat;
  }

}
