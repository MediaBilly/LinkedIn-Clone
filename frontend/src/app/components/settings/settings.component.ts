import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UpdateUser } from 'src/app/models/updateUser.model';
import { User } from 'src/app/models/user.model';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from 'src/app/services/user.service';
import { repeatPasswordMatchesValidator } from '../../form-validators/repeat-password-matches.directive';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  constructor(private tokenStorageService: TokenStorageService, private userService: UserService) { }

  isLoggedIn = false;
  currentUser?: User;

  updateUserForm = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', Validators.required)
  });

  updateUserFormInvalid = false;
  successfullyUpdatedUser?: boolean;
  updateUserError = '';

  changePasswordForm = new FormGroup({
    oldPassword: new FormControl('', Validators.required),
    newPassword: new FormControl('', Validators.required),
    repeatPassword: new FormControl('', Validators.required)
  }, { validators: repeatPasswordMatchesValidator });

  changePasswordFormInvalid = false;
  successfullyChangedPassword?: boolean;
  changePasswordError = '';

  visibilitySettingsForm = new FormGroup({
    experienceVisible: new FormControl(true),
    educationVisible: new FormControl(true),
    skillsVisible: new FormControl(true)
  });
  
  successfullyChangedVisibilitySettings?: boolean;
  changeVisibilitySettingsError = '';

  ngOnInit(): void {
    this.isLoggedIn = this.tokenStorageService.loggedIn();
    this.getUser();
  }

  getUser() {
    if (this.isLoggedIn) {
      this.userService.getUserProfile().subscribe(user => {
        this.currentUser = user;
        this.updateUserForm.setValue({
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          phone: user.phone
        });
      });
      this.userService.getVisibilitySettings().subscribe(visSettings => {
        const { id, user,  ...value } = visSettings;
        this.visibilitySettingsForm.setValue(value);
      });
    }
  }

  onUserUpdate() {
    if (this.updateUserForm.valid) {
      this.updateUserFormInvalid = false;
      const userUpdate: UpdateUser = this.updateUserForm.value;
      this.userService.updateUser(userUpdate).subscribe(_ => {
        this.successfullyUpdatedUser = true;
      },
      err => {
        this.updateUserError = err.message;
        this.successfullyUpdatedUser = false;
      })
    } else {
      this.updateUserFormInvalid = true;
    }
  }

  public updateUserFieldIsInvalid = (field: string) => {
    return this.updateUserFormInvalid && this.updateUserForm.controls[field].invalid;
  }

  public updateUserFieldHasError = (field: string, error: string) => {
    return this.updateUserForm.controls[field].hasError(error);
  }

  onPasswordChange() {
    if (this.changePasswordForm.valid) {
      this.changePasswordFormInvalid = false;
      const { oldPassword, newPassword, repeatPassword } = this.changePasswordForm.value;
      this.userService.changePassword(oldPassword, newPassword).subscribe(_ => {
        this.successfullyChangedPassword = true;
      },
      err => {
        if (err.status === 403) {
          this.changePasswordError = 'Wrong old password.'
        } else {
          this.changePasswordError = err.message;
        }
        this.successfullyChangedPassword = false;
      });
    } else {
      this.changePasswordFormInvalid = true;
    }
  }

  public changePasswordFieldIsInvalid = (field: string) => {
    return this.changePasswordFormInvalid && this.changePasswordForm.controls[field].invalid;
  }

  public changePasswordFieldHasError = (field: string, error: string) => {
    return this.changePasswordForm.controls[field].hasError(error);
  }

  onVisibilitySettingsUpdate() {
    if (this.visibilitySettingsForm.valid) {
      console.log(this.visibilitySettingsForm.value);
      this.userService.updateVisibilitySettings(this.visibilitySettingsForm.value).subscribe(_ => {
        this.successfullyChangedVisibilitySettings = true;
      },
      err => {
        this.changeVisibilitySettingsError = err.message;
        this.successfullyChangedVisibilitySettings = false;
      });
    }
  }

}
