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
  loginFormInvalid = false;
  errorMessage = '';

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loginFormInvalid = false;
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe(
        data => {
          this.tokenStorage.saveToken(data.access_token);
          this.gotoHomePage();
        },
        err => {
          if (err.status === 401) {
            this.errorMessage = "Wrong password."
          } else if (err.status === 404) {
            this.errorMessage = "A user with the email provided does not exist."
          } else {
            this.errorMessage = err.message;
          }
        }
      );
    } else {
      this.loginFormInvalid = true;
    }
  }

  public fieldIsInvalid = (field: string) => {
    return this.loginFormInvalid && this.loginForm.controls[field].invalid;
  }

  public fieldHasError = (field: string, error: string) => {
    return this.loginForm.controls[field].hasError(error);
  }

  gotoHomePage(): void {
    window.location.replace('');
  }
}
