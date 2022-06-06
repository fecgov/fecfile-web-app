import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ActivatedRouteSnapshot, convertToParamMap } from '@angular/router';
import { TransactionType } from '../interfaces/transaction-type.interface';
import { TransactionTypeResolver } from './transaction-type.resolver';
import { TransactionService } from '../services/transaction.service';
import { UserLoginData } from '../models/user.model';
import { selectUserLoginData } from 'app/store/login.selectors';
import { of } from 'rxjs';
import { SchATransaction } from '../models/scha-transaction.model';

describe('TransactionResolver', () => {
  let resolver: TransactionTypeResolver;

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
});
