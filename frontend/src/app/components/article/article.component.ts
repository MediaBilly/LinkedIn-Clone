import { Component, Input, OnInit } from '@angular/core';
import { Article } from 'src/app/models/article.model';
import { ArticleReaction, ReactionType } from 'src/app/models/articleReaction.model';
import { ArticlesService } from 'src/app/services/articles.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  @Input() article?: Article;
  publisherPicPath = '';
  myReaction?: ArticleReaction | null;

  constructor(private tokenStorageService: TokenStorageService, private usersService: UserService, private articlesService: ArticlesService) { }

  ngOnInit(): void {
    if (this.article) {
      this.publisherPicPath = this.usersService.getProfilePicPath(this.article?.publisher);
      this.myReaction = this.article.reactions.find(reaction => reaction.reactor.id === this.tokenStorageService.getMyId());
    }
  }

  addReaction() {
    if (this.article && !this.myReaction) {
      this.articlesService.reactToArticle(this.article?.id, ReactionType.LIKE).subscribe(reaction => {
        this.myReaction = reaction;
        this.article?.reactions.push(reaction);
      });
    }
  }

  removeReaction() {
    if (this.article && this.myReaction) {
      this.articlesService.removeReaction(this.myReaction.id).subscribe(_ => {
        this.myReaction = null;
        this.article?.reactions.splice(this.article.reactions.findIndex(r => r.id === this.myReaction?.id));
      });
    }
  }

}
