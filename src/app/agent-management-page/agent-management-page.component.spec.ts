import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentManagementPageComponent } from './agent-management-page.component';

describe('AgentManagementPageComponent', () => {
  let component: AgentManagementPageComponent;
  let fixture: ComponentFixture<AgentManagementPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgentManagementPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentManagementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
