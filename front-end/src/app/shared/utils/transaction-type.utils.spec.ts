import { getFromJSON, TransactionTypeUtils } from './transaction-type.utils';

describe('LabelUtils', () => {
  it('should create an instance', () => {
    expect(new TransactionTypeUtils()).toBeTruthy();
  });

  it('non-existing transaction type should throw an error', () => {
    expect(() => {
      TransactionTypeUtils.factory('DOES_NOT_EXIST');
    }).toThrow(new Error("Fecfile: Class transaction type of 'DOES_NOT_EXIST' is not found"));
  });

  it('should return the correct schedule object given a scheduleId', () => {
    const testJSON = {
      transaction_type_identifier: 'LOAN_RECEIVED_FROM_INDIVIDUAL',
    };

    let scheduleObject = getFromJSON(testJSON);
    expect(scheduleObject.constructor.name).toBe('SchCTransaction');

    testJSON.transaction_type_identifier = 'DEBT_OWED_TO_COMMITTEE';
    scheduleObject = getFromJSON(testJSON);
    expect(scheduleObject.constructor.name).toBe('SchDTransaction');

    testJSON.transaction_type_identifier = 'INDEPENDENT_EXPENDITURE';
    scheduleObject = getFromJSON(testJSON);
    expect(scheduleObject.constructor.name).toBe('SchETransaction');
  });
});
