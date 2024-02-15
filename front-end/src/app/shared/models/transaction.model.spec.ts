import { getTestTransactionByType } from '../utils/unit-test.utils';
import { ContactTypes } from './contact.model';
import { SchATransaction, ScheduleATransactionTypes } from './scha-transaction.model';
import { getTransactionName, Transaction } from './transaction.model';

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
      ScheduleATransactionTypes.PARTNERSHIP_RECEIPT,
    ) as SchATransaction;

    const payload = testTransaction.getUpdatedParent();
    expect(payload.transaction_type_identifier).toBe(ScheduleATransactionTypes.PARTNERSHIP_RECEIPT);
  });

  it('should formulate names correctly', () => {
    const testTransaction = getTestTransactionByType(ScheduleATransactionTypes.INDIVIDUAL_RECEIPT) as SchATransaction;
    testTransaction.contributor_last_name = 'lname';
    testTransaction.contributor_first_name = 'fname';
    testTransaction.entity_type = ContactTypes.INDIVIDUAL;
    let name = getTransactionName(testTransaction);
    expect(name).toBe('lname, fname');

    testTransaction.contributor_organization_name = 'orgname';
    testTransaction.entity_type = ContactTypes.ORGANIZATION;
    name = getTransactionName(testTransaction);
    expect(name).toBe('orgname');
  });
});
