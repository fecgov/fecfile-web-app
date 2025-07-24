import { Initialize } from '../pages/loginPage';
import { ReportListPage } from '../pages/reportListPage';
import { PageUtils } from '../pages/pageUtils';
import { ContactFormData } from '../models/ContactFormModel';
import { faker } from '@faker-js/faker';
import { ReportLevelMemoPage } from '../pages/reportLevelMemoPage';
import {
  Candidate_House_A,
  Candidate_House_B,
  Candidate_Presidential_A,
  Candidate_Presidential_B,
  Candidate_Senate_A,
  Committee_A,
} from '../requests/library/contacts';
import { makeContact } from '../requests/methods';
import { ContactLookup } from '../pages/contactLookup';

describe('Manage reports', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should create form 1m by affiliation', () => {
    makeContact(Committee_A, (response) => {
      const committeeID = Cypress.env('COMMITTEE_ID');
      const committee = response.body;

      ReportListPage.createF1M();
      PageUtils.valueCheck('[data-cy="committee-id-input"]', committeeID);
      cy.get('[data-cy="state-party-radio"]').click();
      cy.get('[data-cy="affiliation-radio"').click();
      cy.get('[id="searchBox"]').type(committee.committee_id.slice(0, 3));
      cy.contains(committee.name).should('exist');
      cy.contains(committee.name).click();
      PageUtils.valueCheck('[id="affiliated_committee_name"', committee.name);
      PageUtils.clickButton('Save');
      cy.get('[data-cy="affiliated_date_form_f1_filed-error"]').contains('This is a required field.');
      PageUtils.calendarSetValue('[data-cy="affiliated_date_form_f1_filed"]');
      PageUtils.clickButton('Save');
      cy.get('[data-cy="report-list-component').should('exist');
    });
  });

  it('should create form 1m by qualification', () => {
    const candidates: ContactFormData[] = [];
    const candidateList = [
      Candidate_House_A,
      Candidate_House_B,
      Candidate_Presidential_A,
      Candidate_Presidential_B,
      Candidate_Senate_A,
    ];

    const apiCalls = candidateList.map((candidate) => {
      return new Cypress.Promise((resolve) => {
        makeContact(candidate, (response) => {
          candidates.push(response.body);
          resolve();
        });
      });
    });

    cy.wrap(Promise.all(apiCalls)).then(() => {
      expect(candidates).to.have.lengthOf(candidateList.length);

      ReportListPage.createF1M();
      PageUtils.valueCheck('[data-cy="committee-id-input"]', 'C99999999');
      cy.get('[data-cy="state-party-radio"]').click();
      cy.get('[data-cy="qualification-radio"]').click();
      cy.get('[data-cy="qualification-radio"]').click();
      PageUtils.calendarSetValue('[data-cy="date_of_51st_contributor"]');
      PageUtils.calendarSetValue('[data-cy="date_of_original_registration"]');
      PageUtils.calendarSetValue('[data-cy="date_committee_met_requirements"]');

      const excludeFecIds: string[] = [];
      const excludeIds: string[] = [];
      for (let index = 0; index < candidates.length; index++) {
        ContactLookup.getCandidate(candidates[index], excludeFecIds, excludeIds, `[data-cy="candidate-${index}"]`);
        PageUtils.calendarSetValue(getId(index), new Date(), `[data-cy="candidate-${index}"]`);
        excludeFecIds.push(candidates[index].candidate_id);
        excludeIds.push(candidates[index].id!);
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
});

const romanMap: { [key: number]: string } = {
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
  5: 'V',
};
function getId(num: any) {
  return `[data-cy="${romanMap[num + 1]}_date_of_contribution"]`;
}
