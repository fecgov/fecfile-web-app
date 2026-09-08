import { ContactListPage } from '../pages/contactListPage';
import { Initialize } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { ContactFormData } from '../models/ContactFormModel';
import { defaultScheduleFormData } from '../models/TransactionFormModel';
import { DataSetup } from './setup';
import { StartTransaction } from './utils/start-transaction/start-transaction';
import { ContactLookup } from '../pages/contactLookup';
import { ReportListPage } from '../pages/reportListPage';

const scheduleData = {
  ...defaultScheduleFormData,
  electionYear: undefined,
  electionType: undefined,
  date_received: new Date(currentYear, 4 - 1, 27),
};

describe('Single Click Protected Buttons', () => {
  beforeEach(() => {
    Initialize();
  });

  it('Spam the save button', () => {
    cy.wrap(DataSetup({ individual: true })).then((result: any) => {
      ReportListPage.gotToReportTransactionListPage(result.report);
      StartTransaction.Receipts().Individual().IndividualReceipt();

      const individual: ContactFormData = result.individual;
      ContactLookup.getContact(individual.last_name);

      TransactionDetailPage.enterScheduleFormData(scheduleData, false, '', true, 'contribution_date');

      let requestCount = 0;
      cy.intercept('POST', '**/api/v1/transactions/', (request)=>{
        requestCount += 1;

        request.on('response', (response)=>{
          response.setDelay(250);
        });
      });

      for (let i = 0; i < 10; i++) {
        cy.contains('Save').first().click();
      }

      cy.waitForNetworkIdle(1000).then(()=>{
        expect(requestCount).to.equal(1);
      });
    });
  });

  xit('Spam the save and clone button', () => {
    cy.wrap(DataSetup({ individual: true })).then((result: any) => {
      ReportListPage.gotToReportTransactionListPage(result.report);
      StartTransaction.Receipts().Individual().IndividualReceipt();

      const individual: ContactFormData = result.individual;
      ContactLookup.getContact(individual.last_name);

      TransactionDetailPage.enterScheduleFormData(scheduleData, false, '', true, 'contribution_date');

      let requestCount = 0;
      cy.intercept('POST', '**/api/v1/transactions/', (request)=>{
        requestCount += 1;

        request.on('response', (response)=>{
          response.setDelay(250);
        });
      });

      // This doesn't test reliably.
      // Force-clicking is required for consistency, but force-clicking ignores
      // the single click protections.  A user's standard click would not override
      // the disabling of the button, so a force-click doing so doesn't seem like
      // a fair fail state for the test...
      for (let i = 0; i < 10; i++){
        cy.get('.p-splitbutton-dropdown').click();
        cy.get('.p-tieredmenu-item-content').eq(1).click();
      }

      cy.waitForNetworkIdle(1000).then(()=>{
        expect(requestCount).to.equal(1);
      });
    });
  });
});
