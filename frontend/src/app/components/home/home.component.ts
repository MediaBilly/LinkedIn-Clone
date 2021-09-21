import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Article } from 'src/app/models/article.model';
import { User } from 'src/app/models/user.model';
import { ArticlesService } from 'src/app/services/articles.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;
  currentUser?: User;
  profilePicPath?: string;
  totalConnections = 0;
  articles?: Article[];
  headline?: string;

  // New article form

  newArticleForm = new FormGroup({
    text: new FormControl('', Validators.required),
    image: new FormControl(''),
    video: new FormControl('')
  });
  newArticleFormInvalid = false;
  articleImages: File[] = [];
  articleVideos: File[] = [];
  articleLoading = false;

  constructor(private tokenStorageService: TokenStorageService, private usersService: UserService, private articlesService: ArticlesService) { 
  }

  ngOnInit(): void {
    this.isLoggedIn = this.tokenStorageService.loggedIn();
    this.getUser();
    this.getArticles();
  }

  getUser() {
    if (this.isLoggedIn) {
      this.usersService.getUserProfile().subscribe(user => {
        this.currentUser = user;
        this.profilePicPath = this.usersService.getProfilePicPath(user);
        this.headline = this.usersService.getHeadline(user);
        this.usersService.getFriends().subscribe(friends => {
          this.totalConnections = friends.length;
        })
      });
    } 
  }

  getArticles(): void {
    if (this.isLoggedIn) {
      this.articlesService.getHomepageArticles().subscribe(articles => {
        this.articles = articles;
      });
    }
  }

  onImageFileChange(event: any): void {
    this.articleImages = event.target.files;
  }

  onVideoFileChange(event: any): void {
    this.articleVideos = event.target.files;
  }

  createArticle(): void {
    if (this.newArticleForm.valid) {
      this.newArticleFormInvalid = false;
      const text = this.newArticleForm.get('text')?.value;
      this.articleLoading = true;
      this.articlesService.createArticle(text, this.articleImages, this.articleVideos).subscribe(article => {
        article.reactions = [];
        article.comments = [];
        this.articles?.unshift(article);
        this.articleLoading = false;
        this.articleImages = this.articleVideos = [];
      });
      this.newArticleForm.reset();
    } else {
      this.newArticleFormInvalid = true;
    }
  }

  public newArticleFieldIsInvalid = (field: string) => {
    return this.newArticleFormInvalid && this.newArticleForm.controls[field].invalid;
  }

  public newArticleFieldHasError = (field: string, error: string) => {
    return this.newArticleForm.controls[field].hasError(error);
  }
}
