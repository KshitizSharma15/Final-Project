import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerBodyComponent } from './manager-body.component';

describe('ManagerBodyComponent', () => {
  let component: ManagerBodyComponent;
  let fixture: ComponentFixture<ManagerBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagerBodyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
