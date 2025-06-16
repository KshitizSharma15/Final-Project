import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftsRequestComponent } from './shifts-request.component';

describe('ShiftsRequestComponent', () => {
  let component: ShiftsRequestComponent;
  let fixture: ComponentFixture<ShiftsRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShiftsRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftsRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
