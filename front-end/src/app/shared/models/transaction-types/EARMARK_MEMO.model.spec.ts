import { EARMARK_MEMO } from './EARMARK_MEMO.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { ReportTypes } from '../reports/report.model';

describe('EARMARK_MEMO', () => {
  let transactionType: EARMARK_MEMO;

  beforeEach(() => {
    transactionType = new EARMARK_MEMO();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.EARMARK_MEMO);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Total earmarked through conduit.');
  });

  it('should include election information for Form 3 only', () => {
    expect(transactionType.formFields).toContain('election_code');
    expect(transactionType.formFields).toContain('election_other_description');
    expect(transactionType.hasElectionInformation(ReportTypes.F3)).toBe(true);
    expect(transactionType.hasElectionInformation(ReportTypes.F3X)).toBe(false);
  });
});
