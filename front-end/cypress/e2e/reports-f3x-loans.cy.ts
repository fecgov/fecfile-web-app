import { LoginPage } from './pages/loginPage';
import { currentYear, PageUtils } from './pages/pageUtils';
import { ReportListPage } from './pages/reportListPage';
import { TransactionDetailPage } from './pages/transactionDetailPage';
import { ContactListPage } from './pages/contactListPage';
import { F3xCreateReportPage } from './pages/f3xCreateReportPage';
import { defaultLoanFormData, LoanFormData } from './models/TransactionFormModel';
import { defaultFormData as individualContactFormData, ContactFormData } from './models/ContactFormModel';
import { defaultFormData as reportFormData, F3xCreateReportFormData } from './models/ReportFormModel';

export const committeeFormData: ContactFormData = {
  contact_type: 'Committee',
  last_name: PageUtils.randomString(10),
  first_name: PageUtils.randomString(10),
  middle_name: PageUtils.randomString(10),
  prefix: PageUtils.randomString(5),
  suffix: PageUtils.randomString(5),
  country: 'United States of America',
  street_1: PageUtils.randomString(10),
  street_2: PageUtils.randomString(10),
  city: PageUtils.randomString(10),
  state: 'District of Columbia',
  zip: PageUtils.randomString(5),
  phone: PageUtils.randomString(10, 'numeric'),
  employer: PageUtils.randomString(20),
  occupation: PageUtils.randomString(20),
  candidate_id: 'H2AZ12345',
  candidate_office: 'House',
  candidate_state: 'Virginia',
  candidate_district: '01',
  committee_id: 'C' + PageUtils.randomString(8, 'numeric'),
  name: PageUtils.randomString(10),
};

export const organizationFormData: ContactFormData = {
  contact_type: 'Organization',
  last_name: PageUtils.randomString(10),
  first_name: PageUtils.randomString(10),
  middle_name: PageUtils.randomString(10),
  prefix: PageUtils.randomString(5),
  suffix: PageUtils.randomString(5),
  country: 'United States of America',
  street_1: PageUtils.randomString(10),
  street_2: PageUtils.randomString(10),
  city: PageUtils.randomString(10),
  state: 'District of Columbia',
  zip: PageUtils.randomString(5),
  phone: PageUtils.randomString(10, 'numeric'),
  employer: PageUtils.randomString(20),
  occupation: PageUtils.randomString(20),
  candidate_id: 'H2AZ12345',
  candidate_office: 'House',
  candidate_state: 'Virginia',
  candidate_district: '01',
  committee_id: 'C' + PageUtils.randomString(8, 'numeric'),
  name: PageUtils.randomString(10),
};


describe('Loans', () => {
    beforeEach(() => {
        LoginPage.login();
        ReportListPage.deleteAllReports();
        ContactListPage.deleteAllContacts();
        ContactListPage.goToPage();
        ReportListPage.goToPage();
    });
    /*
    it("should test Loan By Committee loan", () => {
        // Create a committee contact to be used with contact lookup
        ContactListPage.goToPage();
        PageUtils.clickButton('New');
        ContactListPage.enterFormData(committeeFormData);
        PageUtils.clickButton('Save');

        // Create individual 
        ContactListPage.goToPage();
        PageUtils.clickButton('New');
        ContactListPage.enterFormData(individualContactFormData);
        PageUtils.clickButton('Save');

        // Create report to add loan too
        ReportListPage.goToPage();
        ReportListPage.clickCreateButton();
        F3xCreateReportPage.enterFormData(reportFormData);
        PageUtils.clickButton('Save and continue');

        // Navigate to loans
        PageUtils.clickSidebarItem('Add loans and debts');
        PageUtils.clickLink("LOANS");
        PageUtils.clickLink("Loan By Committee");

        // Search for created committee and enter load data, then add load gaurantor
        PageUtils.searchBoxInput(committeeFormData['committee_id']);
        TransactionDetailPage.enterLoanFormData(defaultLoanFormData);
        PageUtils.clickButton("Save both transactions");

        //PageUtils.clickLink("Loan By Committee");
        //PageUtils.clickButton("Save & add loan guarantor");
        //PageUtils.searchBoxInput(individualContactFormData.last_name);
        // Add individual loan gaurantor and return back 
        //PageUtils.clickLink("Create a new contact");
    }); */

    it("should test Loan Received from Bank loan", () => {
      // Create a committee contact to be used with contact lookup
      ContactListPage.goToPage();
      PageUtils.clickButton('New');
      ContactListPage.enterFormData(organizationFormData);
      PageUtils.clickButton('Save');

      // Create individual 
      ContactListPage.goToPage();
      PageUtils.clickButton('New');
      ContactListPage.enterFormData(individualContactFormData);
      PageUtils.clickButton('Save');

      // Create report to add loan too
      ReportListPage.goToPage();
      ReportListPage.clickCreateButton();
      F3xCreateReportPage.enterFormData(reportFormData);
      PageUtils.clickButton('Save and continue');

      // Navigate to loans
      PageUtils.clickSidebarItem('Add loans and debts');
      PageUtils.clickLink("LOANS");
      PageUtils.clickLink("Loan Received from Bank");

      // Search for created committee and enter load data, then add load gaurantor
      PageUtils.searchBoxInput(organizationFormData['name']);
      TransactionDetailPage.enterLoanFormData(defaultLoanFormData);
      
      TransactionDetailPage.enterLoanFormDataStepTwo(defaultLoanFormData);
      //PageUtils.clickButton("Save transactions");

     // PageUtils.clickLink("Loan By Committee");
      //PageUtils.clickButton("Save & add loan guarantor");
      //PageUtils.searchBoxInput(individualContactFormData.last_name);
      // Add individual loan gaurantor and return back 
      //PageUtils.clickLink("Create a new contact");
  }); 
});