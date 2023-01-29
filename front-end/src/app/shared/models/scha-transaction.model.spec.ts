import { MemoText } from './memo-text.model';
import { SchATransaction, ScheduleATransactionTypes } from './scha-transaction.model';

const initTransactionData = {
  id: undefined,
  report_id: undefined,
  contact: undefined,
  contact_id: undefined,
  form_type: undefined,
  filer_committee_id_number: undefined,
  transaction_id: null,
  transaction_type_identifier: 'INDIVIDUAL_RECEIPT',
  contribution_purpose_descrip: undefined,
  parent_transaction_id: undefined,
  children: undefined,
  parent_transaction: undefined,
  fields_to_validate: undefined,
  itemized: false,
  memo_text: MemoText.fromJSON({ text4000: 'Memo!' }),
  memo_text_id: 'ID Goes Here',
};

describe('SchATransaction', () => {
  it('should create an instance', () => {
    expect(new SchATransaction()).toBeTruthy();
  });

  it('#fromJSON() should return a populated SchATransaction instance', () => {
    const data = {
      id: '999',
      transaction_type_identifier: 'INDIVIDUAL_RECEIPT',
      form_type: 'SA11Ai',
      contributor_organization_name: 'foo',
      contribution_date: undefined,
    };
    const schATransaction: SchATransaction = SchATransaction.fromJSON(data);
    expect(schATransaction).toBeInstanceOf(SchATransaction);
    expect(schATransaction.id).toBe('999');
    expect(schATransaction.form_type).toBe('SA11Ai');
    expect(schATransaction.contributor_organization_name).toBe('foo');
    expect(schATransaction.election_code).toBe(undefined);
  });

  it('Updates the purpose description of a child transaction', () => {
    const testTransaction1 = SchATransaction.fromJSON(initTransactionData);
    const testTransaction2 = SchATransaction.fromJSON(initTransactionData);

    testTransaction2.transaction_type_identifier =
      ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO;
    testTransaction2.parent_transaction = testTransaction1;
    testTransaction1.contributor_organization_name = 'Test Committee';
    testTransaction1.children = [testTransaction2];

    const updatedChildren = testTransaction1.updateChildren();
    const child = updatedChildren[0] as SchATransaction;
    expect(child.contribution_purpose_descrip).toContain(testTransaction1.contributor_organization_name);
  });
});
