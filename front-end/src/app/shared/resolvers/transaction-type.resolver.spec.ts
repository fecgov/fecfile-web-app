import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, convertToParamMap } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { TransactionType } from '../interfaces/transaction-type.interface';
import { Contact } from '../models/contact.model';
import { SchATransaction } from '../models/scha-transaction.model';
import { ContactService } from '../services/contact.service';
import { TransactionService } from '../services/transaction.service';
import { testMockStore } from '../utils/unit-test.utils';
import { TransactionTypeResolver } from './transaction-type.resolver';

describe('TransactionResolver', () => {
  let resolver: TransactionTypeResolver;
  let testContactService: ContactService;

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
    testContactService = TestBed.inject(ContactService);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should return an existing transaction', () => {
    const route = {
      paramMap: convertToParamMap({ transactionId: '999' }),
    };

    const testContact: Contact = new Contact();
    testContact.id = 'testId';
    spyOn(testContactService, 'get').and.returnValue(of(testContact));

    resolver.resolve(route as ActivatedRouteSnapshot).subscribe((response: TransactionType | undefined) => {
      expect(of(response)).toBeTruthy();
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
