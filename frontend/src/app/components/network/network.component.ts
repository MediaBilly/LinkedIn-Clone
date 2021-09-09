import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  errorMsg = '';

  constructor(private route: ActivatedRoute, private tokenService: TokenStorageService, private userService: UserService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.tokenService.loggedIn();
    this.getData();
  }

  getData(): void {
    if (this.isLoggedIn) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.userService.getFriends(Number(id)).subscribe(friends => {
          this.friends = friends;
        }, this.handleError);
      } else {
        this.userService.getFriends().subscribe(friends => {
          this.friends = friends;
        }, this.handleError);
      }
    }
  }

  getProfilePicPath(user: User) {
    return this.userService.getProfilePicPath(user);
  }

  handleError(err: any): void {
    if (err.status === 403) {
      this.errorMsg = "Connection list of not connected professionals not available."
    } else {
      this.errorMsg = err.message;
    }
  }

}
