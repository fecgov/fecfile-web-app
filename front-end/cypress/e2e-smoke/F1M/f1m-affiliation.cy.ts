import { Initialize } from '../pages/loginPage';
import { ReportListPage } from '../pages/reportListPage';
import { PageUtils } from '../pages/pageUtils';
import { ContactFormData } from '../models/ContactFormModel';
import type { MockContact } from '../requests/library/contacts';
import { faker } from '@faker-js/faker';
import { ReportLevelMemoPage } from '../pages/reportLevelMemoPage';
import {
  Candidate_House_A,
  Candidate_House_B,
  Candidate_Presidential_A,
  Candidate_Presidential_B,
  Candidate_Senate_A,
} from '../requests/library/contacts';
import { makeContact } from '../requests/methods';
import { ContactLookup } from '../pages/contactLookup';

function createContactPromise(
  candidate: MockContact,
  candidates: ContactFormData[],
): Promise<void> {
  return new Cypress.Promise<void>((resolve) => {
    makeContact(candidate, (response) => {
      candidates.push(response.body);
      resolve();
    });
  });
}

describe('Manage reports', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should prepare qualified candidates', () => {
    const candidates: ContactFormData[] = [];
    const candidateList: MockContact[] = [
      Candidate_House_A,
      Candidate_House_B,
      Candidate_Presidential_A,
      Candidate_Presidential_B,
      Candidate_Senate_A,
    ];

    const apiCalls = candidateList.map((candidate) =>
      createContactPromise(candidate, candidates),
    );

    cy.wrap(Promise.all(apiCalls)).then(() => {
      expect(candidates).to.have.lengthOf(candidateList.length);
    });
  });

  it('should create form 1m by qualification', () => {
    const candidates: ContactFormData[] = [];
    const candidateList: MockContact[] = [
      Candidate_House_A,
      Candidate_House_B,
      Candidate_Presidential_A,
      Candidate_Presidential_B,
      Candidate_Senate_A,
    ];

    const apiCalls = candidateList.map((candidate) =>
      createContactPromise(candidate, candidates),
    );

    cy.wrap(Promise.all(apiCalls)).then(() => {
      expect(candidates).to.have.lengthOf(candidateList.length);

      ReportListPage.createF1M();
      PageUtils.valueCheck('[data-cy="committee-id-input"]', 'C99999999');
      cy.get('[data-cy="state-party-radio"]').filter(':visible').first().click();
      const qualificationRadio = () => cy.get('[data-cy="qualification-radio"]').filter(':visible').first();
      qualificationRadio().click();
      qualificationRadio().click();
      PageUtils.calendarSetValue('[data-cy="date_of_51st_contributor"]');
      PageUtils.calendarSetValue('[data-cy="date_of_original_registration"]');
      PageUtils.calendarSetValue('[data-cy="date_committee_met_requirements"]');

      const excludeFecIds: string[] = [];
      const excludeIds: string[] = [];

      for (let index = 0; index < candidates.length; index++) {
        ContactLookup.getCandidate(
          candidates[index],
          excludeFecIds,
          excludeIds,
          `[data-cy="candidate-${index}"]`,
        );

        cy.get(`[data-cy="candidate-${index}"]`)
          .find('[data-cy="last-name"]')
          .should('have.value', candidates[index].last_name);

        PageUtils.calendarSetValue(
          getId(index),
          new Date(),
          `[data-cy="candidate-${index}"]`,
        );

        excludeFecIds.push(candidates[index].candidate_id);
        excludeIds.push(candidates[index].id!);
      }

      PageUtils.clickButton('Save and continue');
      cy.get('[data-cy="print-preview"]').should('exist');

      PageUtils.clickSidebarSection('SIGN & SUBMIT');
      PageUtils.shouldNotHaveSidebarItem('Report Status');

      PageUtils.clickSidebarSection('REVIEW A REPORT');
      PageUtils.clickSidebarItem('Add a report level memo');
      const memoText = faker.lorem.sentence({ min: 1, max: 4 });
      ReportLevelMemoPage.enterFormData(memoText);
      PageUtils.clickButton('Save & continue');

      // Verify it is still there when we go back to the page
      PageUtils.clickSidebarSection('REVIEW A REPORT');
      PageUtils.clickSidebarItem('Add a report level memo');
      cy.get('[id="text4000"]').should('have.value', memoText);

      // Submit report and verify report status link now available
      PageUtils.clickSidebarSection('SIGN & SUBMIT');
      PageUtils.clickSidebarItem('Submit report');
      PageUtils.submitReportForm();
      PageUtils.shouldHaveSidebarItem('Report status');
    });
  });
});

const romanMap: Record<number, string> = {
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
  5: 'V',
};

function getId(num: number): string {
  return `[data-cy="${romanMap[num + 1]}_date_of_contribution"]`;
}
