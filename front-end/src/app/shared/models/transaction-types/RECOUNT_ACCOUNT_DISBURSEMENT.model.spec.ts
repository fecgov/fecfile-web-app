import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { RECOUNT_ACCOUNT_DISBURSEMENT } from './RECOUNT_ACCOUNT_DISBURSEMENT.model';
import { ReportTypes } from '../reports/report.model';

describe('RECOUNT_ACCOUNT_DISBURSEMENT', () => {
  let transactionType: RECOUNT_ACCOUNT_DISBURSEMENT;

  beforeEach(() => {
    transactionType = new RECOUNT_ACCOUNT_DISBURSEMENT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.RECOUNT_ACCOUNT_DISBURSEMENT);
  });

  it('#generatePurposeDescription() should be undefined', () => {
    const descrip = transactionType.generatePurposeDescription;
    expect(descrip).toBe(undefined);
  });

  it('#hasElectionInformation() should return true for F3 report type', () => {
    const result = transactionType.hasElectionInformation(ReportTypes.F3);
    expect(result).toBe(true);
  });

  it('#hasElectionInformation() should return false for F3X', () => {
    const result = transactionType.hasElectionInformation(ReportTypes.F3X);
    expect(result).toBe(false);
  });
});
