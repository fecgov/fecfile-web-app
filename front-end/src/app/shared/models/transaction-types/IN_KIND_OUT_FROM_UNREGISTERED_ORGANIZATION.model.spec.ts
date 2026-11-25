import { ReportTypes } from '../reports/report.model';
import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { IN_KIND_OUT_FROM_UNREGISTERED_ORGANIZATION } from './IN_KIND_OUT_FROM_UNREGISTERED_ORGANIZATION.model';

describe('IN_KIND_OUT_FROM_UNREGISTERED_ORGANIZATION', () => {
  const transactionType = new IN_KIND_OUT_FROM_UNREGISTERED_ORGANIZATION();

  it('creates an organization child transaction with inherited election fields', () => {
    const transaction: SchBTransaction = transactionType.getNewTransaction();
    expect(transaction.transaction_type_identifier).toBe(
      ScheduleBTransactionTypes.IN_KIND_OUT_FROM_UNREGISTERED_ORGANIZATION,
    );
    expect(transactionType.contactTypeOptions).toEqual(['ORG']);
    expect(transactionType.inheritedFields).toContain('election_code');
    expect(transactionType.inheritedFields).toContain('election_other_description');
    expect(transactionType.hasElectionInformation(ReportTypes.F3)).toBe(true);
    expect(transactionType.hasElectionInformation(ReportTypes.F3X)).toBe(false);
  });
});
