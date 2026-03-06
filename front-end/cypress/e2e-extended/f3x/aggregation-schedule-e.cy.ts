/* eslint-disable @typescript-eslint/no-explicit-any */
import { Initialize } from '../../e2e-smoke/pages/loginPage';
import { currentYear, PageUtils } from '../../e2e-smoke/pages/pageUtils';
import { DataSetup } from '../../e2e-smoke/F3X/setup';
import { ContactLookup } from '../../e2e-smoke/pages/contactLookup';
import { F3XAggregationHelpers } from './f3x-aggregation.helpers';

describe('Extended F3X Schedule E Aggregation', () => {
  beforeEach(() => {
    Initialize();
  });

  it('E1-E4 candidate context switch reaggregates old and new partitions', () => {
    cy.wrap(DataSetup({ individual: true, candidate: true, candidateSenate: true })).then((result: any) => {
      F3XAggregationHelpers.createIndependentExpenditureSeries([
        {
          reportId: result.report,
          payeeContactName: result.individual.last_name,
          candidate: result.candidate,
          amount: 100,
          disbursementDate: new Date(currentYear, 4 - 1, 5),
        },
        {
          reportId: result.report,
          payeeContactName: result.individual.last_name,
          candidate: result.candidate,
          amount: 50,
          disbursementDate: new Date(currentYear, 4 - 1, 20),
        },
      ]).then(([firstId, secondId]) => {
        F3XAggregationHelpers.goToReport(result.report);
        F3XAggregationHelpers.assertCalendarYtdFieldOnOpen(secondId, '$150.00');
        F3XAggregationHelpers.clickSave();

        F3XAggregationHelpers.openDisbursement(secondId);
        ContactLookup.getCandidate(result.candidateSenate, [], [], '#contact_2_lookup');
        PageUtils.blurActiveField();
        F3XAggregationHelpers.assertCalendarYtdField('$50.00');
        F3XAggregationHelpers.clickSave();

        F3XAggregationHelpers.assertCalendarYtdFieldOnOpen(firstId, '$100.00');
        F3XAggregationHelpers.clickSave();
        F3XAggregationHelpers.assertCalendarYtdFieldOnOpen(secondId, '$50.00');
      });
    });
  });

  it('E3-E5 election code switch and delete retain correct calendar_ytd partition totals', () => {
    cy.wrap(DataSetup({ individual: true, candidate: true })).then((result: any) => {
      F3XAggregationHelpers.createIndependentExpenditureSeries([
        {
          reportId: result.report,
          payeeContactName: result.individual.last_name,
          candidate: result.candidate,
          amount: 80,
          disbursementDate: new Date(currentYear, 4 - 1, 8),
          electionCode: `P${currentYear}`,
        },
        {
          reportId: result.report,
          payeeContactName: result.individual.last_name,
          candidate: result.candidate,
          amount: 40,
          disbursementDate: new Date(currentYear, 4 - 1, 22),
          electionCode: `P${currentYear}`,
        },
      ]).then(([firstId, secondId]) => {
        F3XAggregationHelpers.goToReport(result.report);
        F3XAggregationHelpers.assertCalendarYtdFieldOnOpen(secondId, '$120.00');
        F3XAggregationHelpers.clickSave();

        F3XAggregationHelpers.openDisbursement(secondId);
        PageUtils.selectDropdownSetValue('[inputid="electionType"]', 'G');
        F3XAggregationHelpers.clearAndType('#electionYear', `${currentYear}`);
        PageUtils.blurActiveField();
        F3XAggregationHelpers.assertCalendarYtdField('$40.00');
        F3XAggregationHelpers.clickSave();

        F3XAggregationHelpers.assertCalendarYtdFieldOnOpen(firstId, '$80.00');
        F3XAggregationHelpers.clickSave();

        F3XAggregationHelpers.deleteRowById(F3XAggregationHelpers.disbursementsTableRoot, firstId);
        F3XAggregationHelpers.assertCalendarYtdFieldOnOpen(secondId, '$40.00');
      });
    });
  });
});
