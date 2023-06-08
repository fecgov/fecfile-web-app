import { SchC2Transaction } from './schc2-transaction.model';

describe('SchC2Transaction', () => {
  it('should create an instance', () => {
    expect(new SchC2Transaction()).toBeTruthy();
  });

  it('#fromJSON() should return a populated SchC2Transaction instance', () => {
    const data = {
      id: '999',
      form_type: 'SC/10',
      guarantor_last_name: 'foo',
    };
    const transaction: SchC2Transaction = SchC2Transaction.fromJSON(data);
    expect(transaction).toBeInstanceOf(SchC2Transaction);
    expect(transaction.id).toBe('999');
    expect(transaction.form_type).toBe('SC/10');
    expect(transaction.guarantor_last_name).toBe('foo');
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
    const transaction: SchC2Transaction = SchC2Transaction.fromJSON(json);
    expect(transaction.constructor.name).toBe('SchC2Transaction');
  });
});
