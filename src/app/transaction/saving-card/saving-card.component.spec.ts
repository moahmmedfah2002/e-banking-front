import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingCardComponent } from './saving-card.component';

describe('SavingCardComponent', () => {
  let component: SavingCardComponent;
  let fixture: ComponentFixture<SavingCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SavingCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
