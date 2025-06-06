import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSubAdminComponent } from './admin-sub-admin.component';

describe('AdminSubAdminComponent', () => {
  let component: AdminSubAdminComponent;
  let fixture: ComponentFixture<AdminSubAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminSubAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSubAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
