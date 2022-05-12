import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, convertToParamMap } from '@angular/router';
import { TransactionMeta } from '../interfaces/transaction-meta.interface';
// Import transaction schemas
import { schema as OFFSET_TO_OPEX } from 'fecfile-validate/fecfile_validate_js/dist/OFFSET_TO_OPEX';

import { TransactionResolver } from './transaction.resolver';
import { SchATransaction } from '../models/scha-transaction.model';
import { Schedule } from '../interfaces/schedule.interface';

describe('TransactionResolver', () => {
  let resolver: TransactionResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(TransactionResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
  it('should return a transaction', () => {
    const transaction: TransactionMeta = {
      scheduleId: 'A',
      componentGroupId: 'B',
      schema: OFFSET_TO_OPEX,
      transaction: { id: 999, transaction_type_identifier: 'OFFSET_TO_OPEX' } as Schedule,
    } as TransactionMeta;
    const route = {
      paramMap: convertToParamMap({ transactionId: '999' }),
    };

    resolver.resolve(route as ActivatedRouteSnapshot).subscribe((response: TransactionMeta | undefined) => {
      expect(response).toEqual(transaction);
    });
  });

  it('should return undefined', () => {
    const route = {
      paramMap: convertToParamMap({ id: undefined }),
    };

    resolver.resolve(route as ActivatedRouteSnapshot).subscribe((response: TransactionMeta | undefined) => {
      expect(response).toEqual(undefined);
    });
  });
});
