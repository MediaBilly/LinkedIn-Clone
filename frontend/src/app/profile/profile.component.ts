import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  currentUser: any;

  constructor(private usersService: UserService) { }

  ngOnInit(): void {
    this.usersService.getUserProfile().subscribe(user => {
      console.log(user);
      this.currentUser = user;
    });
  }

}
