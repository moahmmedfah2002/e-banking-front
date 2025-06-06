import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoHistoryComponent } from './crypto-history.component';

describe('CryptoHistoryComponent', () => {
  let component: CryptoHistoryComponent;
  let fixture: ComponentFixture<CryptoHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CryptoHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CryptoHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
