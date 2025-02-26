import { SchFTransaction } from './schf-transaction.model';

describe('SchFTransaction', () => {
  it('should create an instance', () => {
    expect(new SchFTransaction()).toBeTruthy();
  });

  it('#fromJSON() should return a populated SchFTransaction instance', () => {
    const data = {
      id: '999',
      transaction_type_identifier: 'INDIVIDUAL_RECEIPT',
      form_type: 'SA11Ai',
      contributor_organization_name: 'foo',
      contribution_date: undefined,
    };
    const schFTransaction: SchFTransaction = SchFTransaction.fromJSON(data);
    expect(schFTransaction).toBeInstanceOf(SchFTransaction);
    expect(schFTransaction.id).toBe('999');
    expect(schFTransaction.form_type).toBe('SA11Ai');
    expect(schFTransaction.contributor_organization_name).toBe('foo');
    expect(schFTransaction.election_code).toBe(undefined);
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
    const transaction: SchFTransaction = SchFTransaction.fromJSON(json);
    expect(transaction.constructor.name).toBe('SchFTransaction');
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
    const transaction: SchFTransaction = SchFTransaction.fromJSON(json);
    expect(transaction.constructor.name).toBe('SchFTransaction');
  });

  it('Creates a REATTRIBUTION_TO transaction object from JSON', () => {
    const json = {
      transaction_type_identifier: 'INDIVIDUAL_RECEIPT',
      reattribution_redesignation_tag: 'REATTRIBUTION_TO',
    };
    const transaction: SchFTransaction = SchFTransaction.fromJSON(json);
    expect(transaction.constructor.name).toBe('SchFTransaction');
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
    const transaction: SchFTransaction = SchFTransaction.fromJSON(json);
    expect(transaction.constructor.name).toBe('SchFTransaction');
  });
});
