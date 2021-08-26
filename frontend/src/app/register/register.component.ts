import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: any = {
    firstname: null,
    lastname: null,
    email: null,
    phone: null,
    password: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService, private tokenService: TokenStorageService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const { firstname, lastname, email, phone, password } = this.form;

    this.authService.register(firstname, lastname, email, phone, password).subscribe(
      data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.tokenService.saveToken(data.access_token);
        this.gotoHomePage();
      },
      err => {
        this.errorMessage = err.message;
        this.isSignUpFailed = true;
      }
    );
  }

  gotoHomePage(): void {
    window.location.replace('');
  }
}
