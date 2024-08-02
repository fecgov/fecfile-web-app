import { SchATransaction } from './scha-transaction.model';

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

  it('Creates a REATTRIBUTED transaction object from JSON', () => {
    const json = {
      transaction_type_identifier: 'INDIVIDUAL_RECEIPT',
      reattribution_redesignation_tag: 'REATTRIBUTED',
      reatt_redes: {
        transaction_type_identifier: 'INDIVIDUAL_RECEIPT',
      },
      report: {
        report_type: 'F3X',
        report_code: 'Q1',
        reportCode: 'Q1',
      },
    };
    const transaction: SchATransaction = SchATransaction.fromJSON(json);
    expect(transaction.constructor.name).toBe('SchATransaction');
  });

  it('Creates a REATTRIBUTION_TO transaction object from JSON', () => {
    const json = {
      transaction_type_identifier: 'INDIVIDUAL_RECEIPT',
      reattribution_redesignation_tag: 'REATTRIBUTION_TO',
    };
    const transaction: SchATransaction = SchATransaction.fromJSON(json);
    expect(transaction.constructor.name).toBe('SchATransaction');
  });

  it('Creates a REATTRIBUTION_FROM transaction object from JSON', () => {
    const json = {
      transaction_type_identifier: 'INDIVIDUAL_RECEIPT',
      reattribution_redesignation_tag: 'REATTRIBUTION_FROM',
      reatt_redes: {
        transaction_type_identifier: 'INDIVIDUAL_RECEIPT',
        entity_type: 'INDIVIDUAL',
      },
    };
    const transaction: SchATransaction = SchATransaction.fromJSON(json);
    expect(transaction.constructor.name).toBe('SchATransaction');
  });
});
