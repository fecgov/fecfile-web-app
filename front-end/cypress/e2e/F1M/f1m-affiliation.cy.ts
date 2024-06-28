import { Initialize } from '../pages/loginPage';
import { ContactListPage } from '../pages/contactListPage';
import { ReportListPage } from '../pages/reportListPage';
import { PageUtils } from '../pages/pageUtils';
import { ContactType, committeeFormData, createContact } from '../models/ContactFormModel';
import { faker } from '@faker-js/faker';
import { ReportLevelMemoPage } from '../pages/reportLevelMemoPage';

describe('Manage reports', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should create form 1m by affiliation', () => {
    ContactListPage.createCommittee();
    const committeeID = Cypress.env('COMMITTEE_ID');
    ReportListPage.createF1M();
    PageUtils.valueCheck('[data-cy="committee-id-input"]', committeeID);
    cy.get('[data-cy="state-party-radio"]').click();
    cy.get('[data-cy="affiliation-radio"').click();
    cy.get('[id="searchBox"]').type(committeeFormData.committee_id.slice(0, 3));
    cy.contains(committeeFormData.name).should('exist');
    cy.contains(committeeFormData.name).click();
    PageUtils.valueCheck('[id="affiliated_committee_name"', committeeFormData.name);
    PageUtils.clickButton('Save');
    cy.get('[data-cy="date-of-affiliation-error"]').contains('This is a required field.');
    PageUtils.calendarSetValue('[data-cy="date-of-affiliation"]');
    PageUtils.clickButton('Save');
    cy.get('[data-cy="report-list-component').should('exist');
  });

  it('should create form 1m by qualification', () => {
    const candidates = [0, 1, 2, 3, 4].map((index) => {
      const candidate = createContact(ContactType.CANDIDATE);
      ContactListPage.createCandidate(candidate);
      return candidate;
    });
    ReportListPage.createF1M();
    PageUtils.valueCheck('[data-cy="committee-id-input"]', 'C99999999');
    cy.get('[data-cy="state-party-radio"]').click();
    cy.get('[data-cy="qualification-radio"').click();
    cy.get('[data-cy="qualification-radio"').click();
    PageUtils.calendarSetValue('[data-cy="date-of-contribution"]');
    PageUtils.calendarSetValue('[data-cy="date-of-registration"]');
    PageUtils.calendarSetValue('[data-cy="date-of-requirements"]');
    for (let index = 0; index < candidates.length; index++) {
      const candidateSection = cy.get(`[data-cy="candidate-${index}"]`);
      candidateSection.find('[id="searchBox"]').type(candidates[index].first_name.slice(0, 3));
      candidateSection.get(`[data-cy="candidate-lookup"]`).contains(candidates[index].first_name).click();
      cy.get(`[data-cy="candidate-${index}"]`)
        .find('[data-cy="last-name"]')
        .should('have.value', candidates[index].last_name);
      PageUtils.calendarSetValue('[data-cy="candidate-date"]', new Date(), `[data-cy="candidate-${index}"]`);
    }
    PageUtils.clickButton('Save and continue');
    cy.get('[data-cy="print-preview"]').should('exist');

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
});
