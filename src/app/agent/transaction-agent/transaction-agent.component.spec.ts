import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionAgentComponent } from './transaction-agent.component';

describe('TransactionAgentComponent', () => {
  let component: TransactionAgentComponent;
  let fixture: ComponentFixture<TransactionAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionAgentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
