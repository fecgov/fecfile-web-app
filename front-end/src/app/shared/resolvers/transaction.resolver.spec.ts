import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, convertToParamMap } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { Contact, ContactTypes } from '../models/contact.model';
import { SchATransaction, ScheduleATransactionTypes } from '../models/scha-transaction.model';
import { SchBTransaction, ScheduleBTransactionTypes } from '../models/schb-transaction.model';
import { SchCTransaction, ScheduleCTransactionTypes } from '../models/schc-transaction.model';
import { SchDTransaction, ScheduleDTransactionTypes } from '../models/schd-transaction.model';
import { Transaction } from '../models/transaction.model';
import { ContactService } from '../services/contact.service';
import { TransactionService } from '../services/transaction.service';
import { ReattributedUtils } from '../utils/reatt-redes/reattributed.utils';
import { TransactionTypeUtils } from '../utils/transaction-type.utils';
import { testMockStore } from '../utils/unit-test.utils';
import { TransactionResolver } from './transaction.resolver';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('TransactionResolver', () => {
  let resolver: TransactionResolver;
  let testContactService: ContactService;

  const testBedConfig = {
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      provideMockStore(testMockStore),
      {
        provide: TransactionService,
        useValue: {
          get: async (transactionId: string) =>
            SchATransaction.fromJSON({
              id: transactionId,
              transaction_type_identifier: ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
              contact_id: '123',
              contact_1: Contact.fromJSON({ id: 123 }),
            }),
          getTableData: async () => {
            return {
              count: 5,
              next: '',
              previous: 'https://url',
              pageNumber: 1,
              results: [],
            };
          },
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

  describe('resolve existing', () => {
    it('should return an existing transaction', async () => {
      const route = {
        queryParamMap: convertToParamMap({}),
        paramMap: convertToParamMap({ transactionId: '999' }),
      };

      const testContact: Contact = new Contact();
      testContact.id = 'testId';
      spyOn(testContactService, 'get').and.returnValue(Promise.resolve(testContact));
      await expectAsync(
        resolver.resolve(route as ActivatedRouteSnapshot).then((response) => {
          expect(response).toBeTruthy();
          expect('Offsets to Operating Expenditures').toEqual(response?.transactionType?.title ?? '');
        }),
      ).toBeResolved();
    });

    it('should return an existing transaction', async () => {
      const route = {
        queryParamMap: convertToParamMap({}),
        paramMap: convertToParamMap({
          reportId: 1,
          transactionType: ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
        }),
      };
      await expectAsync(
        resolver.resolve(route as ActivatedRouteSnapshot).then((response: Transaction | undefined) => {
          expect(response).toBeTruthy();
          if (response) {
            expect(response.transactionType?.title).toEqual('Offsets to Operating Expenditures');
          }
        }),
      ).toBeResolved();
    });

    it('should return undefined', async () => {
      const route = {
        queryParamMap: convertToParamMap({}),
        paramMap: convertToParamMap({ transactionId: undefined }),
      };
      await expectAsync(
        resolver.resolve(route as ActivatedRouteSnapshot).then((response: Transaction | undefined) => {
          expect(response).toEqual(undefined);
        }),
      ).toBeResolved();
    });
  });

  describe('resolve', () => {
    it('should return a child transaction', async () => {
      const route = {
        queryParamMap: convertToParamMap({}),
        paramMap: convertToParamMap({
          reportId: 1,
          parentTransactionId: 1,
          transactionType: ScheduleATransactionTypes.PAC_JF_TRANSFER_MEMO,
        }),
      };
      spyOn(resolver.transactionService, 'get').and.returnValue(
        Promise.resolve(
          SchATransaction.fromJSON({
            id: 1,
            report_ids: [1],
            transaction_type_identifier: ScheduleATransactionTypes.JOINT_FUNDRAISING_TRANSFER,
            transactionType: TransactionTypeUtils.factory(ScheduleATransactionTypes.JOINT_FUNDRAISING_TRANSFER),
            contact_id: '123',
            contact_1: Contact.fromJSON({ id: 123 }),
          }),
        ),
      );

      await expectAsync(
        resolver.resolve(route as ActivatedRouteSnapshot).then((response: Transaction | undefined) => {
          expect(response).toBeTruthy();
          if (response) {
            expect(response.transactionType?.title).toEqual('PAC Joint Fundraising Transfer Memo');
          }
        }),
      ).toBeResolved();
    });

    it('should add debt to repayment', async () => {
      spyOn(resolver.transactionService, 'get').and.callFake((id) => {
        return Promise.resolve(
          SchDTransaction.fromJSON({
            id: id,
            transaction_type_identifier: ScheduleDTransactionTypes.DEBT_OWED_BY_COMMITTEE,
            transactionType: TransactionTypeUtils.factory(ScheduleDTransactionTypes.DEBT_OWED_BY_COMMITTEE),
            contact_id: '123',
            contact_1: Contact.fromJSON({ id: 123 }),
          }),
        );
      });
      const route = {
        queryParamMap: convertToParamMap({ debt: '1' }),
        paramMap: convertToParamMap({
          reportId: 1,
          transactionType: ScheduleBTransactionTypes.OPERATING_EXPENDITURE,
        }),
      };

      await expectAsync(
        resolver.resolve(route as ActivatedRouteSnapshot).then((transaction: Transaction | undefined) => {
          expect(transaction).toBeTruthy();
          if (transaction) {
            expect(transaction.debt?.id).toEqual('1');
          }
        }),
      ).toBeResolved();
    });

    it('should add loan to repayment', async () => {
      spyOn(resolver.transactionService, 'get').and.callFake((id) => {
        return Promise.resolve(
          SchDTransaction.fromJSON({
            id: id,
            transaction_type_identifier: ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK,
            transactionType: TransactionTypeUtils.factory(ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK),
            contact_id: '123',
            contact_1: Contact.fromJSON({ id: 123 }),
          }),
        );
      });
      const route = {
        queryParamMap: convertToParamMap({ loan: '1' }),
        paramMap: convertToParamMap({
          reportId: 1,
          transactionType: ScheduleBTransactionTypes.LOAN_REPAYMENT_MADE,
        }),
      };

      await expectAsync(
        resolver.resolve(route as ActivatedRouteSnapshot).then((transaction: Transaction | undefined) => {
          expect(transaction).toBeTruthy();
          if (transaction) {
            expect(transaction.loan?.id).toEqual('1');
          }
        }),
      ).toBeResolved();
    });

    it('should add redesignation', async () => {
      spyOn(resolver.transactionService, 'get').and.callFake((id) => {
        return Promise.resolve(
          SchBTransaction.fromJSON({
            id: id,
            transaction_type_identifier: ScheduleBTransactionTypes.OPERATING_EXPENDITURE,
            transactionType: TransactionTypeUtils.factory(ScheduleBTransactionTypes.OPERATING_EXPENDITURE),
            contact_id: '123',
            contact_1: Contact.fromJSON({ id: 123 }),
          }),
        );
      });
      const route = {
        queryParamMap: convertToParamMap({ redesignation: '1' }),
        paramMap: convertToParamMap({
          reportId: 1,
          transactionType: ScheduleBTransactionTypes.OPERATING_EXPENDITURE,
        }),
      };

      await expectAsync(
        resolver.resolve(route as ActivatedRouteSnapshot).then((transaction: Transaction | undefined) => {
          expect(transaction).toBeTruthy();
          if (transaction) {
            expect((transaction as SchBTransaction).reattribution_redesignation_tag).toEqual('REDESIGNATION_TO');
            expect(
              ((transaction as SchBTransaction).children[0] as SchBTransaction).reattribution_redesignation_tag,
            ).toEqual('REDESIGNATION_FROM');
          }
        }),
      ).toBeResolved();
    });
  });

  describe('resolveExistingTransactionFromId', () => {
    it('should return parent transaction if dependent child is requested', async () => {
      let firstCall = true;
      spyOn(resolver.transactionService, 'get').and.callFake(() => {
        if (firstCall) {
          firstCall = false; // Mark first call as completed
          return Promise.resolve(
            SchATransaction.fromJSON({
              id: 999,
              transaction_type_identifier: ScheduleATransactionTypes.EARMARK_MEMO,
              transactionType: TransactionTypeUtils.factory(ScheduleATransactionTypes.EARMARK_MEMO),
              contact_id: '123',
              contact_1: Contact.fromJSON({ id: 123 }),
              parent_transaction_id: 2,
            }),
          );
        } else {
          return Promise.resolve(
            SchATransaction.fromJSON({
              id: 2,
              transaction_type_identifier: ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_JF_TRANSFER_MEMO,
              transactionType: TransactionTypeUtils.factory(
                ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_JF_TRANSFER_MEMO,
              ),
            }),
          );
        }
      });

      await expectAsync(
        resolver.resolveExistingTransactionFromId('10').then((transaction: Transaction | undefined) => {
          if (transaction)
            expect(transaction.transaction_type_identifier).toBe(
              ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_JF_TRANSFER_MEMO,
            );
        }),
      ).toBeResolved();
    });

    it('should have parent transaction', async () => {
      spyOn(resolver.transactionService, 'get').and.callFake((id) => {
        return Promise.resolve(
          SchATransaction.fromJSON({
            id: id,
            transactionType: TransactionTypeUtils.factory(
              ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_JF_TRANSFER_MEMO,
            ),
            contact_id: '123',
            contact_1: Contact.fromJSON({ id: 123 }),
            transaction_type_identifier: ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_JF_TRANSFER_MEMO,
            parent_transaction: SchATransaction.fromJSON({
              id: '2',
              transaction_type_identifier: ScheduleATransactionTypes.JOINT_FUNDRAISING_TRANSFER,
              transactionType: TransactionTypeUtils.factory(ScheduleATransactionTypes.JOINT_FUNDRAISING_TRANSFER),
              contact_id: '123',
              contact_1: Contact.fromJSON({ id: 123 }),
            }),
          }),
        );
      });
      await expectAsync(
        resolver.resolveExistingTransactionFromId('10').then((transaction: Transaction | undefined) => {
          expect(transaction).toBeTruthy();
          if (transaction) expect(transaction.id).toBe('10');
          expect(transaction?.parent_transaction?.id).toBe('2');
        }),
      ).toBeResolved();
    });

    it('should have grandparent transaction ', async () => {
      spyOn(resolver.transactionService, 'get').and.callFake((id) => {
        return Promise.resolve(
          SchATransaction.fromJSON({
            id: id,
            transaction_type_identifier: ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_JF_TRANSFER_MEMO,
            transactionType: TransactionTypeUtils.factory(
              ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_JF_TRANSFER_MEMO,
            ),
            contact_id: '123',
            contact_1: Contact.fromJSON({ id: 123 }),
            parent_transaction: SchATransaction.fromJSON({
              transaction_type_identifier: ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_JF_TRANSFER_MEMO,
              transactionType: TransactionTypeUtils.factory(
                ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_JF_TRANSFER_MEMO,
              ),
              id: '2',
              contact_id: '123',
              contact_1: Contact.fromJSON({ id: 123 }),
              parent_transaction: SchATransaction.fromJSON({
                id: '1',
                transaction_type_identifier: ScheduleATransactionTypes.JOINT_FUNDRAISING_TRANSFER,
                transactionType: TransactionTypeUtils.factory(ScheduleATransactionTypes.JOINT_FUNDRAISING_TRANSFER),
                contact_id: '123',
                contact_1: Contact.fromJSON({ id: 123 }),
              }),
            }),
          }),
        );
      });
      await expectAsync(
        resolver.resolveExistingTransactionFromId('10').then((transaction: Transaction | undefined) => {
          if (transaction) expect(transaction.id).toBe('10');
          expect(transaction?.parent_transaction?.id).toBe('2');
          expect(transaction?.parent_transaction?.parent_transaction?.id).toBe('1');
        }),
      ).toBeResolved();
    });

    it('should have debt transaction', async () => {
      spyOn(resolver.transactionService, 'get').and.callFake((id) => {
        return Promise.resolve(
          SchATransaction.fromJSON({
            id: id,
            transaction_type_identifier: ScheduleDTransactionTypes.DEBT_OWED_TO_COMMITTEE,
            transactionType: TransactionTypeUtils.factory(ScheduleDTransactionTypes.DEBT_OWED_TO_COMMITTEE),
            contact_id: '123',
            contact_1: Contact.fromJSON({ id: 123 }),
            debt: SchDTransaction.fromJSON({
              id: '2',
              transaction_type_identifier: ScheduleDTransactionTypes.DEBT_OWED_TO_COMMITTEE,
              transactionType: TransactionTypeUtils.factory(ScheduleDTransactionTypes.DEBT_OWED_TO_COMMITTEE),
              contact_id: '123',
              contact_1: Contact.fromJSON({ id: 123 }),
            }),
          }),
        );
      });
      await expectAsync(
        resolver.resolveExistingTransactionFromId('10').then((transaction: Transaction | undefined) => {
          if (transaction) expect(transaction.id).toBe('10');
          expect(transaction?.debt?.id).toBe('2');
        }),
      ).toBeResolved();
    });

    it('should have loan transaction', async () => {
      spyOn(resolver.transactionService, 'get').and.callFake((id) => {
        return Promise.resolve(
          SchATransaction.fromJSON({
            id: id,
            transaction_type_identifier: ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK,
            transactionType: TransactionTypeUtils.factory(ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK),
            contact_id: '123',
            contact_1: Contact.fromJSON({ id: 123 }),
            loan: SchCTransaction.fromJSON({
              id: '2',
              transaction_type_identifier: ScheduleCTransactionTypes.LOAN_BY_COMMITTEE,
              transactionType: TransactionTypeUtils.factory(ScheduleCTransactionTypes.LOAN_BY_COMMITTEE),
              contact_id: '123',
              contact_1: Contact.fromJSON({ id: 123 }),
            }),
          }),
        );
      });
      await expectAsync(
        resolver.resolveExistingTransactionFromId('10').then((transaction: Transaction | undefined) => {
          if (transaction) expect(transaction.id).toBe('10');
          expect(transaction?.loan?.id).toBe('2');
        }),
      ).toBeResolved();
    });
  });

  describe('resolveNewTransaction', () => {
    it('should add new child transaction to new parent if parent has a dependentChildTransactionTypes', async () => {
      await expectAsync(
        resolver
          .resolveNewTransaction('10', ScheduleATransactionTypes.EARMARK_RECEIPT)
          .then((transaction: Transaction | undefined) => {
            if (transaction?.children)
              expect(transaction.children[0].transaction_type_identifier).toBe(ScheduleATransactionTypes.EARMARK_MEMO);
          }),
      ).toBeResolved();
    });
  });

  describe('resolveNewReattribution', () => {
    const route = {
      queryParamMap: convertToParamMap({ reattribution: '1' }),
      paramMap: convertToParamMap({
        reportId: 1,
        transactionType: ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
      }),
    };
    beforeEach(() => {
      spyOn(resolver.transactionService, 'get').and.callFake((id) => {
        return Promise.resolve(
          SchATransaction.fromJSON({
            id: id,
            transaction_type_identifier: ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
            transactionType: TransactionTypeUtils.factory(ScheduleATransactionTypes.INDIVIDUAL_RECEIPT),
            contact_id: '123',
            contact_1: Contact.fromJSON({ id: 123 }),
            report: {
              report_type: 'F3X',
              report_code: 'Q1',
              reportCode: 'Q1',
            },
          }),
        );
      });
    });
    it('should add reattribution', async () => {
      await expectAsync(
        resolver.resolve(route as ActivatedRouteSnapshot).then((transaction: Transaction | undefined) => {
          expect(transaction).toBeTruthy();
          if (transaction) {
            expect((transaction as SchATransaction).reattribution_redesignation_tag).toEqual('REATTRIBUTION_TO');
            expect(
              ((transaction as SchATransaction).children[0] as SchATransaction).reattribution_redesignation_tag,
            ).toEqual('REATTRIBUTION_FROM');
          }
        }),
      ).toBeResolved();
    });

    it('should throw error if redesignated does not have transaction_type_identifier', async () => {
      spyOn(ReattributedUtils, 'overlayTransactionProperties').and.callFake((transaction, id) => {
        return SchATransaction.fromJSON({
          id: id,
          transaction_type_identifier: undefined,
          transactionType: TransactionTypeUtils.factory(ScheduleATransactionTypes.INDIVIDUAL_RECEIPT),
          contact_id: '123',
          contact_1: Contact.fromJSON({ id: 123 }),
        });
      });
      await expectAsync(resolver.resolve(route as ActivatedRouteSnapshot)).toBeRejectedWithError(
        'FECfile+: originating reattribution transaction type not found.',
      );
    });
  });

  describe('resolveExistingReattribution', async () => {
    beforeEach(() => {
      spyOn(resolver.transactionService, 'get').and.callFake((id) => {
        return Promise.resolve(
          SchATransaction.fromJSON({
            id: id,
            transaction_type_identifier: ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
            transactionType: TransactionTypeUtils.factory(ScheduleATransactionTypes.INDIVIDUAL_RECEIPT),
            contact_id: '123',
            contact_1: Contact.fromJSON({ id: 123 }),
            report: {
              report_type: 'F3X',
              report_code: 'Q1',
              reportCode: 'Q1',
            },
            reattribution_redesignation_tag: 'REATTRIBUTED',
            entity_type: ContactTypes.INDIVIDUAL,
          }),
        );
      });
    });

    it('should resolve existing reattribution', async () => {
      await expectAsync(
        resolver.resolveExistingTransactionFromId('10').then((transaction: Transaction | undefined) => {
          if (transaction) expect(transaction.id).toBe('10');
        }),
      ).toBeResolved();
    });
  });
});
