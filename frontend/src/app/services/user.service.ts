import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FriendRequest } from '../models/friendRequest.model';
import { Notification } from '../models/notification.model';
import { UpdateUser } from '../models/updateUser.model';
import { User } from '../models/user.model';
import { shareReplay } from 'rxjs/operators/';

const API_URL = 'http://localhost:3000/';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser$: Observable<User> | null = null;

  constructor(private httpClient: HttpClient) { }

  // Basic Functionality

  getUserProfile(uid?: number): Observable<User> {
    if (uid) {
      return this.httpClient.get<User>(API_URL + 'users/' + uid.toString(), { responseType: 'json' });
    } else {
      if (!this.currentUser$) {
        this.currentUser$ = this.httpClient.get<User>(API_URL + 'profile/', { responseType: 'json' }).pipe(
          shareReplay()
        );
      }
      return this.currentUser$;
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
    this.currentUser$ = null;
    return this.httpClient.put(API_URL + 'users', updatedUser, { responseType: 'json' });
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.httpClient.patch(API_URL + 'users/change-password', { oldPassword: oldPassword, newPassword: newPassword });
  }

  changeProfilePic(newPic: File): Observable<User> {
    const formData = new FormData();
    formData.append('pic', newPic);
    return this.httpClient.post<User>(API_URL + 'users/profile-pic', formData);
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

  getFriends(uid?: number): Observable<User[]> {
    return this.httpClient.get<User[]>(API_URL + 'users/friends/' + (uid ? uid?.toString() : 'mine'), { responseType: 'json' });
  }

  removeFriend(fid: number): Observable<any> {
    return this.httpClient.delete(API_URL + 'users/friends/' + fid.toString(), { responseType: 'json' });
  }

  // Notifications

  getNotifications(): Observable<Notification[]> {
    return this.httpClient.get<Notification[]>(API_URL + 'users/notifications/all', { responseType: 'json' });
  }

  readNotification(id: number): Observable<any> {
    return this.httpClient.post(API_URL + 'users/notifications/read/' + id.toString(), {}, { responseType: 'json' });
  }

  // Skills

  addSkills(skills: string[]): Observable<User> {
    return this.httpClient.post<User>(API_URL + 'users/skills', { skills: skills }, { responseType: 'json' });
  }

  removeSkill(id: number): Observable<User> {
    return this.httpClient.delete<User>(API_URL + 'users/skills/' + id.toString(), { responseType: 'json' });
  }

  // Education

  addEducation(eduData: any): Observable<User> {
    const { startMonth, startYear, endMonth, endYear, ...rest } = eduData;
    const startDate = startYear ? { startDate: new Date(startYear, startMonth ? startMonth : '0').toISOString() } : {};
    const endDate = endYear ? { endDate: new Date(endYear, endMonth ? endMonth : '0').toISOString() } : {};
    const formData = { ...rest, ...startDate, ...endDate };
    return this.httpClient.post<User>(API_URL+ 'users/education', formData, { responseType: 'json' });
  }

  removeEducation(id: number): Observable<User> {
    return this.httpClient.delete<User>(API_URL + 'users/education/' + id.toString(), { responseType: 'json' });
  }
}
