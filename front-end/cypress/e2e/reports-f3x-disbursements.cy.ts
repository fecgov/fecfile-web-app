import { ContactListPage } from "./pages/contactListPage";
import { F3xCreateReportPage } from "./pages/f3xCreateReportPage";
import { LoginPage } from "./pages/loginPage";
import { PageUtils } from "./pages/pageUtils";
import { ReportListPage } from "./pages/reportListPage";
import { TransactionDetailPage } from "./pages/transactionDetailPage";
import { defaultFormData as defaultContactFormData } from "./models/ContactFormModel";
import { defaultFormData as defaultReportFormData } from "./models/ReportFormModel";
import { defaultFormData as defaultTransactionFormData } from "./models/TransactionFormModel";



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
        PageUtils.clickButton('New');
        ContactListPage.enterFormData(defaultContactFormData);
        PageUtils.clickButton('Save');

        ReportListPage.goToPage();
        ReportListPage.clickCreateButton();
        F3xCreateReportPage.enterFormData(defaultReportFormData);
        PageUtils.clickButton('Save and continue');

        PageUtils.clickSidebarItem('Add a disbursement');
        PageUtils.clickLink("FEDERAL ELECTION ACTIVITY EXPENDITURES");
        PageUtils.clickLink("100% Federal Election Activity Payment");

        cy.get('#entity_type_dropdown').type(defaultContactFormData['contact_type']);
        cy.get('[role="searchbox"]').type(defaultContactFormData['last_name'].slice(0,1));
        cy.contains(defaultContactFormData['last_name']).should('exist');
        cy.contains(defaultContactFormData['last_name']).click();

        TransactionDetailPage.enterFormData(defaultTransactionFormData);
        PageUtils.clickButton('Save');
    });
});