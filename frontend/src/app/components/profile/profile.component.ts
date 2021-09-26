import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EmploymentType } from 'src/app/enums/employment-type.enum';
import { Education } from 'src/app/models/education.model';
import { Experience } from 'src/app/models/experience.model';
import { FriendRequest } from 'src/app/models/friendRequest.model';
import { User } from 'src/app/models/user.model';
import { ChatService } from 'src/app/services/chat.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from '../../services/user.service';
import { endMonthYearValidator } from './form-validators/end-month-year-validator.directive';
import { startMonthYearValidator } from './form-validators/start-month-year-validator.directive';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  isLoggedIn = false;

  // Users data
  myUser?: User; // Logged in user
  requestUser?: User; // User with requested id or equal to myUser if we are in /profile page

  // Attributes (used in template)
  isMe = false; // True if myUser === requestUser
  areFriends = false; // True if myUser is friends with requestUser
  profilePicPath?: string; // Url to requestUser profile pic

  // Possible friend requests
  sentRequest?: FriendRequest | null;
  receivedRequest?: FriendRequest | null;

  // Other data
  friends?: User[];

  // Skills
  addSkillsForm = new FormGroup({
    skills: new FormArray([
      new FormControl('', Validators.required)
    ])
  });

  // Education form
  educationForm = new FormGroup({
    school: new FormControl('', Validators.required),
    degree: new FormControl(''),
    fieldOfStudy : new FormControl(''),
    // Start date
    startYear : new FormControl(''),
    startMonth : new FormControl(''),
    // End date
    endYear : new FormControl(''),
    endMonth : new FormControl(''),
    grade: new FormControl(''),
    description: new FormControl('')
  }, { validators: [startMonthYearValidator, endMonthYearValidator] });
  educationFormInvalid = false;
  educationFormEditMode = false;
  educationModalRef?: NgbModalRef;
  editingEducation?: Education;

  // Experience form
  experienceForm = new FormGroup({
    title: new FormControl('', Validators.required),
    company: new FormControl('', Validators.required),
    employmentType: new FormControl(''),
    location : new FormControl(''),
    // Start date
    startYear : new FormControl('', Validators.required),
    startMonth : new FormControl('', Validators.required),
    // End date
    endYear : new FormControl(''),
    endMonth : new FormControl(''),
    description: new FormControl('')
  }, { validators: [startMonthYearValidator, endMonthYearValidator] });
  experienceFormInvalid = false;
  experienceFormEditMode = false;
  experienceModalRef?: NgbModalRef;
  editingExperience?: Experience;
  employmentTypes = EmploymentType;

  constructor(private route: ActivatedRoute, 
    private tokenService: TokenStorageService, 
    private usersService: UserService, 
    private modalService: NgbModal,
    private chatService: ChatService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.tokenService.loggedIn();
    this.getUsers();
  }

  getUsers(): void {
    if (this.isLoggedIn) {
      const id = this.route.snapshot.paramMap.get('id');
      this.usersService.getUserProfile().subscribe(user => {
        this.myUser = user;
        if (!id) {
          this.setRequestUser(this.myUser);
        }
      });
      if (id) {
        this.usersService.getUserProfile(Number(id)).subscribe(user => {
          this.setRequestUser(user);
        });
      }
    }
  }

  setRequestUser(reqUser: User): void {
    this.requestUser = reqUser;
    this.profilePicPath = this.usersService.getProfilePicPath(reqUser);
    this.setAttributes();
    if (this.isMe || this.areFriends) {
      this.usersService.getFriends(reqUser.id).subscribe(friends => {
        this.friends = friends;
      });
    }
  }

  setAttributes(): void {
    // isMe
    this.isMe =  this.requestUser?.id === this.myUser?.id;
    // receivedRequest
    this.usersService.getReceivedFriendRequests().subscribe(requests => {
      this.receivedRequest = requests.find(r => r.sender.id === this.requestUser?.id);
    });
    // sentRequest
    this.usersService.getSentFriendRequests().subscribe(requests => {
      this.sentRequest = requests.find(r => r.receiver.id === this.requestUser?.id);
    });
    // areFriends
    this.usersService.getFriends().subscribe(friends => {
      this.areFriends = friends.some(f => f.id === this.requestUser?.id);
    });
  }

  sendRequest(): void {
    if (this.requestUser && !this.sentRequest) {
      this.usersService.sendFriendRequest(this.requestUser?.id).subscribe(request => {
        this.sentRequest = request;
      });
    }
  }

  acceptRequest(): void {
    if (this.receivedRequest) {
      this.usersService.acceptFriendRequest(this.receivedRequest.id).subscribe(_ => {
        this.receivedRequest = null;
        this.areFriends = true;
      });
    }
  }

  declineRequest(): void {
    if (this.receivedRequest) {
      this.usersService.declineFriendRequest(this.receivedRequest.id).subscribe(_ => {
        this.receivedRequest = null;
      });
    }
  }

  cancelFriendRequest(): void {
    if (this.sentRequest) {
      this.usersService.cancelFriendRequest(this.sentRequest.id).subscribe(_ => {
        this.sentRequest = null;
      });
    }
  }

  removeFriend(): void {
    if (this.requestUser && this.areFriends) {
      this.usersService.removeFriend(this.requestUser?.id).subscribe(_ => {
        this.areFriends = false;
      });
    }
  }

  profilePicUpload(event: any):void {
    if (this.myUser && this.isMe) {
      const pic: File = event.target.files[0];
      if (pic) {
        this.usersService.changeProfilePic(pic).subscribe(updatedUser => {
          this.myUser = updatedUser;
          this.requestUser = updatedUser;
          this.profilePicPath = this.usersService.getProfilePicPath(this.myUser);
        });
      }
    }
  }

  message() {
    if (this.isLoggedIn && this.requestUser && this.myUser && this.myUser.id !== this.requestUser.id) {
      this.chatService.getChats().subscribe(chats => {
        let chatExists = false;
        for (let chat of chats) {
          if (chat.users.some(u => u.id === this.requestUser?.id)) {
            chatExists = true;
            break;
          }
        }
        if (this.requestUser) {
          if (!chatExists) {
            this.chatService.createChat(this.requestUser.id).subscribe(_ => {
              window.location.replace('messaging');
            });
          } else {
            window.location.replace('messaging');
          }
        }
      });
    }
  }

  get newSkills() {
    return this.addSkillsForm.get('skills') as FormArray;
  }

  addSkill() {
    this.newSkills.push(new FormControl('', Validators.required));
  }

  resetSkillsForm(): void {
    this.newSkills.clear();
    this.newSkills.push(new FormControl('', Validators.required));
    this.addSkillsForm.reset();
  }

  addNewSkills() {
    if (this.isMe && this.addSkillsForm.valid) {
      this.usersService.addSkills(this.addSkillsForm.value.skills).subscribe(user => {
        this.myUser = this.requestUser = user;
        this.resetSkillsForm();
      });
    }
  }

  removeSkill(id: number): void {
    if (this.isMe) {
      this.usersService.removeSkill(id).subscribe(user => {
        this.myUser = this.requestUser = user;
      });
    }
  }

  // Generates range between [0,n)
  counter(n: number) {
    return new Array(n);
  }

  // Education form

  public educationFieldIsInvalid = (field: string) => {
    return this.educationFormInvalid && this.educationForm.controls[field].invalid;
  }

  public educationFieldHasError = (field: string, error: string) => {
    return this.educationForm.controls[field].hasError(error);
  }

  onEducationFormSubmit() {
    if (this.isMe && this.educationForm.valid) {
      this.educationFormInvalid = false;
      if (!this.educationFormEditMode) {
        this.usersService.addEducation(this.educationForm.value).subscribe(user => {
          this.myUser = user;
          this.requestUser = user;
        });
      } else {
        if (this.editingEducation) {
          this.usersService.updateEducation(this.editingEducation?.id, this.educationForm.value).subscribe();
        }
      }
      this.educationModalRef?.close();
      this.educationForm.reset();
    } else {
      this.educationFormInvalid = true;
    }
  }

  openNewEducationModal(modalContent: any): void {
    this.educationForm.reset();
    this.educationFormEditMode = false;
    this.educationModalRef = this.modalService.open(modalContent, { ariaLabelledBy: 'educationModalLabel' });
  }

  openEducationEditor(education: Education, modalContent: any): void {
    this.educationForm.reset();
    this.educationFormEditMode = true;
    this.editingEducation = education;
    let { startDate, endDate, id, ...restData } = education;
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    this.educationForm.setValue({ ...restData, 
      startYear: startDate.getFullYear(),
      endYear: endDate.getFullYear(),
      startMonth: startDate.getMonth(),
      endMonth: endDate.getMonth() 
    });
    this.educationModalRef = this.modalService.open(modalContent, { ariaLabelledBy: 'educationModalLabel' });
  }

  removeEducation(id: number) {
    if (this.isMe) {
      this.usersService.removeEducation(id).subscribe(user => {
        this.myUser = this.requestUser = user;
      });
    }
  }

  // Experience form 

  public experienceFieldIsInvalid = (field: string) => {
    return this.experienceFormInvalid && this.experienceForm.controls[field].invalid;
  }

  public experienceFieldHasError = (field: string, error: string) => {
    return this.experienceForm.controls[field].hasError(error);
  }

  onExperienceFormSubmit() {
    if (this.isMe && this.experienceForm.valid) {
      this.experienceFormInvalid = false;
      if (!this.experienceFormEditMode) {
        this.usersService.addExperience(this.experienceForm.value).subscribe(user => {
          this.myUser = user;
          this.requestUser = user;
        });
      } else {
        if (this.editingExperience) {
          this.usersService.updateExperience(this.editingExperience?.id, this.experienceForm.value).subscribe();
        }
      }
      this.experienceModalRef?.close();
      this.experienceForm.reset();
    } else {
      this.experienceFormInvalid = true;
    }
  }

  openNewExperienceModal(modalContent: any): void {
    this.experienceForm.reset();
    this.experienceFormEditMode = false;
    this.experienceModalRef = this.modalService.open(modalContent, { ariaLabelledBy: 'experienceModalLabel' });
  }

  openExperienceEditor(experience: Experience, modalContent: any): void {
    this.experienceForm.reset();
    this.experienceFormEditMode = true;
    this.editingExperience = experience;
    let { startDate, endDate, id, company, ...restData } = experience;
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    this.experienceForm.setValue({ ...restData, 
      company: company.name,
      startYear: startDate.getFullYear(),
      endYear: endDate.getFullYear(),
      startMonth: startDate.getMonth(),
      endMonth: endDate.getMonth() 
    });
    this.experienceModalRef = this.modalService.open(modalContent, { ariaLabelledBy: 'experienceModalLabel' });
  }

  removeExperience(id: number) {
    if (this.isMe) {
      this.usersService.removeExperience(id).subscribe(user => {
        this.myUser = this.requestUser = user;
      });
    }
  }

}
