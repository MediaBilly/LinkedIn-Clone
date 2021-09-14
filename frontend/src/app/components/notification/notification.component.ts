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
      if (this.notification.refererUser) {
        this.imgPath = this.userService.getProfilePicPath(this.notification.refererUser);
        if (this.notification.type === NotificationType.ACCEPTED_FRIEND_REQUEST) {
          this.text = this.notification.refererUser.firstname + ' ' + this.notification.refererUser.lastname + ' accepted your connection request.';
          this.link = '/user/' + this.notification.refererUser.id.toString();
        }
        if (this.notification.type === NotificationType.ARTICLE_REACTION) {
          this.text = this.notification.refererUser.firstname + ' ' + this.notification.refererUser.lastname + ' reacted to your article.';
          this.link = '/user/' + this.notification.refererUser.id.toString();
        }
        if (this.notification.type === NotificationType.ARTICLE_COMMENT) {
          this.text = this.notification.refererUser.firstname + ' ' + this.notification.refererUser.lastname + ' commented on your article.';
          this.link = '/user/' + this.notification.refererUser.id.toString();
        }
      }
      if (!this.notification.read) {
        this.read();
      }
    }
  }

  read(): void {
    if (this.notification) {
      this.userService.readNotification(this.notification?.id).subscribe();
    }
  }

}
