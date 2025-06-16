import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftsRequestManagerComponent } from './shifts-request-manager.component';

describe('ShiftsRequestManagerComponent', () => {
  let component: ShiftsRequestManagerComponent;
  let fixture: ComponentFixture<ShiftsRequestManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShiftsRequestManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftsRequestManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
