import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from '../utils/unit-test.utils';
import { SchATransactionService } from './scha-transaction.service';
import { DatePipe } from '@angular/common';

describe('SchATransactionService', () => {
  let service: SchATransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SchATransactionService, provideMockStore(testMockStore), DatePipe],
    });
    service = TestBed.inject(SchATransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
