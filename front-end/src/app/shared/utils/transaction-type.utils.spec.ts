import { TransactionTypeUtils } from './transaction-type.utils';

describe('LabelUtils', () => {
  it('should create an instance', () => {
    expect(new TransactionTypeUtils()).toBeTruthy();
  });

  it('non-existing transaction type should throw an error', () => {
    expect(() => {
      TransactionTypeUtils.factory('DOES_NOT_EXIST');
    }).toThrow(new Error("Fecfile: Class transaction type of 'DOES_NOT_EXIST' is not found"));
  });
});
