import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, convertToParamMap } from '@angular/router';
import { environment } from 'environments/environment';
import { TransactionMeta } from '../interfaces/transaction-meta.interface';

import { TransactionResolver } from './transaction.resolver';

describe('TransactionResolver', () => {
  let resolver: TransactionResolver;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(TransactionResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
  it('should return a tramsaction', () => {
    const transaction: TransactionMeta = {
      scheduleId: '999',
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
