import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoggedInUser } from '../models/loggedInUser.model';
import { NewUser } from '../models/newUser.model';
import { RegisteredUser } from '../models/registeredUser';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const AUTH_API = 'http://localhost:3000/auth/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<LoggedInUser> {
    return this.http.post<LoggedInUser>(AUTH_API + 'login', {
      email,
      password
    }, httpOptions);
  }

  register(newUser: NewUser): Observable<RegisteredUser> {
    return this.http.post<RegisteredUser>(AUTH_API + 'register', newUser, httpOptions);
  }
}
