import { Component, OnInit } from '@angular/core';
import { FriendRequest } from 'src/app/models/friendRequest.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  friendRequests?: FriendRequest[];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getReceivedFriendRequests().subscribe(requests => {
      this.friendRequests = requests;
    });
  }

}
