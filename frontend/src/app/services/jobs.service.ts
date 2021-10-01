import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JobAlert } from '../models/job-alert.model';
import { JobApplication } from '../models/job-application.model';

const API_URL = 'https://localhost:3000/';

@Injectable({
  providedIn: 'root'
})
export class JobsService {

  constructor(private httpClient: HttpClient) { }

  // Basic functionality

  getRecommndedJobAlerts(): Observable<JobAlert[]> {
    return this.httpClient.get<JobAlert[]>(API_URL + 'jobs', { responseType: 'json' });
  }

  getJobAlert(id: number): Observable<JobAlert> {
    return this.httpClient.get<JobAlert>(API_URL + 'jobs/' + id.toString(), { responseType: 'json' });
  }

  query(q: string): Observable<JobAlert[]> {
    return this.httpClient.get<JobAlert[]>(API_URL + 'jobs?q=' + q, { responseType: 'json' });
  }

  getMyJobAlerts(): Observable<JobAlert[]> {
    return this.httpClient.get<JobAlert[]>(API_URL + 'jobs/mine', { responseType: 'json' });
  }

  createJobAlert(jobData: any): Observable<JobAlert> {
    const { company, ...rest } = jobData;
    const companyId = parseInt(company);
    return this.httpClient.post<JobAlert>(API_URL + 'jobs', { companyId: companyId, ...rest }, { responseType: 'json' });
  }

  deleteJobAlert(id: number): Observable<any> {
    return this.httpClient.delete(API_URL + 'jobs/' + id.toString(), { responseType: 'json' });
  }

  // Job Applications

  getJobApplications(jobId: number): Observable<JobApplication[]> {
    return this.httpClient.get<JobApplication[]>(API_URL + 'jobs/' + jobId.toString() + '/applications', { responseType: 'json' });
  }

  applyToJob(jobId: number, coverLetter: string): Observable<JobApplication> {
    console.log(coverLetter);
    return this.httpClient.post<JobApplication>(API_URL + 'jobs/' + jobId.toString() + '/applications', { coverLetter: coverLetter }, { responseType: 'json' });
  }

  acceptUserApplication(id: number): Observable<any> {
    return this.httpClient.patch(API_URL + 'jobs/applications/' + id.toString() + '/accept', { responseType: 'json' });
  }

  declineUserApplication(id: number): Observable<any> {
    return this.httpClient.patch(API_URL + 'jobs/applications/' + id.toString() + '/decline', { responseType: 'json' });
  }
}
