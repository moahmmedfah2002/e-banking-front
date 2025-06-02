import { TestBed } from '@angular/core/testing';

import { BinanceCommunicationService } from './binance-communication.service';

describe('BinanceCommunicationService', () => {
  let service: BinanceCommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BinanceCommunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
