import { ReportTypes } from '../reports/report.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { ScheduleBTransactionTypes } from '../schb-transaction.model';
import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';

describe('IN_KIND_RECEIPT_FROM_UNREGISTERED_ORGANIZATION', () => {
  let transaction: SchATransaction;

  beforeEach(() => {
    transaction = getTestTransactionByType(
      ScheduleATransactionTypes.IN_KIND_RECEIPT_FROM_UNREGISTERED_ORGANIZATION,
    ) as SchATransaction;
  });

  it('creates a non-reattributable organization receipt with election information on Form 3', () => {
    expect(transaction.transactionType?.contactTypeOptions).toEqual(['ORG']);
    expect(transaction.transactionType?.isReattributable).toBe(false);
    expect(transaction.transactionType?.hasElectionInformation(ReportTypes.F3)).toBe(true);
    expect(transaction.transactionType?.hasElectionInformation(ReportTypes.F3X)).toBe(false);
    expect(transaction.transactionType?.dependentChildTransactionTypes).toContain(
      ScheduleBTransactionTypes.IN_KIND_OUT_FROM_UNREGISTERED_ORGANIZATION,
    );
  });
});
