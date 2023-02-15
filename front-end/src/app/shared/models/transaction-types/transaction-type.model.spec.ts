import { ScheduleATransactionTypes } from '../scha-transaction.model';
import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';
import { TransactionType } from './transaction-type.model';

describe('Transaction Type Model', () => {
  it('#generatePurposeDescriptionWrapper() should not truncate short purpose descriptions', () => {
    const transaction = getTestTransactionByType(ScheduleATransactionTypes.PAC_RECOUNT_RECEIPT);
    if (!transaction.transactionType) throw new Error('Fecfile: transactionType method does not exist');
    // prettier-ignore
    const spy = spyOn<TransactionType, any>(transaction.transactionType, 'generatePurposeDescription'); // eslint-disable-line @typescript-eslint/no-explicit-any
    spy.and.returnValue('A short response');

    const originalDescrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    const modifiedDescrip = transaction.transactionType?.generatePurposeDescriptionWrapper(transaction);
    expect(originalDescrip).toEqual(modifiedDescrip);
  });

  it('#generatePurposeDescriptionWrapper() should not truncate short purpose descriptions', () => {
    const transaction = getTestTransactionByType(ScheduleATransactionTypes.PAC_RECOUNT_RECEIPT);
    if (!transaction.transactionType) throw new Error('Fecfile: transactionType method does not exist');
    // prettier-ignore
    const spy = spyOn<TransactionType, any>(transaction.transactionType, 'generatePurposeDescription'); // eslint-disable-line @typescript-eslint/no-explicit-any
    spy.and.returnValue(
      'An absurdly long response' +
        'Just the biggest; no corners cut.' +
        'It needs to be at least 100 chars.' +
        'This should probably get it done.'
    );

    const originalDescrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    const modifiedDescrip = transaction.transactionType?.generatePurposeDescriptionWrapper(transaction);
    expect(originalDescrip).not.toEqual(modifiedDescrip);
    expect(modifiedDescrip?.length).toEqual(100);
  });
});
