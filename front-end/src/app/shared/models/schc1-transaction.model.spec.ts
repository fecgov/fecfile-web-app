import { hydrateTransaction } from '../utils/transaction-type.utils';
import { SchC1Transaction } from './schc1-transaction.model';

describe('SchC1Transaction', () => {
  it('should create an instance', () => {
    expect(new SchC1Transaction()).toBeTruthy();
  });

  it('#fromJSON() should return a populated SchC1Transaction instance', async () => {
    const data = {
      id: '999',
      form_type: 'SC/10',
      lender_organization_name: 'foo',
    };
    const transaction: SchC1Transaction = await hydrateTransaction(data, SchC1Transaction);
    expect(transaction).toBeInstanceOf(SchC1Transaction);
    expect(transaction.id).toBe('999');
    expect(transaction.form_type).toBe('SC/10');
    expect(transaction.lender_organization_name).toBe('foo');
  });

  it('Creates a transaction object from JSON', async () => {
    const json = {
      transaction_type_identifier: 'RETURN_RECEIPT',
      parent_transaction: {
        transaction_type_identifier: 'RETURN_RECEIPT',
      },
      children: [
        {
          transaction_type_identifier: 'RETURN_RECEIPT',
        },
      ],
    };
    const transaction: SchC1Transaction = await hydrateTransaction(json, SchC1Transaction);
    expect(transaction.constructor.name).toBe('_SchC1Transaction');
  });
});
