import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import exportFromJSON from 'export-from-json';
import { Subject } from 'rxjs';
import { UpdateUser } from 'src/app/models/updateUser.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { repeatPasswordMatchesValidator } from '../../form-validators/repeat-password-matches.directive';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  // Full list of the options available at:https://datatables.net/reference/option/ or node_modules/datatables.net/types/types.d.ts starting at line 1611 (interface Settings)
  dtOptions: DataTables.Settings = {};
  users: User[] = [];
  selectedUserIds = new Set<number>();
  @ViewChildren('usercheck') checkboxes!: QueryList<ElementRef>;

  dtTrigger : Subject<any> = new Subject<any>();

  // User forms
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
    newPassword: new FormControl('', Validators.required),
    repeatPassword: new FormControl('', Validators.required)
  }, { validators: repeatPasswordMatchesValidator });

  changePasswordFormInvalid = false;
  successfullyChangedPassword?: boolean;
  changePasswordError = '';

  // User modal stuff
  userModalRef?: NgbModalRef;
  editingUser?: User;

  constructor(private usersService: UserService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthChange: false
    }
    this.usersService.getAllUsers().subscribe(usrs => {
      this.users = usrs;
      this.dtTrigger.next();
    });
  }

  getUserPicPath(user: User) {
    return this.usersService.getProfilePicPath(user);
  }

  onUserCheckboxClick(user: User) {
    if (this.selectedUserIds.has(user.id)) {
      this.selectedUserIds.delete(user.id); 
    } else {
      this.selectedUserIds.add(user.id);
    }
  }

  clearSelectedUsers() {
    this.selectedUserIds.clear();
    this.checkboxes.forEach(checkbox => {
      checkbox.nativeElement.checked = false;
    });
  }

  exportToJSON(): void {
    if (this.selectedUserIds.size > 0) {
      this.usersService.getSomeUsers(Array.from(this.selectedUserIds)).subscribe(data => {
        exportFromJSON({ data: data, fileName: 'users', exportType: exportFromJSON.types.json });
        this.clearSelectedUsers();
      });
    }
  }

  exportToXML(): void {
    if (this.selectedUserIds.size > 0) {
      this.usersService.getSomeUsers(Array.from(this.selectedUserIds)).subscribe(data => {
        exportFromJSON({ data: data, fileName: 'users', exportType: exportFromJSON.types.xml });
        this.clearSelectedUsers();
      });
    }
  }

  openUserModal(selectedUser: User, modalContent: any): void {
    this.updateUserForm.reset();
    this.changePasswordForm.reset();
    this.updateUserFormInvalid = false;
    this.changePasswordFormInvalid = false;
    this.updateUserError = '';
    this.changePasswordError = '';
    this.successfullyUpdatedUser = false;
    this.successfullyChangedPassword = false;
    this.editingUser = selectedUser;
    this.updateUserForm.setValue({
      firstname: selectedUser.firstname,
      lastname: selectedUser.lastname,
      email: selectedUser.email,
      phone: selectedUser.phone
    });
    this.userModalRef = this.modalService.open(modalContent, { ariaLabelledBy: 'modal-user-update' });
  }

  onUserUpdate() {
    if (this.updateUserForm.valid && this.editingUser) {
      this.updateUserFormInvalid = false;
      const userUpdate: UpdateUser = this.updateUserForm.value;
      this.usersService.updateUserWithId(this.editingUser.id, userUpdate).subscribe(_ => {
        this.successfullyUpdatedUser = true;
      },
      err => {
        this.updateUserError = err.message;
        this.successfullyUpdatedUser = false;
      });
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
    if (this.changePasswordForm.valid && this.editingUser) {
      this.changePasswordFormInvalid = false;
      const { newPassword, ..._ } = this.changePasswordForm.value;
      this.usersService.changeUserPassword(this.editingUser.id, newPassword).subscribe(_ => {
        this.successfullyChangedPassword = true;
      },
      err => {
        this.changePasswordError = err.message;
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

  deleteUser(id: number) {
    this.usersService.deleteUser(id).subscribe(_ => {
      this.users.splice(this.users.findIndex(u => u.id === id),1);
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
