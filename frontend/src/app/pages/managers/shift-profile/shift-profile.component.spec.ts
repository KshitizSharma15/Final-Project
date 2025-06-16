import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftProfileComponent } from './shift-profile.component';

describe('ShiftProfileComponent', () => {
  let component: ShiftProfileComponent;
  let fixture: ComponentFixture<ShiftProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShiftProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
