// @ts-check

const fieldCandidateOffice = "p-dropdown[FormControlName='candidate_office']";
const fieldCandidateState = 'p-dropdown[FormControlName="candidate_state"]';
const fieldCandidateDistrict = 'p-dropdown[FormControlName="candidate_district"]';

const candidateStates: object = {
  Alabama: 7,
  Alaska: 1,
  'American Samoa': 0,
  Arizona: 9,
  Arkansas: 4,
  California: 52,
  Colorado: 8,
  Connecticut: 8,
  Delaware: 1,
  'District of Columbia': 0,
  Florida: 28,
  Georgia: 14,
  Guam: 0,
  Hawaii: 2,
  Idaho: 2,
  Illinois: 17,
  Indiana: 9,
  Iowa: 4,
  Kansas: 4,
  Kentucky: 6,
  Louisiana: 6,
  Maine: 2,
  Maryland: 8,
  Massachusetts: 9,
  Michigan: 13,
  Minnesota: 8,
  Mississippi: 4,
  Missouri: 8,
  Montana: 2,
  Nebraska: 3,
  Nevada: 4,
  'New Hampshire': 2,
  'New Jersey': 12,
  'New Mexico': 3,
  'New York': 26,
  'North Carolina': 14,
  'North Dakota': 1,
  'Northern Mariana Islands': 0,
  Ohio: 15,
  Oklahoma: 5,
  Oregon: 6,
  Pennsylvania: 17,
  'Puerto Rico': 0,
  'Rhode Island': 2,
  'South Carolina': 7,
  'South Dakota': 1,
  Tennessee: 9,
  Texas: 38,
  'U.S. Virgin Islands': 0,
  Utah: 4,
  Vermont: 1,
  Virginia: 11,
  Washington: 10,
  'West Virginia': 2,
  Wisconsin: 8,
  Wyoming: 1,
};

function checkEveryStateThenSelectWestVirgia() {
  cy.get(fieldCandidateState).click();

  for (const state of Object.keys(candidateStates)) {
    cy.contains('p-dropdownitem', state).should('exist');
  }

  cy.contains('p-dropdownitem', 'West Virginia').click();
  cy.get(fieldCandidateState).should('contain', 'West Virginia');
}

describe('Counts the number of districts associated with each state', () => {
  beforeEach('Logs in', () => {
    cy.login();
    cy.visit('/dashboard');
  });

  it('', () => {
    //Step 1: Navigate to contacts page
    cy.visit('/dashboard');
    cy.url().should('contain', '/dashboard');
    cy.get('.p-menubar').contains('.p-menuitem-link', 'Contacts').click();
    cy.url().should('contain', '/contacts');

    //Step 2: Open a New Contact
    cy.get("button[label='New']").click();
    cy.shortWait();
    cy.get("div[role='dialog']").contains('Add Contact').should('exist');

    //Step 3: Set the Contact Type to 'Candidate'
    cy.dropdownSetValue('p-dropdown[id=entity_type_dropdown]', 'Candidate');
    cy.get('p-dropdown[id=entity_type_dropdown]').should('contain', 'Candidate');

    //Steps 4 & 5: Verify 'Candidate Office' dropdown contains House, Senate, and Presidential and then select Presidential
    cy.get(fieldCandidateOffice).click();

    const officeTypes: Array<string> = ['House', 'Senate', 'Presidential'];
    for (let officeType of officeTypes) {
      cy.get('p-dropdownitem').contains(officeType).should('exist');
    }
    cy.get('p-dropdownitem').contains('Presidential').click({ force: true });
    cy.shortWait();
    cy.get(fieldCandidateOffice).should('contain', 'Presidential');

    //Step 6: Verify 'Candidate State' and 'Candidate District' are non-interactive
    cy.get(fieldCandidateState).find('.p-disabled').should('exist');
    cy.get(fieldCandidateDistrict).find('.p-disabled').should('exist');

    //Step 7: Select 'Senate' from the 'Candidate Office' dropdown
    cy.dropdownSetValue(fieldCandidateOffice, 'Senate');
    cy.get(fieldCandidateOffice).should('contain', 'Senate');

    //Step 8: Verify "Candidate State" dropdown is interactive and not "Candidate District"
    cy.get(fieldCandidateState).find('.p-disabled').should('not.exist');
    cy.get(fieldCandidateDistrict).find('.p-disabled').should('exist');

    //Step 9: Verify all states are present (Senate) and then select "West Virginia"
    checkEveryStateThenSelectWestVirgia();

    //Step 10: Select 'House' from the 'Candidate Office' dropdown
    cy.dropdownSetValue(fieldCandidateOffice, 'House');
    cy.get(fieldCandidateOffice).should('contain', 'House');

    //Step 11: Verify "Candidate State" and "Candidate District" dropdowns are interactive
    cy.get(fieldCandidateState).find('.p-disabled').should('not.exist');
    cy.get(fieldCandidateDistrict).find('.p-disabled').should('not.exist');

    //Step 12: Verify all states are present (House) and then select "West Virginia"
    checkEveryStateThenSelectWestVirgia();

    //Steps 13 & 14: Check that every state has its corresponding number of districts
    for (const state of Object.keys(candidateStates)) {
      let districtCount: number = candidateStates[state];
      if (districtCount == 0) districtCount = 1; //For some odd reason, states with 0 districts have '00' in the dropdown; According to Shelly, this is intended behavior

      cy.dropdownSetValue(fieldCandidateState, state, false);
      cy.get(fieldCandidateDistrict).click();
      cy.get('p-dropdownitem').should('have.length', districtCount);
    }
  });
});
