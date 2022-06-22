import { SchATransaction } from './scha-transaction.model';

describe('SchATransaction', () => {
  it('should create an instance', () => {
    expect(new SchATransaction()).toBeTruthy();
  });

  it('#fromJSON() should return a populated SchATransaction instance', () => {
    const data = {
      id: 999,
      form_type: 'SA11Ai',
      contributor_organization_name: 'foo',
      contribution_date: null,
    };
    const schATransaction: SchATransaction = SchATransaction.fromJSON(data);
    expect(schATransaction).toBeInstanceOf(SchATransaction);
    expect(schATransaction.id).toBe(999);
    expect(schATransaction.form_type).toBe('SA11Ai');
    expect(schATransaction.contributor_organization_name).toBe('foo');
    expect(schATransaction.election_code).toBe(null);
  });
});
