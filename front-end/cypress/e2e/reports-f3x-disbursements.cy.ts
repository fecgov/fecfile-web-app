import { ContactListPage } from "./pages/contactListPage";
import { F3xCreateReportPage } from "./pages/f3xCreateReportPage";
import { LoginPage } from "./pages/loginPage";
import { PageUtils, currentYear } from "./pages/pageUtils";
import { ReportListPage } from "./pages/reportListPage";
import { TransactionDetailPage } from "./pages/transactionDetailPage";
import { defaultFormData as individualContactFormData, ContactFormData } from "./models/ContactFormModel";
import { defaultFormData as defaultReportFormData, e2eReportStrings } from "./models/ReportFormModel";
import { defaultScheduleFormData as defaultTransactionFormData, DisbursementFormData } from "./models/TransactionFormModel";

const organizationFormData: ContactFormData = {
    ...individualContactFormData,
    ...{ contact_type: 'Organization' },
};

const candidateFormData: ContactFormData = {
    ...individualContactFormData,
    ...{ contact_type: 'Candidate' },
};


const independantExpVoidData: DisbursementFormData = {
    ...defaultTransactionFormData,
    ...{
        date2: new Date(currentYear, 4 - 1, 27),
        supportOpposeCode: "SUPPORT",
        signatoryDateSigned: new Date(currentYear, 4 - 1, 27),
        signatoryFirstName: PageUtils.randomString(10),
        signatoryLastName: PageUtils.randomString(10)
    },
};

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
        PageUtils.clickButton(e2eReportStrings.new);
        ContactListPage.enterFormData(individualContactFormData);
        PageUtils.clickButton(e2eReportStrings.save);

        ReportListPage.goToPage();
        ReportListPage.clickCreateButton();
        F3xCreateReportPage.enterFormData(defaultReportFormData);
        PageUtils.clickButton(e2eReportStrings.saveAndCont);

        PageUtils.clickSidebarItem(e2eReportStrings.addDisbursement);
        PageUtils.clickLink(e2eReportStrings.federalElectionActivityExpenditures);
        PageUtils.clickLink(e2eReportStrings.percentFedElectionActivity);

        cy.get('#entity_type_dropdown').type(individualContactFormData.contact_type);
        cy.contains(e2eReportStrings.lookup).should('exist');
        cy.get('[role="searchbox"]').type(individualContactFormData.last_name.slice(0,1));
        cy.contains(individualContactFormData.last_name).should('exist');
        cy.contains(individualContactFormData.last_name).click();

        TransactionDetailPage.enterScheduleFormData(defaultTransactionFormData);
        
        PageUtils.clickButton(e2eReportStrings.save);
        PageUtils.clickLink(e2eReportStrings.percentFedElectionActivity);
        cy.contains(individualContactFormData.first_name).should('exist');
        cy.contains(individualContactFormData.last_name).should('exist');

    }); 

    it("should test Independent Expenditure - Void Schedule E disbursement", () => {
        // Create an individual contact to be used with contact lookup
        ContactListPage.goToPage();
        PageUtils.clickButton(e2eReportStrings.new);
        ContactListPage.enterFormData(organizationFormData);
        PageUtils.clickButton(e2eReportStrings.save);

        ContactListPage.goToPage();
        PageUtils.clickButton(e2eReportStrings.new);
        ContactListPage.enterFormData(candidateFormData);
        PageUtils.clickButton(e2eReportStrings.save);

        ReportListPage.goToPage();
        ReportListPage.clickCreateButton();
        F3xCreateReportPage.enterFormData(defaultReportFormData);
        PageUtils.clickButton(e2eReportStrings.saveAndCont);

        PageUtils.clickSidebarItem(e2eReportStrings.addDisbursement);
        cy.contains(e2eReportStrings.addDisbursement).should('exist');
        PageUtils.clickLink(e2eReportStrings.independantExpenditures);
        PageUtils.clickLink(e2eReportStrings.independantExpenditureVoid);

        cy.get('#entity_type_dropdown').type(organizationFormData.contact_type);
        cy.contains(e2eReportStrings.lookup).should('exist');
        cy.get('[role="searchbox"]').type(organizationFormData.name.slice(0, 1));
        cy.contains(organizationFormData.name).should('exist');
        cy.contains(organizationFormData.name).click();

        TransactionDetailPage.enterSheduleFormDataForVoidExpenditure(independantExpVoidData, candidateFormData);

        PageUtils.clickButton(e2eReportStrings.save);
        PageUtils.clickLink(e2eReportStrings.independantExpenditureVoid);
        cy.contains(organizationFormData.name).should('exist');

    }); 
});