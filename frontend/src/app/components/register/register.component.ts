import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  errorMessage = '';

  newUserForm = this.fb.group({
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    password: ['', Validators.required]
  });

  get firstname() { return this.newUserForm.get('firstname'); }

  get lastname() { return this.newUserForm.get('lastname'); }

  get email() { return this.newUserForm.get('email'); }

  get phone() { return this.newUserForm.get('phone'); }

  get password() { return this.newUserForm.get('password'); }

  constructor(private authService: AuthService, private tokenService: TokenStorageService, private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.newUserForm.valid) {
      const { firstname, lastname, email, phone, password } = this.newUserForm.value;

      this.authService.register(firstname, lastname, email, phone, password).subscribe(
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
    }
  }

  gotoHomePage(): void {
    window.location.replace('');
  }
}
