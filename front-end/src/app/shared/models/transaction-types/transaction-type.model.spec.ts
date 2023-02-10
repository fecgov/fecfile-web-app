import { TransactionTypeUtils } from 'app/shared/utils/transaction-type.utils';
import { ScheduleATransactionTypes } from '../scha-transaction.model';
import { EARMARK_RECEIPT_RECOUNT_ACCOUNT } from './EARMARK_RECEIPT_RECOUNT_ACCOUNT.model';
import { Transaction } from '../transaction.model';

describe('Transaction Type Model', () => {
  let transaction: Transaction;

  beforeEach(() => {
    transaction = TransactionTypeUtils.factory(
      ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_RECOUNT_ACCOUNT_CONTRIBUTION
    ).getNewTransaction();
  });

  it('#generatePurposeDescriptionWrapper() should not truncate short purpose descriptions', () => {
    const transactionType = new EARMARK_RECEIPT_RECOUNT_ACCOUNT();
    const spy = spyOn(transactionType, 'generatePurposeDescription');
    spy.and.returnValue('A short response');

    const originalDescrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    const modifiedDescrip = transaction.transactionType?.generatePurposeDescriptionWrapper(transaction);
    expect(originalDescrip).toEqual(modifiedDescrip);
  });

  it('#generatePurposeDescriptionWrapper() should not truncate short purpose descriptions', () => {
    const transactionType = new EARMARK_RECEIPT_RECOUNT_ACCOUNT();
    const spy = spyOn(transactionType, 'generatePurposeDescription');
    spy.and.returnValue(
      'An absurdly long response' +
        'Just the biggest; no corners cut.' +
        'It needs to be at least 100 chars.' +
        'This should probably get it done.'
    );

    const originalDescrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    const modifiedDescrip = transaction.transactionType?.generatePurposeDescriptionWrapper(transaction) || '';
    expect(originalDescrip).not.toEqual(modifiedDescrip);
    expect(modifiedDescrip.length).toEqual(100);
  });
});
