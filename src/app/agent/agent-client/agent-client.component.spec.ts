import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentClientComponent } from './agent-client.component';

describe('AgentClientComponent', () => {
  let component: AgentClientComponent;
  let fixture: ComponentFixture<AgentClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgentClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
