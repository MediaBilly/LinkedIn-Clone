import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobAlert } from 'src/app/models/job-alert.model';
import { User } from 'src/app/models/user.model';
import { JobsService } from 'src/app/services/jobs.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  query?: string;
  isLoggedIn = false;
  users?: User[];
  jobs?: JobAlert[];

  constructor(private route: ActivatedRoute, 
    private tokenStorageService: TokenStorageService,
    private userService: UserService,
    private jobsService: JobsService
  ) { 
    this.route.queryParams.subscribe(params => {
      this.init(params['q']);
    });
  }

  ngOnInit(): void {
  }

  init(q: string) {
    this.query = q;
    this.isLoggedIn = this.tokenStorageService.loggedIn();
    this.getUsers();
    this.getJobs();
  }

  getUsers() {
    if (this.isLoggedIn && this.query) {
      this.userService.query(this.query).subscribe(usrs => {
        this.users = usrs;
      });
    }
  }

  getJobs() {
    if (this.isLoggedIn && this.query) {
      this.jobsService.query(this.query).subscribe(jbs => {
        this.jobs = jbs;
      })
    }
  }

}
