import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SchATransactionService } from './scha-transaction.service';

describe('SchATransactionService', () => {
  let service: SchATransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SchATransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
