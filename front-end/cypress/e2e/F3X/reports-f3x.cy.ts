import { Initialize } from '../pages/loginPage';
import { ReportListPage } from '../pages/reportListPage';
import { ReportLevelMemoPage } from '../pages/reportLevelMemoPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { defaultForm3XData } from '../models/ReportFormModel';
import { F3xCreateReportPage } from '../pages/f3xCreateReportPage';
import { faker } from '@faker-js/faker';

describe('Manage reports', () => {
  beforeEach(() => {
    Initialize();
  });

  it('Create a Quarterly Election Year report', () => {
    ReportListPage.createF3X();
    ReportListPage.goToPage();
    cy.get('tr').should('contain', 'FORM 3X');
    cy.get('tr').should('contain', 'GENERAL (12G)');
    cy.get('tr').should('contain', `04/01/${currentYear} - 04/30/${currentYear}`);
  });

  it('Create a Monthly Election Year report', () => {
    const formData = {
      ...defaultForm3XData,
      ...{
        filing_frequency: 'M',
        report_code: 'M10',
      },
    };
    ReportListPage.createF3X(formData);
    ReportListPage.goToPage();
    cy.get('tr').should('contain', 'FORM 3X');
    cy.get('tr').should('contain', 'OCTOBER 20 MONTHLY REPORT (M10)');
  });

  it('Create a Quarterly Non-Election Year report', () => {
    const formData = {
      ...defaultForm3XData,
      ...{
        report_type_category: 'Non-Election Year',
        report_code: '30R',
      },
    };
    ReportListPage.createF3X(formData);
    ReportListPage.goToPage();
    cy.get('tr').should('contain', 'FORM 3X');
    cy.get('tr').should('contain', 'RUNOFF (30R)');
  });

  it('Create a Monthly Non-Election Year report', () => {
    const formData = {
      ...defaultForm3XData,
      ...{
        filing_frequency: 'M',
        report_type_category: 'Non-Election Year',
        report_code: 'YE',
      },
    };
    ReportListPage.createF3X(formData);
    ReportListPage.goToPage();
    cy.get('tr').should('contain', 'FORM 3X');
    cy.get('tr').should('contain', 'JANUARY 31 YEAR-END (YE)');
    cy.get('tr').should('contain', `04/01/${currentYear} - 04/30/${currentYear}`);
  });

  it('Create a report error for overlapping coverage dates', () => {
    // Create report #1
    ReportListPage.createF3X();

    // Create report #2
    const formData = {
      ...defaultForm3XData,
      ...{
        report_code: '30G',
      },
    };
    ReportListPage.createF3X(formData);

    // Check for error messages caused by the overlapping dates
    const errorMessage = `You have entered coverage dates that overlap the coverage dates of the following report: 12-DAY PRE-GENERAL (12G)  04/01/${currentYear} - 04/30/${currentYear}`;
    cy.get('app-error-messages[data-cy="coverage_from_date-error"]').should('contain', errorMessage);
    cy.get('app-error-messages[data-cy="coverage_through_date-error"]').should('contain', errorMessage);
  });

  // it('Create report with previous existing report types disabled', () => {
  //   // Create report #1
  //   ReportListPage.createF3X();
  //   ReportListPage.goToPage();
  //   // Start second report and check to see if report code disabled
  //   F3xCreateReportPage.coverageCall();
  //   ReportListPage.clickCreateAndSelectForm('F3X');
  //   F3xCreateReportPage.waitForCoverage();
  //   cy.get('label[for="12G"]').should('have.class', 'p-disabled');
  // });

  it('Create report and save', () => {
    ReportListPage.createF3X();
  });

  it('Create a report level memo', () => {
    ReportListPage.createF3X();

    // Enter the memo text
    PageUtils.clickSidebarSection('REVIEW A REPORT');
    PageUtils.clickSidebarItem('Add a report level memo');
    const memoText = faker.lorem.sentence({ min: 1, max: 4 });
    ReportLevelMemoPage.enterFormData(memoText);
    PageUtils.clickButton('Save & continue');

    // Verify it is still there when we go back to the page
    PageUtils.clickSidebarSection('REVIEW A REPORT');
    PageUtils.clickSidebarItem('Add a report level memo');
    cy.get('[id="text4000"]').should('have.value', memoText);
  });

  // it('Confirm report information', () => {
  //   ReportListPage.createF3X();
  // });

  // it('Submit a report', () => {
  //   ReportListPage.createF3X();
  // });
});
