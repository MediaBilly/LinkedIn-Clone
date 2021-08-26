import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {
    email: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  role: string = '';
  email: string = '';

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private usersService: UserService) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.usersService.getUserProfile().subscribe(user => {
        this.role = user.role;
      });
    }
  }

  onSubmit(): void {
    const { email, password } = this.form;
    console.log(email, password);

    this.authService.login(email, password).subscribe(
      data => {
        this.tokenStorage.saveToken(data.access_token);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.usersService.getUserProfile().subscribe(user => {
          this.role = user.role;
          this.email = user.email;
        });
        this.gotoHomePage();
      },
      err => {
        this.errorMessage = err.message;
        this.isLoginFailed = true;
      }
    );
  }

  gotoHomePage(): void {
    window.location.replace('');
  }
}
