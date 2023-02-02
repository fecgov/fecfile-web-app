import { EARMARK_RECEIPT_RECOUNT_ACCOUNT } from './EARMARK_RECEIPT_RECOUNT_ACCOUNT.model';

describe('Transaction Type Model', () => {
  it('#generatePurposeDescriptionWrapper() should not truncate short purpose descriptions', () => {
    const transactionType = new EARMARK_RECEIPT_RECOUNT_ACCOUNT();
    const spy = spyOn(transactionType, 'generatePurposeDescription');
    spy.and.returnValue('A short response');

    const originalDescrip = transactionType.generatePurposeDescription?.();
    const modifiedDescrip = transactionType.generatePurposeDescriptionWrapper();
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

    const originalDescrip = transactionType.generatePurposeDescription?.();
    const modifiedDescrip = transactionType.generatePurposeDescriptionWrapper();
    expect(originalDescrip).not.toEqual(modifiedDescrip);
    expect(modifiedDescrip.length).toEqual(100);
  });
});
