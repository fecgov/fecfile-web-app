import { SchFTransaction } from './schf-transaction.model';

describe('SchFTransaction', () => {
  it('should create an instance', () => {
    expect(new SchFTransaction()).toBeTruthy();
  });

  it('#fromJSON() should return a populated SchFTransaction instance', () => {
    const data = {
      id: '999',
      transaction_type_identifier: 'COORDINATED_PARTY_EXPENDITURE',
      form_type: 'SF9999',
      payee_organization_name: 'foo',
      expenditure_date: undefined,
    };
    const schFTransaction: SchFTransaction = SchFTransaction.fromJSON(data);
    expect(schFTransaction).toBeInstanceOf(SchFTransaction);
    expect(schFTransaction.id).toBe('999');
    expect(schFTransaction.form_type).toBe('SF9999');
    expect(schFTransaction.payee_organization_name).toBe('foo');
    expect(schFTransaction.expenditure_date).toBeUndefined();
  });

  it('Creates a transaction object from JSON', () => {
    const json = {
      transaction_type_identifier: 'COORDINATED_EXPENDITURE',
      parent_transaction: {
        transaction_type_identifier: 'COORDINATED_EXPENDITURE',
      },
    };
    const transaction: SchFTransaction = SchFTransaction.fromJSON(json);
    expect(transaction.constructor.name).toBe('SchFTransaction');
  });

});
