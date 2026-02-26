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

  it('should preserve zero-valued numeric fields from JSON', () => {
    const data = {
      transaction_type_identifier: 'DEBT_OWED_BY_COMMITTEE',
      beginning_balance: 0,
      incurred_amount: '0',
      payment_amount: 0,
      balance_at_close: '0',
    };
    const transaction: SchDTransaction = SchDTransaction.fromJSON(data);
    expect(transaction.beginning_balance).toBe(0);
    expect(transaction.incurred_amount).toBe(0);
    expect(transaction.payment_amount).toBe(0);
    expect(transaction.balance_at_close).toBe(0);
  });

  it('should map null numeric fields to undefined from JSON', () => {
    const data = {
      transaction_type_identifier: 'DEBT_OWED_BY_COMMITTEE',
      beginning_balance: null,
      incurred_amount: null,
      payment_amount: null,
      balance_at_close: null,
    };
    const transaction: SchDTransaction = SchDTransaction.fromJSON(data);
    expect(transaction.beginning_balance).toBeUndefined();
    expect(transaction.incurred_amount).toBeUndefined();
    expect(transaction.payment_amount).toBeUndefined();
    expect(transaction.balance_at_close).toBeUndefined();
  });

  it('should map non-primitive numeric fields to undefined from JSON', () => {
    const data = {
      transaction_type_identifier: 'DEBT_OWED_BY_COMMITTEE',
      beginning_balance: {},
      incurred_amount: [],
      payment_amount: { value: '1' },
      balance_at_close: true,
    };
    const transaction: SchDTransaction = SchDTransaction.fromJSON(data);
    expect(transaction.beginning_balance).toBeUndefined();
    expect(transaction.incurred_amount).toBeUndefined();
    expect(transaction.payment_amount).toBeUndefined();
    expect(transaction.balance_at_close).toBeUndefined();
  });

  xit('Creates a transaction object from JSON', () => {
    const json = {
      transaction_type_identifier: 'DEBT_OWED_BY_COMMITTEE',
    };
    const transaction: SchDTransaction = SchDTransaction.fromJSON(json);
    expect(transaction.constructor.name).toBe('_SchDTransaction');
  });
});
