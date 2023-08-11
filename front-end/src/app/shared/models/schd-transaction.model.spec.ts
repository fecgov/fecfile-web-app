import { SchDTransaction } from './schd-transaction.model';

describe('SchDTransaction', () => {
  it('should create an instance', () => {
    expect(new SchDTransaction()).toBeTruthy();
  });

  it('#fromJSON() should return a populated SchDTransaction instance', () => {
    const data = {
      id: '999',
      form_type: 'SD10',
      creditor_organization_name: 'foo',
    };
    const transaction: SchDTransaction = SchDTransaction.fromJSON(data);
    expect(transaction).toBeInstanceOf(SchDTransaction);
    expect(transaction.id).toBe('999');
    expect(transaction.form_type).toBe('SD10');
    expect(transaction.creditor_organization_name).toBe('foo');
  });

  xit('Creates a transaction object from JSON', () => {
    const json = {
      transaction_type_identifier: 'DEBT_OWED_BY_COMMITTEE',
    };
    const transaction: SchDTransaction = SchDTransaction.fromJSON(json);
    expect(transaction.constructor.name).toBe('SchDTransaction');
  });
});
