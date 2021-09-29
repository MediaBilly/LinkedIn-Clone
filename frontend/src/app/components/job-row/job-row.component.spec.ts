import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobRowComponent } from './job-row.component';

describe('JobRowComponent', () => {
  let component: JobRowComponent;
  let fixture: ComponentFixture<JobRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
