import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;
  currentUser: any;

  constructor(private tokenStorageService: TokenStorageService, private usersService: UserService) { 
  }

  ngOnInit(): void {
    this.isLoggedIn = this.tokenStorageService.loggedIn();
    if (this.isLoggedIn) {
      this.usersService.getUserProfile().subscribe(user => {
        this.currentUser = user;
      });
    }
  }

}
