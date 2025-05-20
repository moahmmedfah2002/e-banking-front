import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcountSummaryCardComponent } from './acount-summary-card.component';

describe('AcountSummaryCardComponent', () => {
  let component: AcountSummaryCardComponent;
  let fixture: ComponentFixture<AcountSummaryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcountSummaryCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcountSummaryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
