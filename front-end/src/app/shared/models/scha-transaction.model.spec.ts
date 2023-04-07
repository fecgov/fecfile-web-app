import { getTestTransactionByType } from '../utils/unit-test.utils';
import { SchATransaction, ScheduleATransactionTypes } from './scha-transaction.model';

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
    const parentTransaction = getTestTransactionByType(
      ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_CONVENTION_ACCOUNT
    ) as SchATransaction;
    const childTransaction = getTestTransactionByType(
      ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO
    ) as SchATransaction;
    parentTransaction.children = [childTransaction];
    parentTransaction.contributor_organization_name = 'Test Committee';
    parentTransaction.updateChildren();
    expect(childTransaction.contribution_purpose_descrip).toContain('Test Committee');
  });

  it('Creates a transaction object from JSON', () => {
    const json = {
      transaction_type_identifier: 'EARMARK_RECEIPT',
      parent_transaction: {
        transaction_type_identifier: 'EARMARK_RECEIPT',
      },
      children: [
        {
          transaction_type_identifier: 'EARMARK_MEMO',
        },
      ],
    };
    const transaction: SchATransaction = SchATransaction.fromJSON(json);
    expect(transaction.constructor.name).toBe('SchATransaction');
  });
});
