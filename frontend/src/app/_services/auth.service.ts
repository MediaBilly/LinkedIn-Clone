import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const AUTH_API = 'http://localhost:3000/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'auth/login', {
      email,
      password
    }, httpOptions);
  }

  register(firstname: string, lastname: string, email: string, phone: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'users', {
      firstname,
      lastname,
      email,
      phone,
      password
    }, httpOptions);
  }
}
