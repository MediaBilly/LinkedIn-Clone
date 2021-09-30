import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-row',
  templateUrl: './user-row.component.html',
  styleUrls: ['./user-row.component.css']
})
export class UserRowComponent implements OnInit {
  @Input() user?: User;
  headline = '';
  profilePicPath = '';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    if (this.user) {
      this.profilePicPath = this.userService.getProfilePicPath(this.user);
      this.headline = this.userService.getHeadline(this.user);
    }
  }
}
