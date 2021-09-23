import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveChatComponent } from './active-chat.component';

describe('ActiveChatComponent', () => {
  let component: ActiveChatComponent;
  let fixture: ComponentFixture<ActiveChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveChatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
