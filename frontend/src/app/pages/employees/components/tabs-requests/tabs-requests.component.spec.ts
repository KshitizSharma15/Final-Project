import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsRequestsComponent } from './tabs-requests.component';

describe('TabsRequestsComponent', () => {
  let component: TabsRequestsComponent;
  let fixture: ComponentFixture<TabsRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabsRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabsRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
