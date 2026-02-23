import { getTestTransactionByType } from '../utils/unit-test.utils';
import { ContactTypes } from './contact.model';
import { SchATransaction } from './scha-transaction.model';
import { Transaction, getTransactionName } from './transaction.model';
import { ScheduleATransactionTypes } from './type-enums';

describe('Transaction', () => {
  it('should create an instance', () => {
    // Must extend the abstract class to instantiate it
    class ChildTransaction extends Transaction {
      apiEndpoint = '/sch-x-transactions';
    }
    expect(new ChildTransaction()).toBeTruthy();
  });

  it('should formulate names correctly', async () => {
    const testTransaction = (await getTestTransactionByType(
      ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
    )) as SchATransaction;
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
