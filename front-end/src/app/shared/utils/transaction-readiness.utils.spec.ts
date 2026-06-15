import { ReportTypes } from 'app/shared/models/reports/report.model';
import { ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { isTransactionTypeDisabledForReport, DISABLED_TRANSACTION_TYPES } from './transaction-readiness.utils';

describe('transaction readiness utils', () => {
  beforeEach(() => {
    vi.spyOn(DISABLED_TRANSACTION_TYPES[ReportTypes.F3]!, 'has').mockImplementation(
      (type) => type === ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('disables transactions present in the disabled list', () => {
    expect(isTransactionTypeDisabledForReport(ReportTypes.F3, ScheduleATransactionTypes.INDIVIDUAL_RECEIPT)).toBe(true);
  });

  it('does not disable transactions missing from the disabled list', () => {
    expect(isTransactionTypeDisabledForReport(ReportTypes.F3, ScheduleATransactionTypes.PARTY_RECEIPT)).toBe(false);
  });

  it('does not disable transactions for report types missing from the disabled list', () => {
    expect(isTransactionTypeDisabledForReport(ReportTypes.F3X, ScheduleATransactionTypes.INDIVIDUAL_RECEIPT)).toBe(
      false,
    );
  });
});
