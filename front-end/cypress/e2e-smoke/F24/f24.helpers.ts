import { faker } from '@faker-js/faker';
import { StartTransaction } from '../F3X/utils/start-transaction/start-transaction';
import { ContactFormData } from '../models/ContactFormModel';
import {
  defaultScheduleFormData,
  DisbursementFormData,
} from '../models/TransactionFormModel';
import { ContactLookup } from '../pages/contactLookup';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { ReportListPage } from '../pages/reportListPage';
import { TransactionDetailPage } from '../pages/transactionDetailPage';

function createIndependentExpenditureData(): DisbursementFormData {
  return {
    ...defaultScheduleFormData,
    date2: new Date(currentYear, 4 - 1, 27),
    supportOpposeCode: 'SUPPORT',
    signatoryDateSigned: new Date(currentYear, 4 - 1, 27),
    signatoryFirstName: faker.person.firstName(),
    signatoryLastName: faker.person.lastName(),
  };
}

export function createIndependentExpenditureOnForm24(
  reportId: string,
  individualLastName: string,
  candidate: ContactFormData,
  blurBeforeSave = false,
) {
  ReportListPage.gotToReportTransactionListPage(reportId, false, true, false);
  StartTransaction.IndependentExpenditures().IndependentExpenditure();
  ContactLookup.getContact(individualLastName, '', 'Individual');
  TransactionDetailPage.enterSheduleFormDataForVoidExpenditure(
    createIndependentExpenditureData(),
    candidate,
    false,
    '',
    'date_signed',
  );
  if (blurBeforeSave) {
    cy.blurActiveField();
  }
  TransactionDetailPage.clickSave();
  cy.location('pathname').should('include', `/reports/transactions/report/${reportId}/list`);
}
