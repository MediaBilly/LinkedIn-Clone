import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { repeatPasswordMatchesValidator } from 'src/app/form-validators/repeat-password-matches.directive';
import { NewUser } from 'src/app/models/newUser.model';
import { AuthService } from '../../services/auth.service';
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  errorMessage = '';
  registerFromInvalid = false;

  newUserForm = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    repeatPassword: new FormControl('', Validators.required)
  }, { validators: repeatPasswordMatchesValidator });

  constructor(private authService: AuthService, private tokenService: TokenStorageService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.newUserForm.valid) {
      this.registerFromInvalid = false;
      const { repeatPassword, ...newUserData } = this.newUserForm.value;
      const newUser: NewUser = newUserData;

      this.authService.register(newUser).subscribe(
        data => {
          this.tokenService.saveToken(data.access_token);
          this.gotoHomePage();
        },
        err => {
          if (err.status === 409) {
            this.errorMessage = "A user with the email provided already exists."
          } else {
            this.errorMessage = err.message;
          }
        }
      );
    } else {
      this.registerFromInvalid = true;
    }
  }

  public fieldIsInvalid = (field: string) => {
    return this.registerFromInvalid && this.newUserForm.controls[field].invalid;
  }

  public fieldHasError = (field: string, error: string) => {
    return this.newUserForm.controls[field].hasError(error);
  }

  gotoHomePage(): void {
    window.location.replace('');
  }
}
