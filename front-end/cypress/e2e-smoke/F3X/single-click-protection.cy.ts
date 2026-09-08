import { ContactListPage } from '../pages/contactListPage';
import { TransactionTableColumns } from '../pages/f3xTransactionListPage';
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

function checkTable(index: number, type: string, containMemo: boolean, value: string) {
  cy.get('tbody tr').eq(index).as('row');

  // this block of checks is here to ensure all columns exist
  // (and to prove to knip that every part of the TransactionTableColumns enum is needed)
  cy.get('@row').find('td').eq(TransactionTableColumns.line_number).should('exist');
  cy.get('@row').find('td').eq(TransactionTableColumns.date).should('exist');
  cy.get('@row').find('td').eq(TransactionTableColumns.amount).should('exist');
  cy.get('@row').find('td').eq(TransactionTableColumns.actions).should('exist');

  cy.get('@row').find('td').eq(TransactionTableColumns.transaction_type).should('contain', type);
  cy.get('@row')
    .find('td')
    .eq(TransactionTableColumns.memo_code)
    .should(containMemo ? 'contain' : 'not.contain', 'Y');
  cy.get('@row').find('td').eq(TransactionTableColumns.aggregate).should('contain', value);
}

describe('Single Click Protected Buttons', () => {
  beforeEach(() => {
    Initialize();
  });

  it('Create an Individual Receipt and spam the save button', () => {
    cy.wrap(DataSetup({ individual: true })).then((result: any) => {
      ReportListPage.gotToReportTransactionListPage(result.report);
      StartTransaction.Receipts().Individual().IndividualReceipt();

      const individual: ContactFormData = result.individual;
      ContactLookup.getContact(individual.last_name);

      TransactionDetailPage.enterScheduleFormData(scheduleData, false, '', true, 'contribution_date');
      TransactionDetailPage.clickSave();
      scheduleData.date_received = new Date(currentYear, 4 - 1, 27);
      cy.get('tr').should('contain', 'Individual Receipt');
      cy.get('tr').should('contain', 'Unitemized');
      cy.get('tr').should('contain', `${individual['last_name']}, ${individual['first_name']}`);
      cy.get('tr').should('contain', PageUtils.dateToString(scheduleData.date_received));
      cy.get('tr').should('contain', '$' + scheduleData.amount);

      // Check values of edit form
      PageUtils.clickLink('Individual Receipt');
      cy.get('#entity_type_dropdown.readonly').should('exist');
      cy.get('#entity_type_dropdown').should('contain', 'Individual');
      ContactListPage.assertFormData(individual, true);
      TransactionDetailPage.assertFormData(scheduleData, '', '#contribution_date');

      while (true) {
        TransactionDetailPage.clickSave();
        cy.wait(100);
      }
    });
  });
});
