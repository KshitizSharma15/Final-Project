import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsAttendanceComponent } from './tabs-attendance.component';

describe('TabsAttendanceComponent', () => {
  let component: TabsAttendanceComponent;
  let fixture: ComponentFixture<TabsAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabsAttendanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabsAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
