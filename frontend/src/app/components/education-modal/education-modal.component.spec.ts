import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationModalComponent } from './education-modal.component';

describe('EducationModalComponent', () => {
  let component: EducationModalComponent;
  let fixture: ComponentFixture<EducationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EducationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EducationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
