import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Notification, NotificationType } from 'src/app/models/notification.model';
import { ArticlesService } from 'src/app/services/articles.service';
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

  constructor(private userService: UserService, private articlesService: ArticlesService, private selfRef: ElementRef<HTMLElement>) { }

  ngOnInit(): void {
    if (this.notification) {
      if (this.notification.refererUser) {
        this.imgPath = this.userService.getProfilePicPath(this.notification.refererUser);
        if (this.notification.type === NotificationType.ACCEPTED_FRIEND_REQUEST) {
          this.text = this.notification.refererUser.firstname + ' ' + this.notification.refererUser.lastname + ' accepted your connection request.';
          this.link = '/user/' + this.notification.refererUser.id.toString();
        }
        if (this.notification.type === NotificationType.ARTICLE_REACTION) {
          this.articlesService.getReaction(this.notification.refererEntity).subscribe(reaction => {
            this.text = this.notification?.refererUser.firstname + ' ' + this.notification?.refererUser.lastname + ' reacted to your article.';
            if (reaction) {
              this.link = '/article/' + reaction.article.id.toString();
            } else {
              this.selfDestruct();
            }
          });
        }
        if (this.notification.type === NotificationType.ARTICLE_COMMENT) {
          this.articlesService.getComment(this.notification.refererEntity).subscribe(comment => {
            this.text = this.notification?.refererUser.firstname + ' ' + this.notification?.refererUser.lastname + ' commented on your article';
            if (comment) {
              this.text += ': ' + comment.text;
              this.link = '/article/' + comment.article.id.toString();
            } else {
              this.selfDestruct();
            }
          })
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

  selfDestruct() {
    this.selfRef.nativeElement.remove();
  }

}
