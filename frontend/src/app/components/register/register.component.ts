import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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

  newUserForm = this.fb.group({
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    password: ['', Validators.required]
  });

  constructor(private authService: AuthService, private tokenService: TokenStorageService, private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.newUserForm.valid) {
      this.registerFromInvalid = false;
      const newUser: NewUser = this.newUserForm.value;

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
