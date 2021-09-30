import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
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
  searchBox = new FormControl('');

  notificationsCount = 0;

  constructor(private tokenStorageService: TokenStorageService, private usersService: UserService, private router: Router) {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(e => {
      this.init();
    });
  }

  ngOnInit(): void {
  }

  init() {
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
    this.notificationsCount = 0;
    if (this.isLoggedIn) {
      this.usersService.getReceivedFriendRequests().subscribe(requests => {
        this.notificationsCount += requests.length;
      });
      this.usersService.getNotifications().subscribe(notifications => {
        this.notificationsCount += notifications.filter(n => n.read === false).length;
      });
    }
  }

  search(): void {
    if (this.searchBox.value) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchBox.value } });
    }
  }

  logout() {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
