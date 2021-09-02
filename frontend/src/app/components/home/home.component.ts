import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;
  content?: string;

  constructor(private tokenStorageService: TokenStorageService) { 
  }

  ngOnInit(): void {
    this.isLoggedIn = this.tokenStorageService.loggedIn();
    this.content = this.isLoggedIn ? 'HOME PAGE UNDER CONSTRUCTION' : 'Welcome Page';
  }

}
