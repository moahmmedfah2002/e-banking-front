import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentBillsComponent } from './recent-bills.component';

describe('RecentBillsComponent', () => {
  let component: RecentBillsComponent;
  let fixture: ComponentFixture<RecentBillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecentBillsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
