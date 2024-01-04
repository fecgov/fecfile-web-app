import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, convertToParamMap } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { catchError, of } from 'rxjs';
import { Contact } from '../models/contact.model';
import { SchATransaction, ScheduleATransactionTypes } from '../models/scha-transaction.model';
import { SchBTransaction, ScheduleBTransactionTypes } from '../models/schb-transaction.model';
import { SchCTransaction, ScheduleCTransactionTypes } from '../models/schc-transaction.model';
import { SchDTransaction, ScheduleDTransactionTypes } from '../models/schd-transaction.model';
import { Transaction } from '../models/transaction.model';
import { ContactService } from '../services/contact.service';
import { TransactionService } from '../services/transaction.service';
import { TransactionTypeUtils } from '../utils/transaction-type.utils';
import { testMockStore } from '../utils/unit-test.utils';
import { TransactionResolver } from './transaction.resolver';
import { ReattributedUtils } from "../utils/reatt-redes/reattributed.utils";

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
                contact_1: Contact.fromJSON({id: 123}),
              })
            ),
          getTableData: () =>
            of({
              count: 5,
              next: 'https://url',
              previous: 'https://url',
              pageNumber: 1,
              results: [],
            }),
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

  describe('resolve', () => {
    it('should return an existing transaction', () => {
      const route = {
        queryParamMap: convertToParamMap({}),
        paramMap: convertToParamMap({transactionId: '999'}),
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
        queryParamMap: convertToParamMap({}),
        paramMap: convertToParamMap({transactionId: undefined}),
      };

      resolver.resolve(route as ActivatedRouteSnapshot).subscribe((response: Transaction | undefined) => {
        expect(response).toEqual(undefined);
      });
    });

    it('should return an existing transaction', () => {
      const route = {
        queryParamMap: convertToParamMap({}),
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
        queryParamMap: convertToParamMap({}),
        paramMap: convertToParamMap({
          reportId: 1,
          parentTransactionId: 1,
          transactionType: ScheduleATransactionTypes.PAC_JF_TRANSFER_MEMO,
        }),
      };
      spyOn(resolver.transactionService, 'get').and.returnValue(
        of(
          SchATransaction.fromJSON({
            id: 1,
            report_id: 1,
            transaction_type_identifier: ScheduleATransactionTypes.JOINT_FUNDRAISING_TRANSFER,
            transactionType: TransactionTypeUtils.factory(ScheduleATransactionTypes.JOINT_FUNDRAISING_TRANSFER),
            contact_id: '123',
            contact_1: Contact.fromJSON({id: 123}),
          })
        )
      );

      resolver.resolve(route as ActivatedRouteSnapshot).subscribe((response: Transaction | undefined) => {
        expect(response).toBeTruthy();
        if (response) {
          expect(response.transactionType?.title).toEqual('PAC Joint Fundraising Transfer Memo');
        }
      });
    });

    it('should add debt to repayment', () => {
      spyOn(resolver.transactionService, 'get').and.callFake((id) => {
        return of(
          SchDTransaction.fromJSON({
            id: id,
            transaction_type_identifier: ScheduleDTransactionTypes.DEBT_OWED_BY_COMMITTEE,
            transactionType: TransactionTypeUtils.factory(ScheduleDTransactionTypes.DEBT_OWED_BY_COMMITTEE),
            contact_id: '123',
            contact_1: Contact.fromJSON({id: 123}),
          })
        );
      });
      const route = {
        queryParamMap: convertToParamMap({debt: '1'}),
        paramMap: convertToParamMap({
          reportId: 1,
          transactionType: ScheduleBTransactionTypes.OPERATING_EXPENDITURE,
        }),
      };

      resolver.resolve(route as ActivatedRouteSnapshot).subscribe((transaction: Transaction | undefined) => {
        expect(transaction).toBeTruthy();
        if (transaction) {
          expect(transaction.debt?.id).toEqual('1');
        }
      });
    });

    it('should add loan to repayment', () => {
      spyOn(resolver.transactionService, 'get').and.callFake((id) => {
        return of(
          SchDTransaction.fromJSON({
            id: id,
            transaction_type_identifier: ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK,
            transactionType: TransactionTypeUtils.factory(ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK),
            contact_id: '123',
            contact_1: Contact.fromJSON({id: 123}),
          })
        );
      });
      const route = {
        queryParamMap: convertToParamMap({loan: '1'}),
        paramMap: convertToParamMap({
          reportId: 1,
          transactionType: ScheduleBTransactionTypes.LOAN_REPAYMENT_MADE,
        }),
      };

      resolver.resolve(route as ActivatedRouteSnapshot).subscribe((transaction: Transaction | undefined) => {
        expect(transaction).toBeTruthy();
        if (transaction) {
          expect(transaction.loan?.id).toEqual('1');
        }
      });
    });

    it('should add redesignation', () => {
      spyOn(resolver.transactionService, 'get').and.callFake((id) => {
        return of(
          SchBTransaction.fromJSON({
            id: id,
            transaction_type_identifier: ScheduleBTransactionTypes.OPERATING_EXPENDITURE,
            transactionType: TransactionTypeUtils.factory(ScheduleBTransactionTypes.OPERATING_EXPENDITURE),
            contact_id: '123',
            contact_1: Contact.fromJSON({id: 123}),
          })
        );
      });
      const route = {
        queryParamMap: convertToParamMap({redesignation: '1'}),
        paramMap: convertToParamMap({
          reportId: 1,
          transactionType: ScheduleBTransactionTypes.OPERATING_EXPENDITURE,
        }),
      };

      resolver.resolve(route as ActivatedRouteSnapshot).subscribe((transaction: Transaction | undefined) => {
        expect(transaction).toBeTruthy();
        if (transaction) {
          expect((transaction as SchBTransaction).reattribution_redesignation_tag).toEqual('REDESIGNATION_TO');
          expect(
            ((transaction as SchBTransaction).children[0] as SchBTransaction).reattribution_redesignation_tag
          ).toEqual('REDESIGNATION_FROM');
        }
      });
    });
  });

  // describe('resolveNewChildTransaction', () => {
  //   it('should attach child for transaction with dependent child transaction type', () => {
  //     resolver.resolveNewChildTransaction('1', ScheduleATransactionTypes.EARMARK_RECEIPT).subscribe((transaction) => {
  //       if (transaction?.children) {
  //         expect(transaction.children[0].transactionType?.title).toBe('Earmark Memo');
  //       }
  //     });
  //   });
  // });

  describe('resolveExistingTransactionFromId', () => {
    it('should throw an error if trying to resolve an invalid transaction type identifier', () => {
      spyOn(resolver.transactionService, 'get').and.returnValue(of({} as SchATransaction));
      resolver
        .resolveExistingTransactionFromId('10')
        .pipe(
          catchError((err) => {
              expect(err.message).toBe(
                "Fecfile: Transaction type resolver can't find transaction and/or contact for transaction ID 10")
              return of(err);
            }
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
            contact_1: Contact.fromJSON({id: 123}),
          })
        )
      );
      resolver
        .resolveExistingTransactionFromId('10')
        .pipe(
          catchError((err) => {
              expect(err.message).toBe(
                'Fecfile: Transaction 999 (EARMARK_MEMO) is a dependent transaction type but does not have a parent transaction.'
              )
              return of(err)
            }
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
            contact_1: Contact.fromJSON({id: 123}),
            parent_transaction_id: 2,
          })
        )
      );
      resolver.resolveExistingTransactionFromId('10').subscribe((transaction: Transaction | undefined) => {
        if (transaction) expect(transaction.transaction_type_identifier).toBe(ScheduleATransactionTypes.EARMARK_MEMO);
      });
    });

    it('should have parent transaction', () => {
      spyOn(resolver.transactionService, 'get').and.callFake((id) => {
        return of(
          SchATransaction.fromJSON({
            id: id,
            transaction_type_identifier: ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_JF_TRANSFER_MEMO,
            transactionType: TransactionTypeUtils.factory(
              ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_JF_TRANSFER_MEMO
            ),
            contact_id: '123',
            contact_1: Contact.fromJSON({id: 123}),
            parent_transaction: SchATransaction.fromJSON({
              id: '2',
              transaction_type_identifier: ScheduleATransactionTypes.JOINT_FUNDRAISING_TRANSFER,
              transactionType: TransactionTypeUtils.factory(ScheduleATransactionTypes.JOINT_FUNDRAISING_TRANSFER),
              contact_id: '123',
              contact_1: Contact.fromJSON({id: 123}),
            }),
          })
        );
      });
      resolver.resolveExistingTransactionFromId('10').subscribe((transaction: Transaction | undefined) => {
        if (transaction) expect(transaction.id).toBe('10');
        expect(transaction?.parent_transaction?.id).toBe('2');
      });
    });

    it('should have grandparent transaction ', () => {
      spyOn(resolver.transactionService, 'get').and.callFake((id) => {
        return of(
          SchATransaction.fromJSON({
            id: id,
            transaction_type_identifier: ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_JF_TRANSFER_MEMO,
            transactionType: TransactionTypeUtils.factory(
              ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_JF_TRANSFER_MEMO
            ),
            contact_id: '123',
            contact_1: Contact.fromJSON({id: 123}),
            parent_transaction: SchATransaction.fromJSON({
              id: '2',
              transaction_type_identifier: ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_JF_TRANSFER_MEMO,
              transactionType: TransactionTypeUtils.factory(
                ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_JF_TRANSFER_MEMO
              ),
              contact_id: '123',
              contact_1: Contact.fromJSON({id: 123}),
              parent_transaction: SchATransaction.fromJSON({
                id: '1',
                transaction_type_identifier: ScheduleATransactionTypes.JOINT_FUNDRAISING_TRANSFER,
                transactionType: TransactionTypeUtils.factory(ScheduleATransactionTypes.JOINT_FUNDRAISING_TRANSFER),
                contact_id: '123',
                contact_1: Contact.fromJSON({id: 123}),
              }),
            }),
          })
        );
      });
      resolver.resolveExistingTransactionFromId('10').subscribe((transaction: Transaction | undefined) => {
        if (transaction) expect(transaction.id).toBe('10');
        expect(transaction?.parent_transaction?.id).toBe('2');
        expect(transaction?.parent_transaction?.parent_transaction?.id).toBe('1');
      });
    });

    it('should have debt transaction', () => {
      spyOn(resolver.transactionService, 'get').and.callFake((id) => {
        return of(
          SchATransaction.fromJSON({
            id: id,
            transaction_type_identifier: ScheduleDTransactionTypes.DEBT_OWED_TO_COMMITTEE,
            transactionType: TransactionTypeUtils.factory(ScheduleDTransactionTypes.DEBT_OWED_TO_COMMITTEE),
            contact_id: '123',
            contact_1: Contact.fromJSON({id: 123}),
            debt: SchDTransaction.fromJSON({
              id: '2',
              transaction_type_identifier: ScheduleDTransactionTypes.DEBT_OWED_TO_COMMITTEE,
              transactionType: TransactionTypeUtils.factory(ScheduleDTransactionTypes.DEBT_OWED_TO_COMMITTEE),
              contact_id: '123',
              contact_1: Contact.fromJSON({id: 123}),
            }),
          })
        );
      });
      resolver.resolveExistingTransactionFromId('10').subscribe((transaction: Transaction | undefined) => {
        if (transaction) expect(transaction.id).toBe('10');
        expect(transaction?.debt?.id).toBe('2');
      });
    });

    it('should have loan transaction', () => {
      spyOn(resolver.transactionService, 'get').and.callFake((id) => {
        return of(
          SchATransaction.fromJSON({
            id: id,
            transaction_type_identifier: ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK,
            transactionType: TransactionTypeUtils.factory(ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK),
            contact_id: '123',
            contact_1: Contact.fromJSON({id: 123}),
            loan: SchCTransaction.fromJSON({
              id: '2',
              transaction_type_identifier: ScheduleCTransactionTypes.LOAN_BY_COMMITTEE,
              transactionType: TransactionTypeUtils.factory(ScheduleCTransactionTypes.LOAN_BY_COMMITTEE),
              contact_id: '123',
              contact_1: Contact.fromJSON({id: 123}),
            }),
          })
        );
      });
      resolver.resolveExistingTransactionFromId('10').subscribe((transaction: Transaction | undefined) => {
        if (transaction) expect(transaction.id).toBe('10');
        expect(transaction?.loan?.id).toBe('2');
      });
    });
  });

  describe('resolveNewTransaction', () => {
    it('should add new child transaction to new parent if parent has a dependentChildTransactionTypes', () => {
      resolver
        .resolveNewTransaction('10', ScheduleATransactionTypes.EARMARK_RECEIPT)
        .subscribe((transaction: Transaction | undefined) => {
          if (transaction?.children)
            expect(transaction.children[0].transaction_type_identifier).toBe(ScheduleATransactionTypes.EARMARK_MEMO);
        });
    });
  });

  describe('resolveNewReattribution', () => {
    const route = {
      queryParamMap: convertToParamMap({reattribution: '1'}),
      paramMap: convertToParamMap({
        reportId: 1,
        transactionType: ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
      }),
    };
    beforeEach(() => {
      spyOn(resolver.transactionService, 'get').and.callFake((id) => {
        return of(
          SchATransaction.fromJSON({
            id: id,
            transaction_type_identifier: ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
            transactionType: TransactionTypeUtils.factory(ScheduleATransactionTypes.INDIVIDUAL_RECEIPT),
            contact_id: '123',
            contact_1: Contact.fromJSON({id: 123}),
          })
        );
      });

    })
    it('should add reattribution', () => {
      resolver.resolve(route as ActivatedRouteSnapshot).subscribe((transaction: Transaction | undefined) => {
        expect(transaction).toBeTruthy();
        if (transaction) {
          expect((transaction as SchATransaction).reattribution_redesignation_tag).toEqual('REATTRIBUTION_TO');
          expect(
            ((transaction as SchATransaction).children[0] as SchATransaction).reattribution_redesignation_tag
          ).toEqual('REATTRIBUTION_FROM');
        }
      });
    });

    it('should throw error if redesignated does not have transaction_type_identifier', () => {
      spyOn(ReattributedUtils, 'overlayTransactionProperties').and.callFake((transaction, id) => {
        return SchATransaction.fromJSON({
          id: id,
          transaction_type_identifier: undefined,
          transactionType: TransactionTypeUtils.factory(ScheduleATransactionTypes.INDIVIDUAL_RECEIPT),
          contact_id: '123',
          contact_1: Contact.fromJSON({id: 123}),
        });
      });
      resolver.resolve(route as ActivatedRouteSnapshot).subscribe({
        error: (err) => {
          expect(err).toEqual(new Error('Fecfile online: originating reattribution transaction type not found.'))
        }
      });
    });
  });
});
