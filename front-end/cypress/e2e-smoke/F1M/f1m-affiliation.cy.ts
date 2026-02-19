import { Initialize } from '../pages/loginPage';
import { ReportListPage } from '../pages/reportListPage';
import { PageUtils } from '../pages/pageUtils';
import { faker } from '@faker-js/faker';
import { ReportLevelMemoPage } from '../pages/reportLevelMemoPage';
import { ContactLookup } from '../pages/contactLookup';
import {
  getCandidateContributionDateFieldSelector,
  qualifiedCandidates,
  seedQualifiedCandidates,
} from './utils/candidate-seeding';

describe('Manage reports', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should seed qualified candidates', () => {
    seedQualifiedCandidates().then((candidates) => {
      expect(candidates).to.have.lengthOf(qualifiedCandidates.length);
      candidates.forEach((candidate) => {
        expect(candidate.id, 'created candidate id').to.exist;
        expect(candidate.candidate_id, 'created candidate fec id').to.exist;
      });
    });
  });

  it('should create form 1m by qualification', () => {
    seedQualifiedCandidates().then((candidates) => {
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
          getCandidateContributionDateFieldSelector(index),
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
