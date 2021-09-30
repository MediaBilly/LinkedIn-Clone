import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EmploymentType } from 'src/app/enums/employment-type.enum';
import { JobAlert } from 'src/app/models/job-alert.model';
import { User } from 'src/app/models/user.model';
import { JobsService } from 'src/app/services/jobs.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {
  isLoggedIn = false;
  recommendedJobs?: JobAlert[];
  myJobs?: JobAlert[];
  jobModalRef?: NgbModalRef;
  loggedInUser?: User;

  newJobForm = new FormGroup({
    company: new FormControl('', Validators.required),
    title: new FormControl('', Validators.required),
    location: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    requiredSkills: new FormArray([
      new FormControl('', Validators.required)
    ])
  });
  newJobFormInvalid = false;
  employmentTypes = EmploymentType;

  constructor(
    private jobsService: JobsService, 
    private tokenStorageService: TokenStorageService,
    private usersService: UserService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.tokenStorageService.loggedIn();
    if (this.isLoggedIn) {
      this.jobsService.getRecommndedJobAlerts().subscribe(jobs => {
        this.recommendedJobs = jobs.sort((a, b) => b.commonSkills - a.commonSkills);
      });
      this.jobsService.getMyJobAlerts().subscribe(jobs => {
        this.myJobs = jobs;
      });
      this.usersService.getUserProfile(undefined, false).subscribe(user => {
        this.loggedInUser = user;
        console.log(this.loggedInUser);
      });
    }
  }

  openJobModal(content: any) {
    this.resetNewJobForm();
    this.jobModalRef = this.modalService.open(content, { ariaLabelledBy: 'create-job-alert' });
  }

  // Returns a list of the companies that the logged in user worked
  workedCompanies() {
    const companies = new Map<string, number>();
    this.loggedInUser?.experiences.forEach(e => {
      companies.set(e.company.name, e.company.id);
    });
    return companies;
  }

  get jobSkills() {
    return this.newJobForm.get('requiredSkills') as FormArray;
  }

  addJobSkill() {
    this.jobSkills.push(new FormControl('', Validators.required));
  }

  resetNewJobForm(): void {
    this.jobSkills.clear();
    this.jobSkills.push(new FormControl('', Validators.required));
    this.newJobFormInvalid = false;
    this.newJobForm.reset();
  }

  public jobFieldIsInvalid = (field: string) => {
    return this.newJobFormInvalid && this.newJobForm.controls[field].invalid;
  }

  public jobFieldHasError = (field: string, error: string) => {
    return this.newJobForm.controls[field].hasError(error);
  }

  onNewJobFormSubmit() {
    if (this.newJobForm.valid) {
      this.newJobFormInvalid = false;
      this.jobsService.createJobAlert(this.newJobForm.value).subscribe(newJob => {
        this.myJobs?.unshift(newJob);
      });
      this.jobModalRef?.close();
      this.resetNewJobForm();
    } else {
      this.newJobFormInvalid = true;
    }
  }

}
