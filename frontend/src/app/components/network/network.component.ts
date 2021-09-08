import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent implements OnInit {
  isLoggedIn = false;
  friends?: User[];

  constructor(private tokenService: TokenStorageService, private userService: UserService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.tokenService.loggedIn();
    this.getData();
  }

  getData(): void {
    if (this.isLoggedIn) {
      this.userService.getFriends().subscribe(friends => {
        this.friends = friends;
      });
    }
  }

  getProfilePicPath(user: User) {
    return this.userService.getProfilePicPath(user);
  }

}
