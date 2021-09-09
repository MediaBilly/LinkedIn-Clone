import { Component, OnInit } from '@angular/core';
import { FriendRequest } from 'src/app/models/friendRequest.model';
import { Notification } from 'src/app/models/notification.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  friendRequests?: FriendRequest[];
  notifications?: Notification[];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getReceivedFriendRequests().subscribe(requests => {
      this.friendRequests = requests;
    });
    this.userService.getNotifications().subscribe(nots => {
      this.notifications = nots;
    });
  }

}
