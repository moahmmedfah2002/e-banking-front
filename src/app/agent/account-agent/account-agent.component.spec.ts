import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountAgentComponent } from './account-agent.component';

describe('AccountAgentComponent', () => {
  let component: AccountAgentComponent;
  let fixture: ComponentFixture<AccountAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountAgentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
