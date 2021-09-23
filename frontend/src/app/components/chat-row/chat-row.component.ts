import { Component, Input, OnInit } from '@angular/core';
import { ChatInfo } from 'src/app/models/chat-info.model';
import { Chat } from 'src/app/models/chat.model';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat-row',
  templateUrl: './chat-row.component.html',
  styleUrls: ['./chat-row.component.css']
})
export class ChatRowComponent implements OnInit {
  @Input() chat?: Chat;
  info?: ChatInfo | null;

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    if (this.chat) {
      this.info = this.chatService.getChatInfo(this.chat);
    }
  }

}
