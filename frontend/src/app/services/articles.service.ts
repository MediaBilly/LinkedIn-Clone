import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Article } from '../models/article.model';
import { ArticleComment } from '../models/articleComment.model';
import { ArticleReaction, ReactionType } from '../models/articleReaction.model';

const API_URL = 'http://localhost:3000/';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private httpClient: HttpClient) { }

  // Basics

  getHomepageArticles(): Observable<Article[]> {
    return this.httpClient.get<Article[]>(API_URL + 'articles/homepage', { responseType: 'json' });
  }

  createArticle(text: string): Observable<Article> {
    return this.httpClient.post<Article>(API_URL + 'articles', {text: text }, { responseType: 'json' });
  }

  // Reactions

  reactToArticle(id: number, reactionType: ReactionType): Observable<ArticleReaction> {
    return this.httpClient.post<ArticleReaction>(API_URL + 'articles/' + id.toString() + '/react', { type: reactionType }, { responseType: 'json' });
  }

  removeReaction(id: number): Observable<any> {
    return this.httpClient.delete(API_URL + 'articles/reactions/' + id.toString(), { responseType: 'json' });
  }

  // Comments

  addArticleComment(id: number, text: string): Observable<ArticleComment> {
    return this.httpClient.post<ArticleComment>(API_URL + 'articles/' + id.toString() + '/comment', { text: text }, { responseType: 'json' });
  }
}
