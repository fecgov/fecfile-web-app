import { SchBTransaction } from './schb-transaction.model';

describe('SchBTransaction', () => {
  it('should create an instance', () => {
    expect(new SchBTransaction()).toBeTruthy();
  });

  xit('#fromJSON() should return a populated SchBTransaction instance', () => {
    const data = {
      id: '999',
      form_type: 'SA11Ai',
      payee_organization_name: 'foo',
      expenditure_date: undefined,
    };
    const transaction: SchBTransaction = SchBTransaction.fromJSON(data);
    expect(transaction).toBeInstanceOf(SchBTransaction);
    expect(transaction.id).toBe('999');
    expect(transaction.form_type).toBe('SA11Ai');
    expect(transaction.payee_organization_name).toBe('foo');
    expect(transaction.election_code).toBe(undefined);
  });
});
