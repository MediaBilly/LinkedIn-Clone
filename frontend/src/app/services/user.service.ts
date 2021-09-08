import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FriendRequest } from '../models/friendRequest.model';
import { UpdateUser } from '../models/updateUser.model';
import { User } from '../models/user.model';

const API_URL = 'http://localhost:3000/';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  // Basic Functionality

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

  // Friend requests

  getSentFriendRequests(): Observable<FriendRequest[]> {
    return this.httpClient.get<FriendRequest[]>(API_URL + 'users/friend-requests/sent', { responseType: 'json' })
  }

  getReceivedFriendRequests(): Observable<FriendRequest[]> {
    return this.httpClient.get<FriendRequest[]>(API_URL + 'users/friend-requests/received', { responseType: 'json' });
  }

  sendFriendRequest(receiverId: number): Observable<FriendRequest> {
    return this.httpClient.post<FriendRequest>(API_URL + 'users/friend-requests/send/' + receiverId.toString(), { responseType: 'json' });
  }

  acceptFriendRequest(id: number): Observable<any> {
    return this.httpClient.post(API_URL + 'users/friend-requests/accept/' + id.toString(), {}, { responseType: 'json' });
  }

  declineFriendRequest(id: number): Observable<any> {
    return this.httpClient.post(API_URL + 'users/friend-requests/decline/' + id.toString(), {}, { responseType: 'json' });
  }

  cancelFriendRequest(id: number): Observable<any> {
    return this.httpClient.delete(API_URL + 'users/friend-requests/cancel/' + id.toString(), { responseType: 'json' });
  }

  // Friendships

  getFriends(): Observable<User[]> {
    return this.httpClient.get<User[]>(API_URL + 'users/friends/mine', { responseType: 'json' });
  }

  removeFriend(fid: number): Observable<any> {
    return this.httpClient.delete(API_URL + 'users/friends/' + fid.toString(), { responseType: 'json' });
  }
}
