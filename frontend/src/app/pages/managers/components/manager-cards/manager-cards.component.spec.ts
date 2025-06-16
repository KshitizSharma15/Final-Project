import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerCardsComponent } from './manager-cards.component';

describe('ManagerCardsComponent', () => {
  let component: ManagerCardsComponent;
  let fixture: ComponentFixture<ManagerCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagerCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
