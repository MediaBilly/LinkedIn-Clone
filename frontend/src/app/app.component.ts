import { Component } from '@angular/core';
import { TokenStorageService } from './_services/token-storage.service';
import { UserService } from './_services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLoggedIn = false;

  constructor(private tokenStorageService: TokenStorageService, private usersService: UserService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
  }

  logout() {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
