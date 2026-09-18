import { LoginPage } from '../pages/loginPage';
import { PageUtils } from '../pages/pageUtils';
import { DataSetup } from './setup';
import { StartTransaction } from './utils/start-transaction/start-transaction';
import { ReportListPage } from '../pages/reportListPage';
import { ContactLookup } from '../pages/contactLookup';

describe('Schedule B Clone', () => {
  beforeEach(() => {
    LoginPage.login();
  });

  it('should include aggregate_amount when saving a cloned Schedule B transaction', () => {
    cy.wrap(
      DataSetup({
        organization: true,
        report: {
          report_type: 'F3X',
          form_type: 'F3XN',
          report_code: 'Q2',
          coverage_from_date: '2099-04-01',
          coverage_through_date: '2099-06-30',
          state_of_election: null,
          date_of_election: null,
        },
      }),
    ).then((result: any) => {
      ReportListPage.gotToReportTransactionListPage(result.report);
      StartTransaction.Disbursements().Other().Other();
      ContactLookup.getContact(result.organization.name);

      cy.get('[data-cy="expenditure_date"] .p-datepicker-input').first().clear().type('04/27/2026{enter}');
      cy.get('p-checkbox[inputid="memo_code"]').first().click();
      cy.get('#text4000').first().type('Memo for clone regression');
      cy.get('#amount').safeType(75);
      cy.get('textarea#purpose_description').first().type('Office supplies').blur();
      cy.get('[data-cy="navigation-control-splitbutton"] .p-splitbutton-button')
        .first()
        .should('be.visible')
        .then(($button) => {
          ($button[0] as HTMLButtonElement).click();
        });
      cy.contains('Transactions in this report').should('exist');

      PageUtils.clickLink('Other Disbursement');

      cy.intercept('POST', '**/api/v1/transactions/', (request) => {
        expect(request.body.transaction_type_identifier).to.equal('OTHER_DISBURSEMENT');
        expect(request.body.aggregate_amount).to.be.a('number');
      }).as('saveClonedScheduleB');

      cy.get('[data-cy="navigation-control-splitbutton"] .p-splitbutton-dropdown').click();
      cy.get('.p-tieredmenu:visible').contains('Clone').click();
      cy.contains('button', 'Okay').click();

      cy.get('[data-cy="navigation-control-splitbutton"] .p-splitbutton-button')
        .first()
        .should('be.visible')
        .then(($button) => {
          ($button[0] as HTMLButtonElement).click();
        });
      cy.wait('@saveClonedScheduleB');
    });
  });
});
