import { SchETransaction } from './sche-transaction.model';

describe('SchETransaction', () => {
  it('should create an instance', () => {
    expect(new SchETransaction()).toBeTruthy();
  });

  it('#fromJSON() should return a populated SchETransaction instance', () => {
    const data = {
      id: '999',
      form_type: 'SE',
      payee_organization_name: 'foo',
    };
    const transaction: SchETransaction = SchETransaction.fromJSON(data);
    expect(transaction).toBeInstanceOf(SchETransaction);
    expect(transaction.id).toBe('999');
    expect(transaction.form_type).toBe('SE');
    expect(transaction.payee_organization_name).toBe('foo');
  });

  xit('Creates a transaction object from JSON', () => {
    const json = {
      transaction_type_identifier: 'INDEPENDENT_EXPENDITURE',
      parent_transaction: {
        transaction_type_identifier: 'INDEPENDENT_EXPENDITURE',
      },
      children: [
        {
          transaction_type_identifier: 'INDEPENDENT_EXPENDITURE',
        },
      ],
    };
    const transaction: SchETransaction = SchETransaction.fromJSON(json);
    expect(transaction.constructor.name).toBe('SchETransaction');
  });
});
