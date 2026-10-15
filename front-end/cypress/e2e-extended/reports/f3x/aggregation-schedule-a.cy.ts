/* eslint-disable @typescript-eslint/no-explicit-any */
import { Initialize } from '../../../e2e-smoke/pages/loginPage';
import { currentYear } from '../../../e2e-smoke/pages/pageUtils';
import { F3X_Q1, F3X_Q2 } from '../../../e2e-smoke/requests/library/reports';
import { buildScheduleA } from '../../../e2e-smoke/requests/library/transactions';
import { DataSetup } from '../../../e2e-smoke/F3X/setup';
import { F3XAggregationHelpers } from './f3x-aggregation.helpers';

describe('Extended F3X Schedule A Aggregation', () => {
  beforeEach(() => {
    Initialize();
  });

  it('A4 insert-between transaction recalculates downstream chain without double-counting', () => {
    cy.wrap(DataSetup({ individual: true })).then((result: any) => {
      F3XAggregationHelpers.seedScheduleAChain(result.report, result.individual, [
        { amount: 100, date: `${currentYear}-04-10` },
        { amount: 150, date: `${currentYear}-04-20` },
      ]).then(([firstId, lastId]) => {
        F3XAggregationHelpers.createTransaction(
          buildScheduleA('INDIVIDUAL_RECEIPT', 75, `${currentYear}-04-15`, result.individual, result.report),
        ).then((middle) => {
          F3XAggregationHelpers.goToReport(result.report);
          F3XAggregationHelpers.assertReceiptAggregate(firstId, '$100.00');
          F3XAggregationHelpers.assertReceiptAggregate(middle.id, '$175.00');
          F3XAggregationHelpers.assertReceiptAggregate(lastId, '$325.00');

          F3XAggregationHelpers.openReceipt(middle.id);
          F3XAggregationHelpers.assertAggregateField('$175.00');
        });
      });
    });
  });

  it('A6/A7 earlier-report create then report deletion reaggregates remaining report', () => {
    const individualSeed = F3XAggregationHelpers.uniqueIndividualSeed();
    let contact: any;
    let q1 = '';
    let q2 = '';
    let q1TxnId = '';
    let q2TxnId = '';

    F3XAggregationHelpers.createContact(individualSeed)
      .then((created) => {
        contact = created;
      })
      .then(() => F3XAggregationHelpers.createReport(F3X_Q1))
      .then((reportId) => {
        q1 = reportId;
        return F3XAggregationHelpers.createReport(F3X_Q2);
      })
      .then((reportId) => {
        q2 = reportId;
      })
      .then(() =>
        F3XAggregationHelpers.createTransaction(
          buildScheduleA('INDIVIDUAL_RECEIPT', 100, `${currentYear}-03-20`, contact, q1),
        ),
      )
      .then((created) => {
        q1TxnId = created.id;
      })
      .then(() =>
        F3XAggregationHelpers.createTransaction(
          buildScheduleA('INDIVIDUAL_RECEIPT', 50, `${currentYear}-04-20`, contact, q2),
        ),
      )
      .then((created) => {
        q2TxnId = created.id;
      })
      .then(() => {
        F3XAggregationHelpers.goToReport(q2);
        F3XAggregationHelpers.assertReceiptAggregate(q2TxnId, '$150.00');
        F3XAggregationHelpers.openReceipt(q2TxnId);
        F3XAggregationHelpers.assertAggregateField('$150.00');
        F3XAggregationHelpers.goToReport(q2);

        F3XAggregationHelpers.deleteReport(q1);
        F3XAggregationHelpers.goToReport(q2);
        F3XAggregationHelpers.assertReceiptAggregate(q2TxnId, '$50.00');
        F3XAggregationHelpers.openReceipt(q2TxnId);
        F3XAggregationHelpers.assertAggregateField('$50.00');
        F3XAggregationHelpers.assertReceiptTransactionAbsent(q1TxnId);
      });
  });

  it('A8 itemize/unitemize and aggregate/unaggregate row actions persist after reload', () => {
    cy.wrap(DataSetup({ individual: true })).then((result: any) => {
      F3XAggregationHelpers.seedScheduleAChain(result.report, result.individual, [
        { amount: 100, date: `${currentYear}-04-12` },
        { amount: 75, date: `${currentYear}-04-20` },
      ]).then(([firstId, secondId]) => {
        F3XAggregationHelpers.goToReport(result.report);

        F3XAggregationHelpers.assertReceiptRowStatus(firstId, 'Unitemized', true);
        F3XAggregationHelpers.itemizeRowById(F3XAggregationHelpers.receiptsTableRoot, firstId);
        F3XAggregationHelpers.assertReceiptRowStatus(firstId, 'Unitemized', false);
        F3XAggregationHelpers.assertStatusPersistsAfterReload(
          result.report,
          F3XAggregationHelpers.receiptsTableRoot,
          firstId,
          'Unitemized',
          false,
        );

        F3XAggregationHelpers.unitemizeRowById(F3XAggregationHelpers.receiptsTableRoot, firstId);
        F3XAggregationHelpers.assertReceiptRowStatus(firstId, 'Unitemized', true);

        F3XAggregationHelpers.assertReceiptAggregate(secondId, '$175.00');
        F3XAggregationHelpers.unaggregateRowById(F3XAggregationHelpers.receiptsTableRoot, secondId);
        F3XAggregationHelpers.assertReceiptRowStatus(secondId, 'Unaggregated', true);
        F3XAggregationHelpers.assertStatusPersistsAfterReload(
          result.report,
          F3XAggregationHelpers.receiptsTableRoot,
          secondId,
          'Unaggregated',
          true,
        );

        F3XAggregationHelpers.aggregateRowById(F3XAggregationHelpers.receiptsTableRoot, secondId);
        F3XAggregationHelpers.assertReceiptRowStatus(secondId, 'Unaggregated', false);
        F3XAggregationHelpers.assertReceiptAggregate(secondId, '$175.00');
      });
    });
  });
});
