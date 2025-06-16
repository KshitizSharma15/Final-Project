import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftsAddComponent } from './shifts-add.component';

describe('ShiftsAddComponent', () => {
  let component: ShiftsAddComponent;
  let fixture: ComponentFixture<ShiftsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShiftsAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
