/* eslint-disable @typescript-eslint/no-explicit-any */
import { Initialize } from '../../e2e-smoke/pages/loginPage';
import { ContactListPage } from '../../e2e-smoke/pages/contactListPage';
import { ReportListPage } from '../../e2e-smoke/pages/reportListPage';
import { currentYear } from '../../e2e-smoke/pages/pageUtils';
import { F3X_Q1, F3X_Q2 } from '../../e2e-smoke/requests/library/reports';
import { F3XAggregationHelpers } from './f3x-aggregation.helpers';

describe('Extended F3X Cross-Committee Aggregation Isolation', () => {
  beforeEach(() => {
    Initialize();
  });

  it('schedule E aggregation remains committee-scoped across committee switches', () => {
    let primaryReportId = '';
    let primaryTxnId = '';
    let secondaryReportId = '';
    let secondaryTxnId = '';

    const primaryPayeeSeed = F3XAggregationHelpers.uniqueIndividualSeed();
    const primaryCandidateSeed = F3XAggregationHelpers.uniqueHouseCandidateSeed();
    const secondaryPayeeSeed = F3XAggregationHelpers.uniqueIndividualSeed();
    const secondaryCandidateSeed = F3XAggregationHelpers.uniqueHouseCandidateSeed();

    let primaryPayee: any;
    let primaryCandidate: any;
    let secondaryPayee: any;
    let secondaryCandidate: any;

    F3XAggregationHelpers.switchCommittee(F3XAggregationHelpers.committeePrimaryId);
    ReportListPage.deleteAllReports();
    ContactListPage.deleteAllContacts();

    F3XAggregationHelpers.createContact(primaryPayeeSeed)
      .then((created) => {
        primaryPayee = created;
      })
      .then(() => F3XAggregationHelpers.createContact(primaryCandidateSeed))
      .then((created) => {
        primaryCandidate = created;
      })
      .then(() => F3XAggregationHelpers.createReport(F3X_Q1))
      .then((reportId) => {
        primaryReportId = reportId;
      })
      .then(() =>
        F3XAggregationHelpers.createIndependentExpenditureViaUI({
          reportId: primaryReportId,
          payeeContactName: primaryPayee.last_name,
          candidate: primaryCandidate,
          amount: 100,
          disbursementDate: new Date(currentYear, 2 - 1, 10),
        }),
      )
      .then((txnId) => {
        primaryTxnId = txnId;
      })
      .then(() => {
        F3XAggregationHelpers.goToReport(primaryReportId);
        F3XAggregationHelpers.assertScheduleEAggregateFieldOnOpen(primaryTxnId, '$100.00');
        F3XAggregationHelpers.clickSave();
      })
      .then(() => {
        F3XAggregationHelpers.switchCommittee(F3XAggregationHelpers.committeeSecondaryId);
      })
      .then(() => F3XAggregationHelpers.createContact(secondaryPayeeSeed))
      .then((created) => {
        secondaryPayee = created;
      })
      .then(() => F3XAggregationHelpers.createContact(secondaryCandidateSeed))
      .then((created) => {
        secondaryCandidate = created;
      })
      .then(() => F3XAggregationHelpers.createReport(F3X_Q2))
      .then((reportId) => {
        secondaryReportId = reportId;
      })
      .then(() =>
        F3XAggregationHelpers.createIndependentExpenditureViaUI({
          reportId: secondaryReportId,
          payeeContactName: secondaryPayee.last_name,
          candidate: secondaryCandidate,
          amount: 50,
          disbursementDate: new Date(currentYear, 4 - 1, 12),
        }),
      )
      .then((txnId) => {
        secondaryTxnId = txnId;
      })
      .then(() => {
        F3XAggregationHelpers.goToReport(secondaryReportId);
        F3XAggregationHelpers.assertScheduleEAggregateFieldOnOpen(secondaryTxnId, '$50.00');
        F3XAggregationHelpers.clickSave();
      })
      .then(() => {
        F3XAggregationHelpers.switchCommittee(F3XAggregationHelpers.committeePrimaryId);
        F3XAggregationHelpers.goToReport(primaryReportId);
        F3XAggregationHelpers.assertScheduleEAggregateFieldOnOpen(primaryTxnId, '$100.00');
      });
  });
});
