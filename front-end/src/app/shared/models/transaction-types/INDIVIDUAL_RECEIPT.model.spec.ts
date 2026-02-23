import { INDIVIDUAL_RECEIPT } from './INDIVIDUAL_RECEIPT.model';
import { SchATransaction } from '../scha-transaction.model';
import { TransactionType } from 'app/shared/models/transaction-type.model';
import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';
import { ScheduleATransactionTypes } from '../type-enums';
import { TransactionUtils } from 'app/shared/utils/transaction.utils';

describe('INDIVIDUAL_RECEIPT', () => {
  let transactionType: INDIVIDUAL_RECEIPT;
  let transaction: SchATransaction;

  beforeEach(async () => {
    transaction = (await getTestTransactionByType(ScheduleATransactionTypes.INDIVIDUAL_RECEIPT)) as SchATransaction;
  });

  beforeEach(() => {
    transactionType = new INDIVIDUAL_RECEIPT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
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
