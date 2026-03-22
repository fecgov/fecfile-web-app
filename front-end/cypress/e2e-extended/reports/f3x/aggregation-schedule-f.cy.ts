/* eslint-disable @typescript-eslint/no-explicit-any */
import { Initialize, setCommitteeToPTY } from '../../../e2e-smoke/pages/loginPage';
import { currentYear, PageUtils } from '../../../e2e-smoke/pages/pageUtils';
import { DataSetup } from '../../../e2e-smoke/F3X/setup';
import { F3XAggregationHelpers } from './f3x-aggregation.helpers';

describe('Extended F3X Schedule F Aggregation', () => {
  beforeEach(() => {
    Initialize();
    setCommitteeToPTY();
  });

  it('F1-F5 delete middle transaction reaggregates downstream aggregate_general_elec_expended', () => {
    cy.wrap(DataSetup({ individual: true, candidate: true, committee: true })).then((result: any) => {
      F3XAggregationHelpers.seedScheduleFChain(result.report, result.individual, result.candidate, result.committee, [
        { amount: 100, date: `${currentYear}-04-10` },
        { amount: 50, date: `${currentYear}-04-15` },
        { amount: 25, date: `${currentYear}-04-20` },
      ]).then(([, middleId, finalId]) => {
        F3XAggregationHelpers.goToReport(result.report);
        F3XAggregationHelpers.assertScheduleFAggregateFieldOnOpen(finalId, '$175.00');
        F3XAggregationHelpers.clickSave();

        F3XAggregationHelpers.deleteRowById(F3XAggregationHelpers.disbursementsTableRoot, middleId);
        F3XAggregationHelpers.assertScheduleFAggregateFieldOnOpen(finalId, '$125.00');
      });
    });
  });

  it('F3 year partition switch recalculates old and new schedule F chains', () => {
    cy.wrap(DataSetup({ individual: true, candidate: true, committee: true })).then((result: any) => {
      F3XAggregationHelpers.seedScheduleFChain(result.report, result.individual, result.candidate, result.committee, [
        { amount: 100, date: `${currentYear}-04-10`, extra: { general_election_year: '2024' } },
        { amount: 60, date: `${currentYear}-04-20`, extra: { general_election_year: '2024' } },
        { amount: 40, date: `${currentYear}-04-25`, extra: { general_election_year: '2026' } },
      ]).then(([firstId, secondId, thirdId]) => {
        F3XAggregationHelpers.goToReport(result.report);
        F3XAggregationHelpers.assertScheduleFAggregateFieldOnOpen(secondId, '$160.00');
        F3XAggregationHelpers.clickSave();
        F3XAggregationHelpers.assertScheduleFAggregateFieldOnOpen(thirdId, '$40.00');
        F3XAggregationHelpers.clickSave();

        F3XAggregationHelpers.openDisbursement(secondId);
        F3XAggregationHelpers.clearAndType('#general_election_year', '2026');
        cy.blurActiveField();
        F3XAggregationHelpers.assertScheduleFAggregateField('$60.00');
        F3XAggregationHelpers.clickSave();

        F3XAggregationHelpers.assertScheduleFAggregateFieldOnOpen(firstId, '$100.00');
        F3XAggregationHelpers.clickSave();
        F3XAggregationHelpers.assertScheduleFAggregateFieldOnOpen(thirdId, '$100.00');
      });
    });
  });
});
