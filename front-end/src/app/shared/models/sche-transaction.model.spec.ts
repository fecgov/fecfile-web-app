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

    const fieldsNotToValidate = transaction.getFieldsNotToValidate();
    expect(fieldsNotToValidate[0]).toBe('calendar_ytd_per_election_office');

    const fieldsNotToSave = transaction.getFieldsNotToSave();
    expect(fieldsNotToSave[0]).toBe('calendar_ytd_per_election_office');
  });
});
