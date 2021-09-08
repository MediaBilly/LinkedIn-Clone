import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FriendRequest } from 'src/app/models/friendRequest.model';
import { User } from 'src/app/models/user.model';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  isLoggedIn = false;

  // Users data
  myUser?: User; // Logged in user
  requestUser?: User; // User with requested id or equal to myUser if we are in /profile page

  // Attributes (used in template)
  isMe = false; // True if myUser === requestUser
  areFriends = false; // True if myUser is friends with requestUser
  profilePicPath?: string; // Url to requestUser profile pic

  // Possible friend requests
  sentRequest?: FriendRequest | null;
  receivedRequest?: FriendRequest | null;

  constructor(private route: ActivatedRoute, private tokenService: TokenStorageService, private usersService: UserService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.tokenService.loggedIn();
    this.getUsers();
  }

  getUsers(): void {
    if (this.isLoggedIn) {
      const id = this.route.snapshot.paramMap.get('id');
      this.usersService.getUserProfile().subscribe(user => {
        this.myUser = user;
        if (!id) {
          this.setRequestUser(this.myUser);
        }
      });
      if (id) {
        this.usersService.getUserProfile(id).subscribe(user => {
          this.setRequestUser(user);
        });
      }
    }
  }

  setRequestUser(reqUser: User): void {
    this.requestUser = reqUser;
    this.profilePicPath = this.usersService.getProfilePicPath(reqUser);
    this.setAttributes();
  }

  setAttributes(): void {
    // isMe
    this.isMe =  this.requestUser?.id === this.myUser?.id;
    // receivedRequest
    this.usersService.getReceivedFriendRequests().subscribe(requests => {
      this.receivedRequest = requests.find(r => r.sender.id === this.requestUser?.id);
    });
    // sentRequest
    this.usersService.getSentFriendRequests().subscribe(requests => {
      this.sentRequest = requests.find(r => r.receiver.id === this.requestUser?.id);
    });
    // areFriends
    this.usersService.getFriends().subscribe(friends => {
      this.areFriends = friends.some(f => f.id === this.requestUser?.id);
    });
  }

  sendRequest(): void {
    if (this.requestUser && !this.sentRequest) {
      this.usersService.sendFriendRequest(this.requestUser?.id).subscribe(request => {
        this.sentRequest = request;
      });
    }
  }

  acceptRequest(): void {
    if (this.receivedRequest) {
      this.usersService.acceptFriendRequest(this.receivedRequest.id).subscribe(_ => {
        this.receivedRequest = null;
        this.areFriends = true;
      });
    }
  }

  declineRequest(): void {
    if (this.receivedRequest) {
      this.usersService.declineFriendRequest(this.receivedRequest.id).subscribe(_ => {
        this.receivedRequest = null;
      });
    }
  }

  cancelFriendRequest(): void {
    if (this.sentRequest) {
      this.usersService.cancelFriendRequest(this.sentRequest.id).subscribe(_ => {
        this.sentRequest = null;
      });
    }
  }

  removeFriend(): void {
    if (this.requestUser && this.areFriends) {
      this.usersService.removeFriend(this.requestUser?.id).subscribe(_ => {
        this.areFriends = false;
      });
    }
  }

}
