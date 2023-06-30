import { getTestTransactionByType } from '../utils/unit-test.utils';
import { SchATransaction, ScheduleATransactionTypes } from './scha-transaction.model';
import { Transaction } from './transaction.model';

describe('Transaction', () => {
  it('should create an instance', () => {
    // Must extend the abstract class to instantiate it
    class ChildTransaction extends Transaction {
      apiEndpoint = '/sch-x-transactions';
    }
    expect(new ChildTransaction()).toBeTruthy();
  });

  it('should update child purpose descriptions', () => {
    const testTransaction = getTestTransactionByType(
      ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION,
      ScheduleATransactionTypes.PARTNERSHIP_RECEIPT
    ) as SchATransaction;

    const payload = testTransaction.getUpdatedParent();
    expect(payload.transaction_type_identifier).toBe(ScheduleATransactionTypes.PARTNERSHIP_RECEIPT);
  });
});
