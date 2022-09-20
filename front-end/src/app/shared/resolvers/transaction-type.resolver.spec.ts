import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ActivatedRouteSnapshot, convertToParamMap } from '@angular/router';
import { TransactionType } from '../interfaces/transaction-type.interface';
import { TransactionTypeResolver } from './transaction-type.resolver';
import { TransactionService } from '../services/transaction.service';
import { testMockStore } from '../utils/unit-test.utils';
import { of } from 'rxjs';
import { SchATransaction } from '../models/scha-transaction.model';

describe('TransactionResolver', () => {
  let resolver: TransactionTypeResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideMockStore(testMockStore),
        {
          provide: TransactionService,
          useValue: {
            get: (transactionId: string) =>
              of(
                SchATransaction.fromJSON({
                  id: transactionId,
                  transaction_type_identifier: 'OFFSET_TO_OPEX',
                })
              ),
          },
        },
      ],
    });
    resolver = TestBed.inject(TransactionTypeResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should return an existing transaction', () => {
    const route = {
      paramMap: convertToParamMap({ transactionId: '999' }),
    };

    resolver.resolve(route as ActivatedRouteSnapshot).subscribe((response: TransactionType | undefined) => {
      expect(response).toBeTruthy();
      if (response) {
        expect('Offsets to Operating Expenditures').toEqual(response.title);
      }
    });
  });

  it('should return undefined', () => {
    const route = {
      paramMap: convertToParamMap({ transactionId: undefined }),
    };

    resolver.resolve(route as ActivatedRouteSnapshot).subscribe((response: TransactionType | undefined) => {
      expect(response).toEqual(undefined);
    });
  });

  it('should return an existing transaction', () => {
    const route = {
      paramMap: convertToParamMap({ reportId: 1, transactionType: 'OFFSET_TO_OPEX' }),
    };

    resolver.resolve(route as ActivatedRouteSnapshot).subscribe((response: TransactionType | undefined) => {
      expect(response).toBeTruthy();
      if (response) {
        expect(response.title).toEqual('Offsets to Operating Expenditures');
      }
    });
  });

  it('should return a child transaction', () => {
    const route = {
      paramMap: convertToParamMap({ parentTransactionId: 1, transactionType: 'JF_TRAN_PAC_MEMO' }),
    };

    resolver.resolve(route as ActivatedRouteSnapshot).subscribe((response: TransactionType | undefined) => {
      expect(response).toBeTruthy();
      if (response) {
        expect(response.title).toEqual('PAC Joint Fundraising Transfer Memo');
      }
    });
  });
});
