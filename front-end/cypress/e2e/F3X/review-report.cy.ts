import { defaultFormData as defaultContactFormData } from '../models/ContactFormModel';
import { defaultScheduleFormData } from '../models/TransactionFormModel';
import { Initialize } from '../pages/loginPage';
import { PageUtils, currentYear } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { F3XSetup } from './f3x-setup';
import { ReviewReport } from './utils/review-report';
import { StartTransaction } from './utils/start-transaction/start-transaction';

const scheduleData = {
  ...defaultScheduleFormData,
  ...{
    electionYear: undefined,
    electionType: undefined,
    date_received: new Date(currentYear, 4 - 1, 27),
  },
};

describe('Receipt Transactions', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should calculate summary values on first visit', () => {
    // Create report and check summary calc runs
    F3XSetup();
    ReviewReport.Summary();
    cy.get('img.fec-loader-image').should('exist');

    // Leave summary and come back to verify calc does NOT run
    PageUtils.clickSidebarItem('ENTER A TRANSACTION');
    PageUtils.clickSidebarItem('Manage your transactions');
    ReviewReport.Summary();
    cy.get('img.fec-loader-image').should('not.exist');
  });

  it('should recalculate after transaction created or updated', () => {
    // Create report and check summary calc runs
    F3XSetup({ individual: true });
    ReviewReport.Summary();
    cy.get('img.fec-loader-image').should('exist');

    // Create transaction
    StartTransaction.Receipts().Individual().IndividualReceipt();
    cy.get('[id="searchBox"]').type(defaultContactFormData['last_name'].slice(0, 1));
    cy.contains(defaultContactFormData['last_name']).should('exist');
    cy.contains(defaultContactFormData['last_name']).click({ force: true });
    TransactionDetailPage.enterScheduleFormData(scheduleData, false, '', true, 'contribution_date');
    PageUtils.clickButton('Save');

    // Go to summary and verify summary calc runs
    ReviewReport.Summary();
    cy.get('img.fec-loader-image').should('exist');

    // Verify summary calc doesn't run again
    PageUtils.clickSidebarItem('ENTER A TRANSACTION');
    PageUtils.clickSidebarItem('Manage your transactions');
    ReviewReport.Summary();
    cy.get('img.fec-loader-image').should('not.exist');

    // Update transaction
    PageUtils.clickSidebarItem('ENTER A TRANSACTION');
    PageUtils.clickSidebarItem('Manage your transactions');
    cy.get('tr').should('contain', 'Individual Receipt');
    PageUtils.clickLink('Individual Receipt');
    const alias = PageUtils.getAlias('');
    cy.get(alias).find('#amount').clear().safeType(123.45);
    PageUtils.clickButton('Save');
    cy.get('tr').should('contain', '$123.45');

    // Return to summary page and verify summary calc runs
    ReviewReport.Summary();
    cy.get('img.fec-loader-image').should('exist');
  });
});
