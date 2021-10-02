import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { interval, Observable, Subject, Subscription } from 'rxjs';
import { mergeMap, startWith, takeUntil, tap } from 'rxjs/operators';
import { ChatInfo } from 'src/app/models/chat-info.model';
import { Chat } from 'src/app/models/chat.model';
import { Message } from 'src/app/models/message.model';
import { User } from 'src/app/models/user.model';
import { ChatService } from 'src/app/services/chat.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-active-chat',
  templateUrl: './active-chat.component.html',
  styleUrls: ['./active-chat.component.css']
})
export class ActiveChatComponent implements OnInit, OnDestroy {
  @Input() chat?: Chat;
  chatInfo?: ChatInfo | null;
  messages?: Message[];
  loggedInUid = 0;
  newMessage= new FormControl('');
  messagePoll?: Subscription;

  constructor(private chatService: ChatService, private tokenStorageService: TokenStorageService, private usersService: UserService) { }

  ngOnInit(): void {
    if (this.chat) {
      this.loggedInUid = this.tokenStorageService.getLoggedInId();
    }
  }

  ngOnChanges(): void {
    this.setChatInfo();
    if (this.messagePoll) {
      this.messagePoll.unsubscribe();
    }
    this.startMessagePolling();
  }

  ngOnDestroy(): void {
    if (this.messagePoll) {
      this.messagePoll.unsubscribe();
    }
  }
  
  // Function to call an observable on fixed period. Used to refresh the active chat.
  poller$(myObs$: Observable<any>, period: number) {
    const pollStop = new Subject();
    return interval(period).pipe(
        startWith(0),
        mergeMap(_ => myObs$),
        takeUntil(pollStop)
    );
  }

  setChatInfo(): void {
    if (this.chat) {
      this.chatInfo = this.chatService.getChatInfo(this.chat);
    }
  }

  startMessagePolling(): void {
    if (this.chat) {
      const messageObs = this.chatService.getChatMessages(this.chat.id).pipe(tap((msgs) => {
        this.messages = msgs;
      }));
      // Refresh the active chat every 2 seconds
      this.messagePoll = this.poller$(messageObs, 4000).subscribe();
    }
  }

  getUserPicPath(user: User) {
    return this.usersService.getProfilePicPath(user);
  }

  sendMessage() {
    if (this.chat && this.newMessage.value) {
      this.chatService.sendMessage(this.chat.id, this.newMessage.value).subscribe(message => {
        this.messages?.unshift(message);
        this.newMessage.reset();
      });
    }
  }

}
