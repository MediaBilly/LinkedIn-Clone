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

  createArticle(text: string, images: File[], videos: File[]): Observable<Article> {
    const formData = new FormData();
    formData.append('text', text);
    for (let img of images) {
      formData.append('image', img);
    }
    for (let vid of videos) {
      formData.append('video', vid);
    }
    return this.httpClient.post<Article>(API_URL + 'articles', formData, { responseType: 'json' });
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

  // Getters

  getImagePaths(article: Article): string[] {
    const ret: string[] = [];
    if (article) {
      for (let img of article.images) {
        ret.push(API_URL + 'images/article_images/' + img.name);
      }
    }
    return ret;
  }

  getVideoPaths(article: Article): string[] {
    const ret: string[] = [];
    if (article) {
      for (let vid of article.videos) {
        ret.push(API_URL + 'videos/article_videos/' + vid.name);
      }
    }
    return ret;
  }
}
