import { DataSetup } from "../../../e2e-smoke/F3X/setup";
import { StartTransaction } from "../../../e2e-smoke/F3X/utils/start-transaction/start-transaction";
import { formTransactionDataForSchedule } from "../../../e2e-smoke/models/TransactionFormModel";
import { ContactLookup } from "../../../e2e-smoke/pages/contactLookup";
import { Initialize } from "../../../e2e-smoke/pages/loginPage";
import { currentYear, PageUtils } from "../../../e2e-smoke/pages/pageUtils";
import { ReportListPage } from "../../../e2e-smoke/pages/reportListPage";
import { TransactionDetailPage } from "../../../e2e-smoke/pages/transactionDetailPage";
import { F3XAggregationHelpers } from "./f3x-aggregation.helpers";

describe('Receipt Transactions', () => {
  beforeEach(() => {
    Initialize();
  });

  it('Create an Conduit Earmark Receipt transaction using the contact lookup', () => {
    cy.wrap(DataSetup({ individual: true, committee: true, candidate: true })).then((result: any) => {
      const individual = result.individual;
      const committee = result.committee;
      const candidate = result.candidate;
      ReportListPage.gotToReportTransactionListPage(result.report);
      StartTransaction.Receipts().Individual().ConduitEarmarkReceipt();

      // Enter STEP ONE transaction
      cy.get('p-accordion-panel').first().as('stepOneAccordion');
      ContactLookup.getContact(individual.last_name, '@stepOneAccordion');
      const transactionFormData = {
        ...formTransactionDataForSchedule,
        purpose_description: '',
        category_code: '',
        date_received: new Date(currentYear, 4 - 1, 27),
      };
      TransactionDetailPage.enterScheduleFormData(
        transactionFormData,
        false,
        '@stepOneAccordion',
        true,
        'contribution_date',
      );
      cy.get("[inputid='memo_code']").contains("Undeposited").click();

      // Enter STEP TWO transaction
      PageUtils.clickAccordion('STEP TWO');
      cy.get('p-accordion-panel').last().as('stepTwoAccordion');
      ContactLookup.getCommittee(committee, [], [], '@stepTwoAccordion');
      TransactionDetailPage.enterScheduleFormData(
        transactionFormData,
        true,
        '@stepTwoAccordion',
        true,
        'expenditure_date',
      );
      ContactLookup.getCandidate(candidate, [], [], '#contact_2_lookup');
      PageUtils.selectDropdownSetValue('[inputid="electionType"]', 'G');
      F3XAggregationHelpers.clearAndType('#electionYear', `${currentYear}`);

      // Verify record created
      TransactionDetailPage.clickSaveBothTransactions();
      PageUtils.urlCheck('/list');
      cy.get('tr').should('contain', 'Conduit Earmark (Undeposited)');
    });
  });
});
