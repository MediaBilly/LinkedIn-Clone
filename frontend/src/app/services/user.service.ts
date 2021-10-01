import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FriendRequest } from '../models/friendRequest.model';
import { Notification } from '../models/notification.model';
import { UpdateUser } from '../models/updateUser.model';
import { User } from '../models/user.model';
import { shareReplay } from 'rxjs/operators/';
import { EducationsSorterPipe } from '../pipes/educations-sorter.pipe';
import { ExperiencesSorterPipe } from '../pipes/experiences-sorter.pipe';
import { UserExport } from '../models/user-export.model';
import { VisibilitySettings } from '../models/visibility-settings.model';

const API_URL = 'https://localhost:3000/';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Frequently used personal info observables cached with shareReplay to avoid multiple http requests
  currentUser$: Observable<User> | null = null;
  connections$: Observable<User[]> | null = null;

  constructor(private httpClient: HttpClient, private educationsSorterPipe: EducationsSorterPipe, private experiencesSorterPipe: ExperiencesSorterPipe) { }

  // Basic Functionality

  getUserProfile(uid?: number, cached: boolean = true): Observable<User> {
    if (uid) {
      return this.httpClient.get<User>(API_URL + 'users/' + uid.toString(), { responseType: 'json' });
    } else {
      if (!this.currentUser$ || this.currentUser$ && !cached) {
        this.currentUser$ = this.httpClient.get<User>(API_URL + 'profile/', { responseType: 'json' }).pipe(
          shareReplay()
        );
      }
      return this.currentUser$;
    }
  }

  query(q: string): Observable<User[]> {
    return this.httpClient.get<User[]>(API_URL + 'users?q=' + q, { responseType: 'json' });
  }

  getProfilePicPath(user?: User): string {
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

  deleteMyAccount(): Observable<any> {
    return this.httpClient.delete(API_URL + 'users', { responseType: 'json' });
  }

  getVisibilitySettings(): Observable<VisibilitySettings> {
    return this.httpClient.get<VisibilitySettings>(API_URL + 'users/visibilitySettings', { responseType: 'json' });
  }

  updateVisibilitySettings(newVisibilitySettings: VisibilitySettings): Observable<VisibilitySettings> {
    return this.httpClient.post<VisibilitySettings>(API_URL + 'users/visibilitySettings', newVisibilitySettings, { responseType: 'json' });
  }

  getHeadline(user: User): string {
    if (user.experiences && user.experiences.length > 0) {
      const exp0 = this.experiencesSorterPipe.transform(user.experiences)[0];
      return exp0.title + ' @ ' + exp0.company.name;
    } else if (user.educations && user.educations.length > 0) {
      const edu0 = this.educationsSorterPipe.transform(user.educations)[0];
      return 'Student @ ' + edu0.school;
    } else {
      return '';
    }
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

  getFriends(uid?: number, cached: boolean = true): Observable<User[]> {
    if (uid) {
      return this.httpClient.get<User[]>(API_URL + 'users/friends/' + uid?.toString(), { responseType: 'json' });
    } else {
      if (!this.connections$ || this.connections$ && !cached) {
        this.connections$ = this.httpClient.get<User[]>(API_URL + 'users/friends/mine', { responseType: 'json' }).pipe(
          shareReplay()
        );
      }
      return this.connections$;
    }
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

  private preprocessEducationData(eduData: any) {
    const { startMonth, startYear, endMonth, endYear, ...rest } = eduData;
    const startDate = startYear ? { startDate: new Date(startYear, startMonth ? startMonth : '0').toISOString() } : {};
    const endDate = endYear ? { endDate: new Date(endYear, endMonth ? endMonth : '0').toISOString() } : {};
    const formData = { ...rest, ...startDate, ...endDate };
    return formData;
  }

  addEducation(eduData: any): Observable<User> {
    return this.httpClient.post<User>(API_URL+ 'users/education', this.preprocessEducationData(eduData), { responseType: 'json' });
  }

  updateEducation(id: number, eduData: any): Observable<any> {
    return this.httpClient.put(API_URL + 'users/education/' + id.toString(), this.preprocessEducationData(eduData), { responseType: 'json' });
  }

  removeEducation(id: number): Observable<User> {
    return this.httpClient.delete<User>(API_URL + 'users/education/' + id.toString(), { responseType: 'json' });
  }

  // Experience

  private preprocessExperienceData(expData: any) {
    const { startMonth, startYear, endMonth, endYear, ...rest } = expData;
    const startDate = startYear ? { startDate: new Date(startYear, startMonth ? startMonth : '0').toISOString() } : {};
    const endDate = endYear ? { endDate: new Date(endYear, endMonth ? endMonth : '0').toISOString() } : {};
    const formData = { ...rest, ...startDate, ...endDate };
    return formData;
  }

  addExperience(expData: any): Observable<User> {
    return this.httpClient.post<User>(API_URL+ 'users/experience', this.preprocessExperienceData(expData), { responseType: 'json' });
  }

  updateExperience(id: number, expData: any): Observable<any> {
    return this.httpClient.put(API_URL + 'users/experience/' + id.toString(), this.preprocessExperienceData(expData), { responseType: 'json' });
  }

  removeExperience(id: number): Observable<User> {
    return this.httpClient.delete<User>(API_URL + 'users/experience/' + id.toString(), { responseType: 'json' });
  }

  // Admin Stuff
  
  getAllUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(API_URL + 'users', { responseType: 'json' });
  }

  getSomeUsers(ids: number[]): Observable<UserExport[]> {
    return this.httpClient.post<UserExport[]>(API_URL + 'users/export', { ids: ids }, { responseType: 'json' });
  }

  deleteUser(id: number): Observable<any> {
    return this.httpClient.delete(API_URL + 'users/' + id.toString(), { responseType: 'json' });
  }

  changeUserPassword(uid: number, newPassword: string): Observable<any> {
    return this.httpClient.patch(API_URL + 'users/change-password/' + uid.toString(), { newPassword: newPassword }, { responseType: 'json' });
  }

  updateUserWithId(uid: number, updatedUser: UpdateUser): Observable<any> {
    return this.httpClient.put(API_URL + 'users/' + uid.toString(), updatedUser, { responseType: 'json' });
  }
}
