import { Transaction } from './transaction.model';

describe('Transaction', () => {
  it('should create an instance', () => {
    // Must extend the abstract class to instantiate it
    class ChildTransaction extends Transaction {}
    expect(new ChildTransaction()).toBeTruthy();
  });
});
