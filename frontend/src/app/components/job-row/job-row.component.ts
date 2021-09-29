import { Component, Input, OnInit } from '@angular/core';
import { JobAlert } from 'src/app/models/job-alert.model';

@Component({
  selector: 'app-job-row',
  templateUrl: './job-row.component.html',
  styleUrls: ['./job-row.component.css']
})
export class JobRowComponent implements OnInit {
  @Input() job?: JobAlert;

  constructor() { }

  ngOnInit(): void {
  }

}
