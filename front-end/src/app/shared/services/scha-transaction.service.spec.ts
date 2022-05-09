import { TestBed } from '@angular/core/testing';

import { SchaTransactionService } from './scha-transaction.service';

describe('SchaTransactionService', () => {
  let service: SchaTransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchaTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
