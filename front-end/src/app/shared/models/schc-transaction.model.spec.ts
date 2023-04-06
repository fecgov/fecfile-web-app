import { SchCTransaction } from './schc-transaction.model';

describe('SchCTransaction', () => {
  it('should create an instance', () => {
    expect(new SchCTransaction()).toBeTruthy();
  });

  it('#fromJSON() should return a populated SchCTransaction instance', () => {
    const data = {
      id: '999',
      form_type: 'SC/10',
      lender_organization_name: 'foo',
    };
    const transaction: SchCTransaction = SchCTransaction.fromJSON(data);
    expect(transaction).toBeInstanceOf(SchCTransaction);
    expect(transaction.id).toBe('999');
    expect(transaction.form_type).toBe('SC/10');
    expect(transaction.lender_organization_name).toBe('foo');
  });

  it('Creates a transaction object from JSON', () => {
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
    const transaction: SchCTransaction = SchCTransaction.fromJSON(json);
    expect(transaction.constructor.name).toBe('SchCTransaction');
  });
});
