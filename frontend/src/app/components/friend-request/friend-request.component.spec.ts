import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendRequestComponent } from './friend-request.component';

describe('FriendRequestComponent', () => {
  let component: FriendRequestComponent;
  let fixture: ComponentFixture<FriendRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FriendRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
