import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserRole } from '../models/user.model';
import { TokenStorageService } from '../services/token-storage.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private tokenStorageService: TokenStorageService, private usersService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      if (!this.tokenStorageService.loggedIn()) {
        return false;
      }

      return this.usersService.getUserProfile().toPromise().then(loggedInUser => {
        if (loggedInUser.role === UserRole.Admin) {
          return true;
        }
        this.router.navigate(['']);
        return false;
      });
  }
  
}
