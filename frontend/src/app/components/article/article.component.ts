import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Article } from 'src/app/models/article.model';
import { ArticleComment } from 'src/app/models/articleComment.model';
import { ArticleReaction, ReactionType } from 'src/app/models/articleReaction.model';
import { User } from 'src/app/models/user.model';
import { ArticlesService } from 'src/app/services/articles.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  // Article Data
  @Input() article?: Article | null;
  publisherPicPath = '';
  myPicPath = '';
  loggedInUser?: User;
  myReaction?: ArticleReaction | null;
  top3Reactions: { type: string, count: number }[] = [];
  commentsOn = false;
  newComment = new FormControl('');
  commentsSorted?: ArticleComment[];
  imagePaths: string[] = [];
  videoPaths: string[] = [];

  // Parameters
  isHomePage = false;
  isMine = false;

  displayReactor?: User;

  constructor(private tokenStorageService: TokenStorageService, private usersService: UserService, private articlesService: ArticlesService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    if (this.tokenStorageService.loggedIn()) {
      this.usersService.getUserProfile().subscribe(user => {
        this.loggedInUser = user;
        this.myPicPath = this.usersService.getProfilePicPath(this.loggedInUser);
        this.isHomePage = this.route.snapshot.url.length === 0;
        if (this.article) {
          this.initArticleData();
        } else {
          const id = this.route.snapshot.paramMap.get('id');
          if (id) {
            this.articlesService.getArticle(+id).subscribe(a => {
              this.article = a;
              this.initArticleData();
            });
          }
        }
      });
    }
  }

  initArticleData(): void {
    if (this.article) {
      this.publisherPicPath = this.usersService.getProfilePicPath(this.article?.publisher);
      if (this.article.reactions && this.article.reactions.length > 0) {
        this.myReaction = this.article.reactions.find(reaction => reaction.reactor.id === this.loggedInUser?.id);
      }
      this.updateTop3Reactions();
      this.imagePaths = this.articlesService.getImagePaths(this.article);
      this.videoPaths = this.articlesService.getVideoPaths(this.article);
      this.commentsSorted = this.article?.comments.sort((a, b) => new Date(a.commented_at).getTime() - new Date(b.commented_at).getTime());
      this.isMine = this.article.publisher.id === this.loggedInUser?.id;
      this.usersService.getFriends().subscribe(connections => {
        if (this.article?.publisher.id !== this.loggedInUser?.id && !connections.some(c => c.id === this.article?.publisher.id)) {
          this.displayReactor = this.article?.reactions.find(r => r.id !== this.loggedInUser?.id && connections.some(c => c.id === r.reactor.id))?.reactor;
        }
      });
    }
  }

  updateTop3Reactions(): void {
    if (this.article?.reactions) {
      let reactionCnt = new Map<string, number>();
      for (let r of this.article.reactions) {
        if (reactionCnt.has(r.type)) {
          let curr = reactionCnt.get(r.type);
          if (curr) {
            reactionCnt.set(r.type, curr+1);
          }
        } else {
          reactionCnt.set(r.type, 1);
        }
      }
      this.top3Reactions = Array.from(reactionCnt.entries(), ([key, cnt]) => ({ type: key, count: cnt })).sort(r => r['count']).slice(0,3);
    }
  }

  delete(): void {
    if (this.article && this.isMine) {
      this.articlesService.deleteArticle(this.article.id).subscribe(_ => {
        this.article = null;
      });
    }
  }

  addReaction() {
    if (this.article && !this.myReaction) {
      this.articlesService.reactToArticle(this.article?.id, ReactionType.LIKE).subscribe(reaction => {
        this.myReaction = reaction;
        this.article?.reactions.push(reaction);
        this.updateTop3Reactions();
      });
    }
  }

  removeReaction() {
    if (this.article && this.myReaction) {
      this.articlesService.removeReaction(this.myReaction.id).subscribe(_ => {
        this.myReaction = null;
        this.article?.reactions.splice(this.article.reactions.findIndex(r => r.id === this.myReaction?.id));
        this.updateTop3Reactions();
      });
    }
  }

  showComments(): void {
    if (this.article) {
      this.commentsOn = true;
    }
  }

  getCommenterImgPath(commenter: User): string {
    return this.usersService.getProfilePicPath(commenter);
  }

  addComment(): void {
    if (this.article && this.newComment.value) {
      this.articlesService.addArticleComment(this.article.id, this.newComment.value).subscribe(comment => {
        this.article?.comments.push(comment);
        this.newComment.reset();
      });
    }
  }

  deleteComment(id: number): void {
    this.articlesService.deleteComment(id).subscribe(_ => {
      this.commentsSorted = this.commentsSorted?.filter(c => c.id !== id);
    });
  }

  commentIsMine(comment: ArticleComment): boolean {
    return comment.commenter.id === this.loggedInUser?.id;
  }

}
