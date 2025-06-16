import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsScheduleComponent } from './tabs-schedule.component';

describe('TabsScheduleComponent', () => {
  let component: TabsScheduleComponent;
  let fixture: ComponentFixture<TabsScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabsScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabsScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
