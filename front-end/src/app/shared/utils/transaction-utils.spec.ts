import { TransactionUtils } from './transaction.utils';

describe('TransactionUtils', () => {
  it('should return the correct schedule object given a scheduleId', async () => {
    const testJSON = {
      transaction_type_identifier: 'LOAN_RECEIVED_FROM_INDIVIDUAL',
    };

    let scheduleObject = await TransactionUtils.getFromJSON(testJSON);
    expect(scheduleObject.constructor.name).toBe('SchCTransaction');

    testJSON.transaction_type_identifier = 'DEBT_OWED_TO_COMMITTEE';
    scheduleObject = await TransactionUtils.getFromJSON(testJSON);
    expect(scheduleObject.constructor.name).toBe('SchDTransaction');

    testJSON.transaction_type_identifier = 'INDEPENDENT_EXPENDITURE';
    scheduleObject = await TransactionUtils.getFromJSON(testJSON);
    expect(scheduleObject.constructor.name).toBe('SchETransaction');
  });

  it('should remove leading zeroes from Transactions', async () => {
    const testJSON = { line_label: '09' };
    const scheduleObject = await TransactionUtils.getFromJSON(testJSON);
    expect(scheduleObject.line_label).toBe('9');
  });
});
