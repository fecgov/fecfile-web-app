import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, convertToParamMap } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { of, catchError } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { Contact } from '../models/contact.model';
import { SchATransaction, ScheduleATransactionTypes } from '../models/scha-transaction.model';
import { ContactService } from '../services/contact.service';
import { TransactionService } from '../services/transaction.service';
import { testMockStore } from '../utils/unit-test.utils';
import { TransactionResolver } from './transaction.resolver';
import { TransactionTypeUtils } from '../utils/transaction-type.utils';

describe('TransactionResolver', () => {
  let resolver: TransactionResolver;
  let testContactService: ContactService;

  const testBedConfig = {
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
                transaction_type_identifier: ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
                contact_id: '123',
                contact_1: Contact.fromJSON({ id: 123 }),
              })
            ),
        },
      },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule(testBedConfig);
    resolver = TestBed.inject(TransactionResolver);
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

    resolver.resolve(route as ActivatedRouteSnapshot).subscribe((response: Transaction | undefined) => {
      expect(of(response)).toBeTruthy();
      if (response) {
        expect('Offsets to Operating Expenditures').toEqual(response.transactionType?.title || '');
      }
    });
  });

  it('should return undefined', () => {
    const route = {
      paramMap: convertToParamMap({ transactionId: undefined }),
    };

    resolver.resolve(route as ActivatedRouteSnapshot).subscribe((response: Transaction | undefined) => {
      expect(response).toEqual(undefined);
    });
  });

  it('should return an existing transaction', () => {
    const route = {
      paramMap: convertToParamMap({
        reportId: 1,
        transactionType: ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
      }),
    };

    resolver.resolve(route as ActivatedRouteSnapshot).subscribe((response: Transaction | undefined) => {
      expect(response).toBeTruthy();
      if (response) {
        expect(response.transactionType?.title).toEqual('Offsets to Operating Expenditures');
      }
    });
  });

  it('should return a child transaction', () => {
    const route = {
      paramMap: convertToParamMap({
        parentTransactionId: 1,
        transactionType: ScheduleATransactionTypes.PAC_JF_TRANSFER_MEMO,
      }),
    };

    resolver.resolve(route as ActivatedRouteSnapshot).subscribe((response: Transaction | undefined) => {
      expect(response).toBeTruthy();
      if (response) {
        expect(response.transactionType?.title).toEqual('PAC Joint Fundraising Transfer Memo');
      }
    });
  });

  xit('should attach child for transaction with dependent child transaction type', () => {
    resolver.resolve_new_child_transaction('1', ScheduleATransactionTypes.EARMARK_RECEIPT).subscribe((transaction) => {
      if (transaction?.children) {
        expect(transaction.children[0].transactionType?.title).toBe('Earmark Memo');
      }
    });
  });

  it('should throw an error if trying to resolve an invalid transaction type identifier', () => {
    spyOn(resolver.transactionService, 'get').and.returnValue(of({} as SchATransaction));
    resolver
      .resolve_existing_transaction('10')
      .pipe(
        catchError((err) =>
          of(
            expect(err.message).toBe(
              "Fecfile: Transaction type resolver can't find transaction and/or contact for transaction ID 10"
            )
          )
        )
      )
      .subscribe();
  });

  it('should throw an error if dependent child transaction does not have a parent', () => {
    spyOn(resolver.transactionService, 'get').and.returnValue(
      of(
        SchATransaction.fromJSON({
          id: 999,
          transaction_type_identifier: ScheduleATransactionTypes.EARMARK_MEMO,
          transactionType: TransactionTypeUtils.factory(ScheduleATransactionTypes.EARMARK_MEMO),
          contact_id: '123',
          contact_1: Contact.fromJSON({ id: 123 }),
        })
      )
    );
    resolver
      .resolve_existing_transaction('10')
      .pipe(
        catchError((err) =>
          of(
            expect(err.message).toBe(
              'Fecfile: Transaction 999 (EARMARK_MEMO) is a dependent transaction type but does not have a parent transaction.'
            )
          )
        )
      )
      .subscribe();
  });

  it('should return parent transaction if dependent child is requested', () => {
    spyOn(resolver.transactionService, 'get').and.returnValue(
      of(
        SchATransaction.fromJSON({
          id: 999,
          transaction_type_identifier: ScheduleATransactionTypes.EARMARK_MEMO,
          transactionType: TransactionTypeUtils.factory(ScheduleATransactionTypes.EARMARK_MEMO),
          contact_id: '123',
          contact_1: Contact.fromJSON({ id: 123 }),
          parent_transaction_id: 2,
        })
      )
    );
    resolver.resolve_existing_transaction('10').subscribe((transaction: Transaction | undefined) => {
      if (transaction) expect(transaction.transaction_type_identifier).toBe(ScheduleATransactionTypes.EARMARK_MEMO);
    });
  });

  it('should add new child transaction to new parent if parent has a dependentChildTransactionType', () => {
    resolver
      .resolve_new_transaction('10', ScheduleATransactionTypes.EARMARK_RECEIPT)
      .subscribe((transaction: Transaction | undefined) => {
        if (transaction?.children)
          expect(transaction.children[0].transaction_type_identifier).toBe(ScheduleATransactionTypes.EARMARK_MEMO);
      });
  });

  it('should populate parent transaction if child is existing', () => {
    spyOn(resolver.transactionService, 'get').and.callFake((id) => {
      return of(
        SchATransaction.fromJSON({
          id: id,
          transaction_type_identifier: ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_JF_TRANSFER_MEMO,
          transactionType: TransactionTypeUtils.factory(
            ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_JF_TRANSFER_MEMO
          ),
          contact_id: '123',
          contact_1: Contact.fromJSON({ id: 123 }),
          parent_transaction_id: '2',
        })
      );
    });
    resolver.resolve_existing_transaction('10').subscribe((transaction: Transaction | undefined) => {
      if (transaction) expect(transaction.id).toBe('10');
      expect(transaction?.parent_transaction?.id).toBe('2');
    });
  });

  it('should populate grandparent transaction if child is existing', () => {
    spyOn(resolver.transactionService, 'get').and.callFake((id) => {
      if (id === '10') {
        return of(
          SchATransaction.fromJSON({
            id: id,
            transaction_type_identifier: ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_JF_TRANSFER_MEMO,
            transactionType: TransactionTypeUtils.factory(
              ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_JF_TRANSFER_MEMO
            ),
            contact_id: '123',
            contact_1: Contact.fromJSON({ id: 123 }),
            parent_transaction_id: '2',
          })
        );
      }
      if (id === '2') {
        return of(
          SchATransaction.fromJSON({
            id: id,
            transaction_type_identifier: ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_JF_TRANSFER_MEMO,
            transactionType: TransactionTypeUtils.factory(
              ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_JF_TRANSFER_MEMO
            ),
            contact_id: '123',
            contact_1: Contact.fromJSON({ id: 123 }),
            parent_transaction_id: '1',
          })
        );
      } else {
        return of(
          SchATransaction.fromJSON({
            id: id,
            transaction_type_identifier: ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_JF_TRANSFER_MEMO,
            transactionType: TransactionTypeUtils.factory(
              ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_JF_TRANSFER_MEMO
            ),
            contact_id: '123',
            contact_1: Contact.fromJSON({ id: 123 }),
          })
        );
      }
    });
    resolver.resolve_existing_transaction('10').subscribe((transaction: Transaction | undefined) => {
      if (transaction) expect(transaction.id).toBe('10');
      expect(transaction?.parent_transaction?.id).toBe('2');
      expect(transaction?.parent_transaction?.parent_transaction?.id).toBe('1');
    });
  });
});
