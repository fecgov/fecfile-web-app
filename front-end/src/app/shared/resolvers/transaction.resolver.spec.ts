import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ActivatedRouteSnapshot, convertToParamMap } from '@angular/router';
import { TransactionMeta } from '../interfaces/transaction-meta.interface';
import { schema as OFFSET_TO_OPEX } from 'fecfile-validate/fecfile_validate_js/dist/OFFSET_TO_OPEX';
import { TransactionResolver } from './transaction.resolver';
import { Transaction } from '../interfaces/transaction.interface';
import { TransactionService } from '../services/transaction.service';
import { UserLoginData } from '../models/user.model';
import { selectUserLoginData } from 'app/store/login.selectors';
import { of } from 'rxjs';
import { SchATransaction } from '../models/scha-transaction.model';
import { assert } from 'console';

describe('TransactionResolver', () => {
  let resolver: TransactionResolver;

  const userLoginData: UserLoginData = {
    committee_id: 'C00000000',
    email: 'email@fec.com',
    is_allowed: true,
    token: 'jwttokenstring',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideMockStore({
          initialState: { fecfile_online_userLoginData: userLoginData },
          selectors: [{ selector: selectUserLoginData, value: userLoginData }],
        }),
        {
          provide: TransactionService,
          useValue: {
            get: (transactionId: number) =>
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
    resolver = TestBed.inject(TransactionResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
  it('should return a transaction', () => {
    const route = {
      paramMap: convertToParamMap({ reportId: 1, transactionId: '999' }),
    };

    resolver.resolve(route as ActivatedRouteSnapshot).subscribe((response: TransactionMeta | undefined) => {
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

    resolver.resolve(route as ActivatedRouteSnapshot).subscribe((response: TransactionMeta | undefined) => {
      expect(response).toEqual(undefined);
    });
  });
});
