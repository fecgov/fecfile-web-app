import { ContactListPage } from "./pages/contactListPage";
import { F3xCreateReportPage } from "./pages/f3xCreateReportPage";
import { LoginPage } from "./pages/loginPage";
import { PageUtils } from "./pages/pageUtils";
import { ReportListPage } from "./pages/reportListPage";
import { TransactionDetailPage } from "./pages/transactionDetailPage";
import { defaultFormData as defaultContactFormData } from "./models/ContactFormModel";
import { defaultFormData as defaultReportFormData, loanEnums } from "./models/ReportFormModel";
import { defaultScheduleFormData as defaultTransactionFormData } from "./models/TransactionFormModel";



describe('Disbursements', () => {
    beforeEach(() => {
        LoginPage.login();
        ReportListPage.deleteAllReports();
        ContactListPage.deleteAllContacts();
        ContactListPage.goToPage();
        ReportListPage.goToPage();
    });

    it("should test F3xFederalElectionActivityExpendituresPage disbursement", () => {
        // Create an individual contact to be used with contact lookup
        ContactListPage.goToPage();
        PageUtils.clickButton(loanEnums.new);
        ContactListPage.enterFormData(defaultContactFormData);
        PageUtils.clickButton(loanEnums.save);

        ReportListPage.goToPage();
        ReportListPage.clickCreateButton();
        F3xCreateReportPage.enterFormData(defaultReportFormData);
        PageUtils.clickButton(loanEnums.saveAndCont);

        PageUtils.clickSidebarItem(loanEnums.addDisbursement);
        PageUtils.clickLink(loanEnums.federalElectionActivityExpenditures);
        PageUtils.clickLink(loanEnums.percentFedElectionActivity);

        cy.get('#entity_type_dropdown').type(defaultContactFormData.contact_type);
        cy.contains(loanEnums.lookup).should('exist');
        cy.get('[role="searchbox"]').type(defaultContactFormData.last_name.slice(0,1));
        cy.contains(defaultContactFormData.last_name).should('exist');
        cy.contains(defaultContactFormData.last_name).click();

        TransactionDetailPage.enterScheduleFormData(defaultTransactionFormData);
        
        PageUtils.clickButton(loanEnums.save);
        PageUtils.clickLink(loanEnums.percentFedElectionActivity);
        cy.contains(defaultContactFormData.first_name).should('exist');
        cy.contains(defaultContactFormData.last_name).should('exist');

    });
});