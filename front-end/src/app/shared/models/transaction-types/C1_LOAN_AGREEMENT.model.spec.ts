import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';
import { SchCTransaction } from '../schc-transaction.model';
import { SchC1Transaction } from '../schc1-transaction.model';
import { STANDARD_CONTROLS } from '../transaction-navigation-controls.model';
import { C1_LOAN_AGREEMENT } from './C1_LOAN_AGREEMENT.model';
import { ScheduleC1TransactionTypes, ScheduleCTransactionTypes } from '../type-enums';
import { TransactionUtils } from 'app/shared/utils/transaction.utils';

describe('C1_LOAN_AGREEMENT', () => {
  let transactionType: C1_LOAN_AGREEMENT;
  let transaction: SchC1Transaction;

  beforeEach(async () => {
    transactionType = new C1_LOAN_AGREEMENT();
    transaction = (await getTestTransactionByType(ScheduleC1TransactionTypes.C1_LOAN_AGREEMENT)) as SchC1Transaction;
    transaction.parent_transaction = (await getTestTransactionByType(
      ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK,
    )) as SchCTransaction;
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('C1');
  });

  it('#factory() should return a SchC1Transaction', async () => {
    const transaction: SchC1Transaction = (await TransactionUtils.createNewTransaction(
      transactionType,
    )) as SchC1Transaction;
    expect(transaction.form_type).toBe('SC1/10');
    expect(transaction.transaction_type_identifier).toBe(ScheduleC1TransactionTypes.C1_LOAN_AGREEMENT);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    expect(transactionType?.generatePurposeDescription).toBeUndefined();
  });

  it('should change various fields if parent is pulled forward loan', () => {
    // getInheritedFields()
    expect(transaction.transactionType.inheritedFields?.length).toBeGreaterThan(0);
    expect(transaction.transactionType.getInheritedFields(transaction)?.length).toBeGreaterThan(0);

    // getNavigationControls()
    expect(transaction.transactionType.navigationControls).toBeUndefined();
    expect(transaction.transactionType.getNavigationControls(transaction)).toBeUndefined();

    // getFooter()
    const expectedFooterText =
      'The information in this loan  will automatically create a related receipt. Review the receipt; enter a purpose of receipt or note/memo text; or continue without reviewing and "Save transactions."';
    expect(transaction.transactionType.footer).toBe(expectedFooterText);
    expect(transaction.transactionType.getFooter(transaction)).toBe(expectedFooterText);

    // getUseParentContact()
    expect(transaction.transactionType.useParentContact).toBeTrue();
    expect(transaction.transactionType.getUseParentContact(transaction)).toBeTrue();

    if (transaction.parent_transaction) {
      transaction.parent_transaction.loan_id = 'test';
    }
    expect(transaction?.parent_transaction?.loan_id).toEqual('test');

    expect(transaction.transactionType.getFooter(transaction)).toBeUndefined();
    expect(transaction.transactionType.getInheritedFields(transaction)?.length).toBeUndefined();
    expect(transaction.transactionType.getNavigationControls(transaction)).toBe(STANDARD_CONTROLS);
    expect(transaction.transactionType.getUseParentContact(transaction)).toBeFalse();
  });
});
