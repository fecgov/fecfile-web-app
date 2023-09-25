import { INDIVIDUAL_RECEIPT } from './INDIVIDUAL_RECEIPT.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TransactionType } from 'app/shared/models/transaction-type.model';
import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';

describe('INDIVIDUAL_RECEIPT', () => {
  let transactionType: INDIVIDUAL_RECEIPT;
  let transaction: SchATransaction;

  beforeEach(() => {
    transaction = getTestTransactionByType(ScheduleATransactionTypes.INDIVIDUAL_RECEIPT) as SchATransaction;
  });

  beforeEach(() => {
    transactionType = new INDIVIDUAL_RECEIPT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA11AI');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.INDIVIDUAL_RECEIPT);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });

  it('should not change navigation control', () => {
    const navControls = transaction.transactionType.getNavigationControls(transaction);
    const continueControl = navControls?.continueControls?.pop();
    expect(continueControl?.label).toBe('Save');
  });

  it('should change footer', () => {
    const footer = transaction.transactionType.getFooter(transaction);
    expect(footer).toBeUndefined();
  });
});
