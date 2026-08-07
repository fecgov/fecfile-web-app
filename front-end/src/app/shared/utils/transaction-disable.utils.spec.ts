import { ReportTypes } from '../models/reports/report-types.model';
import { ScheduleATransactionTypes } from '../models/transaction/schedule-a/schedule-a-transaction-types.model';
import { isTransactionTypeDisabledForReport, DISABLED_TRANSACTION_TYPES } from './transaction-disable.utils';

describe('transaction disable utils', () => {
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
