import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsEmployeeComponent } from './tabs-employee.component';

describe('TabsEmployeeComponent', () => {
  let component: TabsEmployeeComponent;
  let fixture: ComponentFixture<TabsEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabsEmployeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabsEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
