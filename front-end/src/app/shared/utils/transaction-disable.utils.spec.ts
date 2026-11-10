import { ReportTypes } from 'app/shared/models/reports/report.model';
import { ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { isTransactionTypeDisabledForReport } from './transaction-disable.utils';

describe('transaction disable utils', () => {
  it('disables transactions present in the disabled list', () => {
    expect(isTransactionTypeDisabledForReport(ReportTypes.F3, ScheduleATransactionTypes.IN_KIND_RECEIPT)).toBe(true);
  });

  it('does not disable transactions missing from the disabled list', () => {
    expect(isTransactionTypeDisabledForReport(ReportTypes.F3, ScheduleATransactionTypes.PARTY_RECEIPT)).toBe(false);
  });

  it('does not disable returned or bounced individual receipts for Form 3', () => {
    expect(
      isTransactionTypeDisabledForReport(ReportTypes.F3, ScheduleATransactionTypes.RETURNED_BOUNCED_RECEIPT_INDIVIDUAL),
    ).toBe(false);
  });

  it('does not disable candidate contributions for Form 3', () => {
    expect(
      isTransactionTypeDisabledForReport(ReportTypes.F3, ScheduleATransactionTypes.CONTRIBUTION_FROM_CANDIDATE),
    ).toBe(false);
  });

  it('does not disable PAC earmark receipts for Form 3', () => {
    expect(
      isTransactionTypeDisabledForReport(ReportTypes.F3, ScheduleATransactionTypes.PAC_EARMARK_RECEIPT),
    ).toBe(false);
  });

  it('does not disable transactions for report types missing from the disabled list', () => {
    expect(isTransactionTypeDisabledForReport(ReportTypes.F3X, ScheduleATransactionTypes.INDIVIDUAL_RECEIPT)).toBe(
      false,
    );
  });
});
