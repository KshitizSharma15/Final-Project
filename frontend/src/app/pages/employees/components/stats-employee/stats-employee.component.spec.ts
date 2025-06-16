import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsEmployeeComponent } from './stats-employee.component';

describe('StatsEmployeeComponent', () => {
  let component: StatsEmployeeComponent;
  let fixture: ComponentFixture<StatsEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatsEmployeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatsEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
