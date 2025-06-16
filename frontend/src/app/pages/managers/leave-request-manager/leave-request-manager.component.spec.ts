import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRequestManagerComponent } from './leave-request-manager.component';

describe('LeaveRequestManagerComponent', () => {
  let component: LeaveRequestManagerComponent;
  let fixture: ComponentFixture<LeaveRequestManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeaveRequestManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveRequestManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
