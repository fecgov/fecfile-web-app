/* eslint-disable @typescript-eslint/no-explicit-any */
import { Initialize } from '../../e2e-smoke/pages/loginPage';
import { currentYear, PageUtils } from '../../e2e-smoke/pages/pageUtils';
import { DataSetup } from '../../e2e-smoke/F3X/setup';
import { StartTransaction } from '../../e2e-smoke/F3X/utils/start-transaction/start-transaction';
import { ContactLookup } from '../../e2e-smoke/pages/contactLookup';
import { TransactionDetailPage } from '../../e2e-smoke/pages/transactionDetailPage';
import { formTransactionDataForSchedule } from '../../e2e-smoke/models/TransactionFormModel';
import { ReportListPage } from '../../e2e-smoke/pages/reportListPage';
import { F3XAggregationHelpers } from './f3x-aggregation.helpers';
import { TransactionTableColumns } from '../../e2e-smoke/pages/f3xTransactionListPage';
import { buildScheduleA } from '../../e2e-smoke/requests/library/transactions';

function transactionIdFromRowHref(href: string | undefined, context: string): string {
  const match = href?.match(/\/list\/([0-9a-f-]+)/i);
  const transactionId = match?.[1] ?? '';
  if (!transactionId) {
    throw new Error(`${context} transaction id is missing`);
  }
  return transactionId;
}

function receiptTransactionIdByRow(rowIndex: number): Cypress.Chainable<string> {
  return cy
    .get(`${F3XAggregationHelpers.receiptsTableRoot} tbody tr`)
    .eq(rowIndex)
    .find('a[href*="/list/"]')
    .first()
    .invoke('attr', 'href')
    .then((href) => transactionIdFromRowHref(href, `receipt row ${rowIndex}`));
}

describe('Extended F3X Itemization Cascades', () => {
  beforeEach(() => {
    Initialize();
  });

  it('parent/child receipt row-action unitemize updates parent while memo child remains itemized', () => {
    cy.wrap(DataSetup({ individual: true })).then((result: any) => {
      F3XAggregationHelpers.createTransaction(
        buildScheduleA('INDIVIDUAL_RECEIPT', 250, `${currentYear}-04-27`, result.individual, result.report),
      ).then((parent) => {
        F3XAggregationHelpers.createTransaction(
          buildScheduleA('INDIVIDUAL_RECEIPT', 250, `${currentYear}-04-28`, result.individual, result.report, {
            parent_transaction_id: parent.id,
            memo_code: true,
          }),
        ).then((child) => {
          F3XAggregationHelpers.goToReport(result.report);
          F3XAggregationHelpers.assertRowExists(F3XAggregationHelpers.receiptsTableRoot, parent.id);
          F3XAggregationHelpers.assertRowExists(F3XAggregationHelpers.receiptsTableRoot, child.id);
          F3XAggregationHelpers.getTransaction(parent.id).its('itemized').should('equal', true);
          F3XAggregationHelpers.getTransaction(child.id).its('itemized').should('equal', true);

          F3XAggregationHelpers.unitemizeRowById(F3XAggregationHelpers.receiptsTableRoot, parent.id);

          F3XAggregationHelpers.getTransaction(parent.id).its('itemized').should('equal', false);
          F3XAggregationHelpers.getTransaction(child.id).its('itemized').should('equal', true);
          F3XAggregationHelpers.assertReceiptRowStatus(parent.id, 'Unitemized', true);
          F3XAggregationHelpers.assertReceiptRowStatus(child.id, 'Unitemized', false);
        });
      });
    });
  });

  it('tier-3 joint fundraising row-action unitemize is rejected and preserves itemization state', () => {
    cy.wrap(DataSetup({ committee: true, organization: true, individual: true })).then((result: any) => {
      ReportListPage.goToReportList(result.report);
      StartTransaction.Receipts().Transfers().JointFundraising();
      ContactLookup.getCommittee(result.committee);

      const tier1TransactionData = {
        ...formTransactionDataForSchedule,
        purpose_description: '',
        category_code: '',
        date_received: new Date(currentYear, 4 - 1, 27),
      };

      TransactionDetailPage.enterScheduleFormData(
        tier1TransactionData,
        false,
        '',
        true,
        'contribution_date',
      );

      const alias = PageUtils.getAlias('');
      cy.get(alias).find('[data-cy="navigation-control-dropdown"]').first().click();
      cy.get(alias).find('[data-cy="navigation-control-dropdown-option"]').contains('Partnership Receipt').click();
      cy.contains('h1', 'Partnership Receipt Joint Fundraising Transfer Memo').should('exist');
      ContactLookup.getContact(result.organization.name);
      const tier2TransactionData = {
        ...formTransactionDataForSchedule,
        purpose_description: '',
        category_code: '',
        date_received: new Date(currentYear, 4 - 1, 27),
      };
      TransactionDetailPage.enterScheduleFormData(
        tier2TransactionData,
        false,
        '',
        true,
        'contribution_date',
      );

      cy.get(alias).find('[data-cy="navigation-control-dropdown"]').first().click();
      cy.get(alias).find('[data-cy="navigation-control-dropdown-option"]').contains('Individual').click();
      cy.contains('h1', 'Individual Joint Fundraising Transfer Memo').should('exist');
      ContactLookup.getContact(result.individual.last_name);
      const tier3TransactionData = {
        ...formTransactionDataForSchedule,
        purpose_description: '',
        category_code: '',
        date_received: new Date(currentYear, 4 - 1, 27),
      };
      TransactionDetailPage.enterScheduleFormData(
        tier3TransactionData,
        false,
        '',
        true,
        'contribution_date',
      );

      cy.contains('button[data-cy="navigation-control-button"]', /^\s*Save\s*$/).click();
      cy.contains('Transactions in this report').should('exist');

      cy.get(`${F3XAggregationHelpers.receiptsTableRoot} tbody tr`).eq(0).as('jfParentRow');
      cy.get('@jfParentRow')
        .find('td')
        .eq(TransactionTableColumns.transaction_type)
        .should('contain', 'Joint Fundraising Transfer');
      cy.get(`${F3XAggregationHelpers.receiptsTableRoot} tbody tr`).eq(1).as('jfChildRowOne');
      cy.get('@jfChildRowOne')
        .find('td')
        .eq(TransactionTableColumns.transaction_type)
        .should('contain', 'Partnership Receipt Joint Fundraising Transfer Memo');
      cy.get(`${F3XAggregationHelpers.receiptsTableRoot} tbody tr`).eq(2).as('jfChildRowTwo');
      cy.get('@jfChildRowTwo')
        .find('td')
        .eq(TransactionTableColumns.transaction_type)
        .should('contain', 'Individual Joint Fundraising Transfer Memo');

      receiptTransactionIdByRow(0).then((parentId) => {
        receiptTransactionIdByRow(1).then((childOneId) => {
          receiptTransactionIdByRow(2).then((childTwoId) => {
            F3XAggregationHelpers.interceptUpdateItemizationAggregation('Tier3Unitemize');
            F3XAggregationHelpers.clickRowActionById(F3XAggregationHelpers.receiptsTableRoot, parentId, 'Unitemize');
            F3XAggregationHelpers.confirmDialog();
            cy.wait('@Tier3Unitemize').then((interception) => {
              expect(interception.request.url).to.contain(`/transactions/${parentId}/update-itemization-aggregation/`);
              expect(interception.response?.statusCode).to.equal(400);
            });

            F3XAggregationHelpers.getTransaction(parentId).its('itemized').should('equal', true);
            F3XAggregationHelpers.getTransaction(childOneId).its('itemized').should('equal', true);
            F3XAggregationHelpers.getTransaction(childTwoId).its('itemized').should('equal', true);
            F3XAggregationHelpers.assertReceiptRowStatus(parentId, 'Unitemized', false);
            F3XAggregationHelpers.assertReceiptRowStatus(childOneId, 'Unitemized', false);
            F3XAggregationHelpers.assertReceiptRowStatus(childTwoId, 'Unitemized', false);
          });
        });
      });
    });
  });
});
