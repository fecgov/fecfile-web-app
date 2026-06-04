/* eslint-disable @typescript-eslint/no-explicit-any */
import { Initialize } from '../../../e2e-smoke/pages/loginPage';
import { currentYear } from '../../../e2e-smoke/pages/pageUtils';
import { DataSetup } from '../../../e2e-smoke/F3X/setup';
import { buildBusinessLaborRefund } from '../../../e2e-smoke/requests/library/transactions';
import { F3XAggregationHelpers } from './f3x-aggregation.helpers';

describe('Extended F3X Schedule B Aggregation', () => {
  beforeEach(() => {
    Initialize();
  });

  it('B1-B5 same-payee chain recalculates after payee switch, insert, and delete', () => {
    cy.wrap(DataSetup({ organization: true })).then((result: any) => { // NOSONAR - Cypress aggregation scenario intentionally uses nested callbacks
      const newPayeeSeed = F3XAggregationHelpers.uniqueOrganizationSeed();
      F3XAggregationHelpers.createContact(newPayeeSeed).then((newPayee) => { // NOSONAR - Cypress aggregation scenario intentionally uses nested callbacks
        F3XAggregationHelpers.seedScheduleBChain(result.report, result.organization, [
          { amount: 100, date: `${currentYear}-04-10` },
          { amount: 60, date: `${currentYear}-04-15` },
          { amount: 40, date: `${currentYear}-04-20` },
        ]).then(([firstId, secondId, thirdId]) => { // NOSONAR - Cypress aggregation scenario intentionally uses nested callbacks
          F3XAggregationHelpers.getTransaction(firstId).its('aggregate').should('equal', '-100.00');
          F3XAggregationHelpers.getTransaction(secondId).its('aggregate').should('equal', '-160.00');
          F3XAggregationHelpers.getTransaction(thirdId).its('aggregate').should('equal', '-200.00');

          F3XAggregationHelpers.deleteTransactionById(secondId).then(() => { // NOSONAR - Cypress aggregation scenario intentionally uses nested callbacks
            F3XAggregationHelpers.createTransaction(
              buildBusinessLaborRefund(60, `${currentYear}-04-15`, newPayee, result.report),
            ).then((recreatedSecondId) => { // NOSONAR - Cypress aggregation scenario intentionally uses nested callbacks
              F3XAggregationHelpers.getTransaction(recreatedSecondId.id).its('aggregate').should('equal', '-60.00');
              F3XAggregationHelpers.getTransaction(thirdId).its('aggregate').should('equal', '-140.00');

              F3XAggregationHelpers.seedScheduleBChain(result.report, result.organization, [
                { amount: 20, date: `${currentYear}-04-12` },
              ]).then(([insertedId]) => { // NOSONAR - Cypress aggregation scenario intentionally uses nested callbacks
                F3XAggregationHelpers.getTransaction(insertedId).its('aggregate').should('equal', '-120.00');
                F3XAggregationHelpers.getTransaction(thirdId).its('aggregate').should('equal', '-160.00');

                F3XAggregationHelpers.goToReport(result.report);
                F3XAggregationHelpers.deleteRowById(F3XAggregationHelpers.disbursementsTableRoot, insertedId);
                F3XAggregationHelpers.getTransaction(thirdId).its('aggregate').should('equal', '-140.00');
              });
            });
          });
        });
      });
    });
  });

  it('B6 itemize and unitemize row actions persist for schedule B transaction', () => {
    cy.wrap(DataSetup({ organization: true })).then((result: any) => {
      F3XAggregationHelpers.seedScheduleBChain(result.report, result.organization, [
        { amount: 120, date: `${currentYear}-04-10` },
      ]).then(([txnId]) => {
        F3XAggregationHelpers.goToReport(result.report);
        F3XAggregationHelpers.rowById(F3XAggregationHelpers.disbursementsTableRoot, txnId)
          .find('td')
          .eq(1)
          .invoke('text')
          .then((statusText) => {
            const startsUnitemized = statusText.includes('Unitemized');
            const firstAction = startsUnitemized ? 'itemize' : 'unitemize';
            const secondAction = startsUnitemized ? 'unitemize' : 'itemize';

            if (firstAction === 'itemize') {
              F3XAggregationHelpers.itemizeRowById(F3XAggregationHelpers.disbursementsTableRoot, txnId);
            } else {
              F3XAggregationHelpers.unitemizeRowById(F3XAggregationHelpers.disbursementsTableRoot, txnId);
            }
            F3XAggregationHelpers.assertDisbursementRowStatus(txnId, 'Unitemized', !startsUnitemized);
            F3XAggregationHelpers.assertStatusPersistsAfterReload(
              result.report,
              F3XAggregationHelpers.disbursementsTableRoot,
              txnId,
              'Unitemized',
              !startsUnitemized,
            );

            if (secondAction === 'itemize') {
              F3XAggregationHelpers.itemizeRowById(F3XAggregationHelpers.disbursementsTableRoot, txnId);
            } else {
              F3XAggregationHelpers.unitemizeRowById(F3XAggregationHelpers.disbursementsTableRoot, txnId);
            }
            F3XAggregationHelpers.assertDisbursementRowStatus(txnId, 'Unitemized', startsUnitemized);
            F3XAggregationHelpers.assertStatusPersistsAfterReload(
              result.report,
              F3XAggregationHelpers.disbursementsTableRoot,
              txnId,
              'Unitemized',
              startsUnitemized,
            );
          });
      });
    });
  });
});
