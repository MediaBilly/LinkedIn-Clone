import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoginFailed = false;
  errorMessage = '';

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  get email() { return this.loginForm.get('email'); }

  get password() { return this.loginForm.get('password'); }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe(
        data => {
          this.tokenStorage.saveToken(data.access_token);
          this.isLoginFailed = false;
          this.gotoHomePage();
        },
        err => {
          this.isLoginFailed = true;
          if (err.status === 401) {
            this.errorMessage = "Wrong password."
          } else if (err.status === 404) {
            this.errorMessage = "A user with the email provided does not exist."
          } else {
            this.errorMessage = err.message;
          }
        }
      );
    }
  }

  gotoHomePage(): void {
    window.location.replace('');
  }
}
