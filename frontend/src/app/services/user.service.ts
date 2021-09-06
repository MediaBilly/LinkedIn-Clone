import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UpdateUser } from '../models/updateUser.model';
import { User } from '../models/user.model';

const API_URL = 'http://localhost:3000/';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  getUserProfile(uid?: string): Observable<User> {
    if (uid) {
      return this.httpClient.get<User>(API_URL + 'users/' + uid, { responseType: 'json' });
    } else {
      return this.httpClient.get<User>(API_URL + 'profile/', { responseType: 'json' });
    }
  }

  getProfilePicPath(user: User): string {
    if (user && user.profilePicName) {
      return API_URL + '/images/profile_pics/' + user.profilePicName;
    } else {
      return 'assets/profile_pic_placeholder.png';
    }
  }

  updateUser(updatedUser: UpdateUser): Observable<any> {
    return this.httpClient.put(API_URL + 'users', updatedUser, { responseType: 'json' });
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.httpClient.patch(API_URL + 'users/change-password', { oldPassword: oldPassword, newPassword: newPassword });
  }
}
