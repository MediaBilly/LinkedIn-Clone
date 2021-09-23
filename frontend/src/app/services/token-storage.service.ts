import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthToken } from '../models/auth-token.model';

const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor(private jwtHelper: JwtHelperService) { }

  signOut(): void {
    window.localStorage.clear();
  }

  public saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY);
  }

  public loggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    return !this.jwtHelper.isTokenExpired(token);
  }

  public getLoggedInId(): number {
    const token = this.getToken();
    if (token) {
      return this.jwtHelper.decodeToken<AuthToken>(token).sub;
    } else {
      return 0;
    }
  }
}
