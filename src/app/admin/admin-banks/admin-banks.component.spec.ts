import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBanksComponent } from './admin-banks.component';

describe('AdminBanksComponent', () => {
  let component: AdminBanksComponent;
  let fixture: ComponentFixture<AdminBanksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminBanksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBanksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
