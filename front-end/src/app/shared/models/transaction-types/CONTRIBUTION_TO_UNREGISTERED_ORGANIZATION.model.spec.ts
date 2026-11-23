import { ReportTypes } from '../reports/report.model';
import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { CONTRIBUTION_TO_UNREGISTERED_ORGANIZATION } from './CONTRIBUTION_TO_UNREGISTERED_ORGANIZATION.model';

describe('CONTRIBUTION_TO_UNREGISTERED_ORGANIZATION', () => {
  let transactionType: CONTRIBUTION_TO_UNREGISTERED_ORGANIZATION;

  beforeEach(() => {
    transactionType = new CONTRIBUTION_TO_UNREGISTERED_ORGANIZATION();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType?.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.CONTRIBUTION_TO_UNREGISTERED_ORGANIZATION);
  });

  it('should include election information', () => {
    expect(transactionType?.formFields).toContain('election_code');
    expect(transactionType?.formFields).toContain('election_other_description');
    expect(transactionType?.hasElectionInformation(ReportTypes.F3)).toBe(true);
  });

  it('#generatePurposeDescription() should be undefined', () => {
    const descrip = transactionType.generatePurposeDescription;
    expect(descrip).toBe(undefined);
  });
});
