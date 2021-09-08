import { Component, Input, OnInit } from '@angular/core';
import { FriendRequest } from 'src/app/models/friendRequest.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-friend-request',
  templateUrl: './friend-request.component.html',
  styleUrls: ['./friend-request.component.css']
})
export class FriendRequestComponent implements OnInit {
  @Input() request?: FriendRequest;
  profilePicPath?: string;
  accepted = false;
  declined = false;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    if (this.request) {
      this.profilePicPath = this.userService.getProfilePicPath(this.request?.sender);
    }
  }

  accept(): void {
    if (this.request) {
      this.userService.acceptFriendRequest(this.request?.id).subscribe(_ => {
        this.accepted = true;
      });
    }
  }

  decline(): void {
    if (this.request) {
      this.userService.declineFriendRequest(this.request.id).subscribe(_ => {
        this.declined = true;
      });
    }
  }

}
