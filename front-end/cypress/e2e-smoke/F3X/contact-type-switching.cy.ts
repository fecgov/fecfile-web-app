import { Initialize } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { DataSetup } from './setup';
import { StartTransaction } from './utils/start-transaction/start-transaction';
import { ContactLookup } from '../pages/contactLookup';
import { ReportListPage } from '../pages/reportListPage';

describe('Tests that contact data gets cleared out properly when switching types', () => {
  beforeEach(() => {
    Initialize();
  });

  it('Single transaction', () => {
    cy.wrap(DataSetup({ committee: true })).then((result: any) => {
      ReportListPage.goToPage();
      ReportListPage.goToReportList(result.report);
      PageUtils.clickButton("Add transaction");
      StartTransaction.Receipts().Other().OtherReceipts();
      ContactLookup.getContact(result.committee.name, '', 'Committee');
      ContactLookup.setType("Individual")
      cy.get("#last_name").should("not.exist");
    });
  });

  it('Double transaction', () => {
    cy.wrap(DataSetup({ committee: true, individual: true, individual2: true })).then((result: any) => {
      ReportListPage.goToPage();
      ReportListPage.goToReportList(result.report);
      PageUtils.clickButton("Add transaction");
      StartTransaction.Receipts().Individual().Earmark();
      ContactLookup.getContact(result.individual.last_name, '');
      PageUtils.calendarSetValue(
        '[data-cy="contribution_date"]', new Date(currentYear, 4-1, 10)
      );
      PageUtils.enterValue("#amount", 200.01);

      PageUtils.clickAccordion("STEP TWO");
      ContactLookup.getContact(result.committee.name, '[data-cy="accordion-panel-1"]', 'Committee');
      ContactLookup.setType("Individual", '#entity_type_dropdown', '[data-cy="accordion-panel-1"]')
      cy.get('[data-cy="accordion-panel-1"]').find("#last_name").should("not.exist")
    });
  });
});