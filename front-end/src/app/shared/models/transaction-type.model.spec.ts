import { ScheduleATransactionTypes } from './scha-transaction.model';
import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';
import { TransactionType } from './transaction-type.model';
import { ScheduleETransactionTypes } from './sche-transaction.model';

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

  it('form toggle functions to work', () => {
    let transaction = getTestTransactionByType(ScheduleATransactionTypes.PAC_RECOUNT_RECEIPT);
    expect(transaction.transactionType.hasSignature1()).toBeFalse();
    expect(transaction.transactionType.hasSignature2()).toBeFalse();
    expect(transaction.transactionType.hasSupportOpposeCode()).toBeFalse();
    transaction = getTestTransactionByType(ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE);
    expect(transaction.transactionType.hasSignature1()).toBeTrue();
    expect(transaction.transactionType.hasSupportOpposeCode()).toBeTrue();
  });
});
