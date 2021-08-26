import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:3000/';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  getUserProfile(uid?: string): Observable<any> {
    if (uid) {
      return this.httpClient.get(API_URL + 'users/' + uid, { responseType: 'json' });
    } else {
      return this.httpClient.get(API_URL + 'profile/', { responseType: 'json' });
    }
  }
}
