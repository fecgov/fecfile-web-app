import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { ContactTypes } from '../contact.model';
import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';
import { ReportTypes } from '../reports/report.model';

describe('PAC_EARMARK_RECEIPT', () => {
  let transaction: SchATransaction;

  beforeEach(() => {
    transaction = getTestTransactionByType(ScheduleATransactionTypes.PAC_EARMARK_RECEIPT) as SchATransaction;
  });

  it('should create an instance', () => {
    expect(transaction.transactionType).toBeTruthy();
    expect(transaction.transactionType?.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    expect(transaction.transaction_type_identifier).toBe(ScheduleATransactionTypes.PAC_EARMARK_RECEIPT);
  });

  it('should include election information for Form 3 only', () => {
    expect(transaction.transactionType?.formFields).toContain('election_code');
    expect(transaction.transactionType?.formFields).toContain('election_other_description');
    expect(transaction.transactionType?.hasElectionInformation(ReportTypes.F3)).toBe(true);
    expect(transaction.transactionType?.hasElectionInformation(ReportTypes.F3X)).toBe(false);
  });

  it('#generatePurposeDescription() should generate empty string', () => {
    const descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe('');
  });

  it('#generatePurposeDescription() should reflect child', () => {
    const childTransaction = getTestTransactionByType(ScheduleATransactionTypes.PAC_EARMARK_MEMO) as SchATransaction;
    childTransaction.entity_type = ContactTypes.INDIVIDUAL;
    childTransaction.contributor_first_name = 'Joe';
    childTransaction.contributor_last_name = 'Smith';
    transaction.children = [childTransaction];

    const descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe('Earmarked through Joe Smith');
  });
});
