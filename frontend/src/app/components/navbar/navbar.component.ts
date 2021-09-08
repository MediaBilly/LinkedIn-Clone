import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  currentUser?: User;
  profilePicPath?: string;

  notificationsCount = 0;

  constructor(private tokenStorageService: TokenStorageService, private usersService: UserService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.tokenStorageService.loggedIn();
    this.getUser();
    this.getBadgeCounts();
  }

  getUser() {
    if (this.isLoggedIn) {
      this.usersService.getUserProfile().subscribe(user => {
        this.currentUser = user;
        this.profilePicPath = this.usersService.getProfilePicPath(user);
      });
    }
  }

  getBadgeCounts(): void {
    if (this.isLoggedIn) {
      this.usersService.getReceivedFriendRequests().subscribe(requests => {
        this.notificationsCount+=requests.length;
      });
    }
  }

  logout() {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
