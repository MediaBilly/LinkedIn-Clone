import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { JobAlert } from 'src/app/models/job-alert.model';
import { JobApplication } from 'src/app/models/job-application.model';
import { User } from 'src/app/models/user.model';
import { JobsService } from 'src/app/services/jobs.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css']
})
export class JobDetailsComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {}
  isLoggedIn = false;
  job?:JobAlert;
  loggedInUser?: User;
  isMine = false;
  applications?: JobApplication[];
  activeCoverLetter = '';
  coverLetterModalRef?: NgbModalRef;

  dtTrigger: Subject<any> = new Subject<any>();

  myApplicationForm = new FormGroup({
    coverLetter: new FormControl('')
  });

  constructor(private route: ActivatedRoute, 
    private tokenStorageService: TokenStorageService,
    private jobsService: JobsService,
    private usersService: UserService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.tokenStorageService.loggedIn();
    if (this.isLoggedIn) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.usersService.getUserProfile().subscribe(user => {
          this.loggedInUser = user;
          this.jobsService.getJobAlert(+id).subscribe(jobA => {
            this.job = jobA;
            this.isMine = this.job.creator.id === this.loggedInUser?.id;
            if (this.isMine) {
              this.dtOptions = {
                pagingType: 'full_numbers',
                pageLength: 3,
                lengthChange: false
              };
              this.jobsService.getJobApplications(this.job.id).subscribe(apps => {
                this.applications = apps;
                this.dtTrigger.next();
              });
            }
          });
        });
      }
    }
  }

  delete() {
    if (this.job && this.isMine) {
      this.jobsService.deleteJobAlert(this.job.id).subscribe(_ => {
        window.location.replace('/jobs');
      });
    }
  }

  apply() {
    if (this.job && !this.isMine) {
      const coverLetter = this.myApplicationForm.get('coverLetter')?.value as string;
      this.jobsService.applyToJob(this.job.id, coverLetter).subscribe(_ => {
        this.myApplicationForm.reset();
      });
    }
  }

  openCoverLetterDetail(letter: string, content: any) {
    this.activeCoverLetter = letter;
    this.coverLetterModalRef = this.modalService.open(content);
  }

  acceptApplication(appId: number) {
    if (this.isMine) {
      console.log('Accepted application ', appId);
      this.jobsService.acceptUserApplication(appId).subscribe(_ => {
        this.applications = this.applications?.filter(app => app.id !== appId);
      });
    }
  }

  declineApplication(appId: number) {
    if (this.isMine) {
      console.log('Declined application ', appId);
      this.jobsService.declineUserApplication(appId).subscribe(_ => {
        this.applications = this.applications?.filter(app => app.id !== appId);
      });
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
