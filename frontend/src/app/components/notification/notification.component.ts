import { Component, Input, OnInit } from '@angular/core';
import { Notification, NotificationType } from 'src/app/models/notification.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  @Input() notification?: Notification;
  imgPath = '';
  text = '';
  link = '';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    if (this.notification) {
      if (this.notification.type == NotificationType.ACCEPTED_FRIEND_REQUEST && this.notification.referer) {
        this.userService.getUserProfile(this.notification.referer).subscribe(refererUser => {
          this.imgPath = this.userService.getProfilePicPath(refererUser);
          this.text = refererUser.firstname + ' ' + refererUser.lastname + ' accepted your connection request.';
          this.link = '/user/' + refererUser.id.toString();
        });
      }
      this.read();
    }
  }

  read(): void {
    if (this.notification) {
      this.userService.readNotification(this.notification?.id).subscribe();
    }
  }

}
