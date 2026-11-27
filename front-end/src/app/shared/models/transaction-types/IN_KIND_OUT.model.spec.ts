import { IN_KIND_OUT } from './IN_KIND_OUT.model';
import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { ReportTypes } from '../reports/report.model';

describe('IN_KIND_OUT', () => {
  let transactionType: IN_KIND_OUT;

  beforeEach(() => {
    transactionType = new IN_KIND_OUT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchATransaction', () => {
    const transaction: SchBTransaction = transactionType.getNewTransaction();
    expect(transaction.transaction_type_identifier).toBe(ScheduleBTransactionTypes.IN_KIND_OUT);
  });

  it('should inherit election information from the receipt', () => {
    expect(transactionType.formFields).toContain('election_code');
    expect(transactionType.formFields).toContain('election_other_description');
    expect(transactionType.inheritedFields).toContain('election_code');
    expect(transactionType.inheritedFields).toContain('election_other_description');
  });

  it('#generatePurposeDescription() should generate a string', () => {
    expect(transactionType?.generatePurposeDescription).toBeUndefined();
  });

  it('#hasElectionInformation() should return true for Form 3 and false for Form 3X', () => {
    expect(transactionType.hasElectionInformation(ReportTypes.F3)).toBe(true);
    expect(transactionType.hasElectionInformation(ReportTypes.F3X)).toBe(false);
  });
});
