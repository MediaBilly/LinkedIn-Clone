import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  currentUser: any;

  constructor(private tokenStorageService: TokenStorageService, private usersService: UserService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.tokenStorageService.loggedIn();
    if (this.isLoggedIn) {
      this.usersService.getUserProfile().subscribe(user => {
        this.currentUser = user;
      });
    }
  }

  logout() {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
