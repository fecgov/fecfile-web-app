import { getTestTransactionByType } from '../../utils/unit-test.utils';
import { ContactTypes } from '../contacts/contact-types.model';
import { SchATransaction } from './schedule-a/scha-transaction.model';
import { ScheduleATransactionTypes } from './schedule-a/schedule-a-transaction-types.model';
import { getTransactionName } from './transaction-model.utils';
import { Transaction } from './transaction.model';

describe('Transaction', () => {
  it('should create an instance', () => {
    // Must extend the abstract class to instantiate it
    class ChildTransaction extends Transaction {
      apiEndpoint = '/sch-x-transactions';
    }
    expect(new ChildTransaction()).toBeTruthy();
  });

  it('should formulate names correctly', () => {
    const testTransaction = getTestTransactionByType(ScheduleATransactionTypes.INDIVIDUAL_RECEIPT) as SchATransaction;
    testTransaction.contributor_last_name = 'lname';
    testTransaction.contributor_first_name = 'fname';
    testTransaction.entity_type = ContactTypes.INDIVIDUAL;
    let name = getTransactionName(testTransaction);
    expect(name).toBe('fname lname');

    testTransaction.contributor_organization_name = 'orgname';
    testTransaction.entity_type = ContactTypes.ORGANIZATION;
    name = getTransactionName(testTransaction);
    expect(name).toBe('orgname');
  });
});
