import { TestBed } from '@angular/core/testing';

import { BillPaymentsService } from './bill-payments.service';

describe('BillPaymentsService', () => {
  let service: BillPaymentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillPaymentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
