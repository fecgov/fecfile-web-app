/* eslint-disable @typescript-eslint/no-explicit-any */
import { Initialize } from '../../e2e-smoke/pages/loginPage';
import { ContactListPage } from '../../e2e-smoke/pages/contactListPage';
import { PageUtils } from '../../e2e-smoke/pages/pageUtils';
import { ContactsHelpers } from './contacts.helpers';
import { makeContact, makeTransaction } from '../../e2e-smoke/requests/methods';
import {
  Individual_A_A,
  Candidate_House_A,
  Committee_A,
  Organization_A,
  MockContact,
} from '../../e2e-smoke/requests/library/contacts';
import { buildScheduleA } from '../../e2e-smoke/requests/library/transactions';

const IND_LAST = 'IndLn8535';
const IND_FIRST = 'IndFn8535';
const IND_DISPLAY = `${IND_LAST}, ${IND_FIRST}`;
const CAND_LAST = 'CandLn8535';
const CAND_FIRST = 'CandFn8535';
const CAND_DISPLAY = `${CAND_LAST}, ${CAND_FIRST}`;
const INDIVIDUAL_RECEIPT_TYPE = 'INDIVIDUAL_RECEIPT';
let individualDisplayName = IND_DISPLAY;

function setDropdownByLabel(labelRegex: RegExp, optionText: string) {
  cy.contains('label', labelRegex)
    .parent()
    .within(() => {
      cy.get('.p-select, .p-dropdown, .p-inputwrapper')
        .first()
        .click({ force: true });
    });

  cy.get('.p-select-option, .p-dropdown-item')
    .contains(new RegExp(`^\\s*${optionText}\\s*$`))
    .click({ force: true });
}

function setTelephone(value: string) {
  cy.contains('label', /^Telephone/i)
    .parent()
    .find('input')
    .last()
    .clear()
    .type(value);
}

describe('Contacts Edit', () => {
  const updatedEmployerBase = `Updated Employer ${Date.now()}`;
  const updatedOccupationBase = `Updated Occupation ${Date.now()}`;
  let committeeDisplayName: string;
  let organizationDisplayName: string;

  beforeEach(() => {
    Initialize();

    const individualContact: MockContact = {
      ...Individual_A_A,
      last_name: IND_LAST,
      first_name: IND_FIRST,
    };

    const candidateContact: MockContact = {
      ...Candidate_House_A,
      last_name: CAND_LAST,
      first_name: CAND_FIRST,
    };

    const committeeContact: MockContact = {
      ...Committee_A,
      name: Committee_A.name,
    };

    const organizationContact: MockContact = {
      ...Organization_A,
      name: Organization_A.name,
    };

    committeeDisplayName = committeeContact.name as string;
    organizationDisplayName = organizationContact.name as string;

    // Create Individual + one Schedule A transaction so Transaction history is populated
    makeContact(individualContact, (contactResp) => {
      const contact = contactResp.body as any;
      const today = new Date();
      const dateStr = today.toISOString().slice(0, 10);

      const txn = buildScheduleA(
        INDIVIDUAL_RECEIPT_TYPE,
        123, // any positive amount
        dateStr,
        contact,
        undefined,
        { report_ids: [] }, // avoid [null] -> 500
      );

      makeTransaction(txn);
    });

    makeContact(candidateContact);
    makeContact(committeeContact);
    makeContact(organizationContact);

    ContactListPage.goToPage();
    ContactsHelpers.assertColumnHeaders(ContactsHelpers.CONTACTS_HEADERS);
  });

  // INDIVIDUAL: update/check all editable fields + required + length validation
  it('updates all editable fields for an Individual, enforces required and length validation, and persists to list and edit form', () => {
    const newLast = `${IND_LAST}-Upd`;
    const newFirst = `${IND_FIRST}-Upd`;
    const newMiddle = 'MiddleUpd';
    const newPrefix = 'Dr.';
    const newSuffix = 'Jr.';

    const newStreet1 = '987 Updated St';
    const newStreet2 = 'Apt 9';
    const newCity = 'Updatedville';
    const newState = 'Alabama';
    const newZip = '54321';
    const newPhone = '5551234567';

    const newEmployer = `${updatedEmployerBase}-ind-all`;
    const newOccupation = `${updatedOccupationBase}-ind-all`;
    const newDisplay = `${newLast}, ${newFirst}`;

    const expectRequiredNearLabel = (labelRx: RegExp) => {
      cy.contains('label', labelRx)
        .parent()
        .within(() => {
          cy.contains(/This is a required field\./i).should('exist');
        });
    };

    const expectMaxErrorNearLabel = (labelRx: RegExp, text: RegExp) => {
      cy.contains('label', labelRx)
        .parent()
        .within(() => {
          cy.contains(text).should('exist');
        });
    };

    PageUtils.clickKababItem(IND_DISPLAY, 'Edit');
    cy.contains(/Edit Contact/i).should('exist');

    //
    // 1. REQUIRED FIELD VALIDATION (clear and save)
    //
    cy.get('#last_name').clear();
    cy.get('#first_name').clear();
    cy.get('#street_1').clear();
    cy.get('#city').clear();
    cy.get('#zip').clear();

    PageUtils.clickButton('Save');

    cy.contains(/Edit Contact/i).should('exist');
    expectRequiredNearLabel(/^Last name/i);
    expectRequiredNearLabel(/^First name/i);
    expectRequiredNearLabel(/^Street address/i);
    expectRequiredNearLabel(/^City/i);
    expectRequiredNearLabel(/^Zip\/Postal code/i);

    //
    // 2. MAX-LENGTH / NUMERIC VALIDATION (overfill and save)
    //
    const over30 = 'A'.repeat(31);
    const over20 = 'B'.repeat(21);
    const over10 = 'C'.repeat(11);
    const over34 = 'D'.repeat(35);
    const over38 = 'E'.repeat(39);
    const badPhone = '12345678901'; // 11 digits

    // Names
    cy.get('#last_name').clear().type(over30);
    cy.get('#first_name').clear().type(over20);
    cy.get('#middle_name').clear().type(over20);
    cy.get('#prefix').clear().type(over10);
    cy.get('#suffix').clear().type(over10);

    // Address
    setDropdownByLabel(/^Country\/Region/i, 'United States of America');
    cy.get('#street_1').clear().type(over34);
    cy.get('#street_2').clear().type(over34);
    cy.get('#city').clear().type(over30);
    PageUtils.dropdownSetValue('#state', newState);
    cy.get('#zip').clear().type('0123456783'); // 10 chars to trigger “> 9 alphanumeric”
    setTelephone(badPhone);

    // Employer / Occupation
    cy.get('#employer').clear().type(over38);
    cy.get('#occupation').clear().type(over38);

    PageUtils.clickButton('Save');

    cy.contains(/Edit Contact/i).should('exist');

    // Match the messages from your screenshot
    expectMaxErrorNearLabel(/^Last name/i, /cannot contain more than 30 alphanumeric characters/i);
    expectMaxErrorNearLabel(/^First name/i, /cannot contain more than 20 alphanumeric characters/i);
    expectMaxErrorNearLabel(/^Middle name/i, /cannot contain more than 20 alphanumeric characters/i);
    expectMaxErrorNearLabel(/^Prefix/i, /cannot contain more than 10 alphanumeric characters/i);
    expectMaxErrorNearLabel(/^Suffix/i, /cannot contain more than 10 alphanumeric characters/i);

    expectMaxErrorNearLabel(/^Street address/i, /cannot contain more than 34 alphanumeric characters/i);
    expectMaxErrorNearLabel(/^Apartment, suite, etc\./i, /cannot contain more than 34 alphanumeric characters/i);
    expectMaxErrorNearLabel(/^City/i, /cannot contain more than 30 alphanumeric characters/i);
    expectMaxErrorNearLabel(/^Zip\/Postal code/i, /cannot contain more than 9 alphanumeric characters/i);

    expectMaxErrorNearLabel(/^Employer/i, /cannot contain more than 38 alphanumeric characters/i);
    expectMaxErrorNearLabel(/^Occupation/i, /cannot contain more than 38 alphanumeric characters/i);

    cy.contains('label', /^Telephone/i)
      .parent()
      .within(() => {
        cy.contains(/must contain 10 numeric characters/i).should('exist');
      });

    //
    // 3. NOW ENTER VALID VALUES FOR ALL FIELDS AND SAVE
    //
    cy.get('#last_name').clear().type(newLast);
    cy.get('#first_name').clear().type(newFirst);
    cy.get('#middle_name').clear().type(newMiddle);
    cy.get('#prefix').clear().type(newPrefix);
    cy.get('#suffix').clear().type(newSuffix);

    cy.get('#street_1').clear().type(newStreet1);
    cy.get('#street_2').clear().type(newStreet2);
    cy.get('#city').clear().type(newCity);
    PageUtils.dropdownSetValue('#state', newState);
    cy.get('#zip').clear().type(newZip);
    setTelephone(newPhone);

    cy.get('#employer').clear().type(newEmployer);
    cy.get('#occupation').clear().type(newOccupation);

    PageUtils.clickButton('Save');

    ContactsHelpers.assertSuccessToastMessage();
    cy.contains(/Manage contacts/i).should('exist');

    // List row reflects new name + employer/occupation
    cy.contains('tbody tr', newDisplay)
      .should('exist')
      .within(() => {
        cy.get('td').eq(3).should('contain.text', newEmployer);
        cy.get('td').eq(4).should('contain.text', newOccupation);
      });

    // Re-open and verify all fields persisted
    PageUtils.clickKababItem(newDisplay, 'Edit');
    cy.contains(/Edit Contact/i).should('exist');

    cy.get('#last_name').should('have.value', newLast);
    cy.get('#first_name').should('have.value', newFirst);
    cy.get('#middle_name').should('have.value', newMiddle);
    cy.get('#prefix').should('have.value', newPrefix);
    cy.get('#suffix').should('have.value', newSuffix);

    cy.get('#street_1').should('have.value', newStreet1);
    cy.get('#street_2').should('have.value', newStreet2);
    cy.get('#city').should('have.value', newCity);
    cy.get('#zip').should('have.value', newZip);
    cy.contains('label', /^State\/Territory/i)
      .parent()
      .should('contain.text', newState);
    cy.contains('label', /^Telephone/i)
      .parent()
      .find('input')
      .last()
      .should('have.value', newPhone);

    cy.get('#employer').should('have.value', newEmployer);
    cy.get('#occupation').should('have.value', newOccupation);

    cy.contains('h2', 'Transaction history')
      .scrollIntoView()
      .parentsUntil('body')
      .last()
      .find('tbody tr')
      .should('have.length.at.least', 1);
  });

  it('shows Transaction History table in the contact details view', () => {
    PageUtils.clickKababItem(IND_DISPLAY, 'Edit');

    cy.contains(/Edit Contact/i).should('exist');

    cy.contains('h2', 'Transaction history')
      .should('exist')
      .parentsUntil('body')
      .last()
      .find('table')
      .first()
      .find('thead')
      .first()
      .within(() => {
        cy.contains('Type');
        cy.contains('Form');
        cy.contains('Report');
        cy.contains('Date');
        cy.contains('Amount');
      });
  });

  // CANDIDATE: required validation + update/check all editable fields (including office fields)
  it('validates required fields and updates all editable fields for a Candidate, persisting to list and edit form', () => {
    const originalCandidateId = Candidate_House_A.candidate_id as string;

    const newLast = `${CAND_LAST}-Upd`;
    const newFirst = `${CAND_FIRST}-Upd`;
    const newMiddle = 'CMiddle';
    const newPrefix = 'Sen.';
    const newSuffix = 'III';

    const newStreet1 = '111 Candidate Rd';
    const newStreet2 = 'Suite 200';
    const newCity = 'Springfield';
    const newState = 'Texas';
    const newZip = '77777';
    const newPhone = '5559876543';

    const newEmployer = `${updatedEmployerBase}-cand`;
    const newOccupation = `${updatedOccupationBase}-cand`;

    const newOffice = 'House';
    const newCandState = 'Texas';
    const newCandDistrict = '08';

    const newDisplay = `${newLast}, ${newFirst}`;

    const expectRequiredNearLabel = (labelRx: RegExp) => {
      cy.contains('label', labelRx)
        .parent()
        .within(() => {
          cy.contains(/This is a required field\./i).should('exist');
        });
    };

    PageUtils.clickKababItem(CAND_DISPLAY, 'Edit');
    cy.contains(/Edit Contact/i).should('exist');

    //
    // 1. Clear top-level required fields (including Candidate ID) and assert inline validation
    //
    cy.get('#candidate_id').should('have.value', originalCandidateId).clear();
    cy.get('#last_name').clear();
    cy.get('#first_name').clear();
    cy.get('#street_1').clear();
    cy.get('#city').clear();
    cy.get('#zip').clear();

    PageUtils.clickButton('Save');

    cy.contains(/Edit Contact/i).should('exist');
    expectRequiredNearLabel(/^Candidate ID/i);
    expectRequiredNearLabel(/^Last name/i);
    expectRequiredNearLabel(/^First name/i);
    expectRequiredNearLabel(/^Street address/i);
    expectRequiredNearLabel(/^City/i);
    expectRequiredNearLabel(/^Zip\/Postal code/i);

    //
    // 2. Office-specific required fields:
    //    Senate → Candidate state required, district not required
    //    House  → Candidate state and district required
    //

    // Switch to Senate; UI should clear state, district and require state only
    setDropdownByLabel(/^Candidate office/i, 'Senate');
    PageUtils.clickButton('Save');

    cy.contains(/Edit Contact/i).should('exist');
    expectRequiredNearLabel(/^Candidate state/i);
    cy.contains('label', /^Candidate district/i)
      .parent()
      .within(() => {
        cy.contains(/This is a required field\./i).should('not.exist');
      });

    // Switch to House; with blank office fields, state and district should now both be required
    setDropdownByLabel(/^Candidate office/i, 'House');
    PageUtils.clickButton('Save');

    cy.contains(/Edit Contact/i).should('exist');
    expectRequiredNearLabel(/^Candidate state/i);
    expectRequiredNearLabel(/^Candidate district/i);

    //
    // 3. Fill ALL fields with valid values and save
    //

    // Candidate ID back to valid original
    cy.get('#candidate_id').clear().type(originalCandidateId);

    // Contact name fields
    cy.get('#last_name').type(newLast);
    cy.get('#first_name').type(newFirst);
    cy.get('#middle_name').clear().type(newMiddle);
    cy.get('#prefix').clear().type(newPrefix);
    cy.get('#suffix').clear().type(newSuffix);

    // Address
    setDropdownByLabel(/^Country\/Region/i, 'United States of America');
    cy.get('#street_1').type(newStreet1);
    cy.get('#street_2').clear().type(newStreet2);
    cy.get('#city').type(newCity);
    PageUtils.dropdownSetValue('#state', newState);
    cy.get('#zip').type(newZip);
    setTelephone(newPhone);

    // Employer section
    cy.get('#employer').clear().type(newEmployer);
    cy.get('#occupation').clear().type(newOccupation);

    // Office fields – valid House combo
    setDropdownByLabel(/^Candidate office/i, newOffice);
    setDropdownByLabel(/^Candidate state/i, newCandState);
    setDropdownByLabel(/^Candidate district/i, newCandDistrict);

    PageUtils.clickButton('Save');

    ContactsHelpers.assertSuccessToastMessage();
    cy.contains(/Manage contacts/i).should('exist');

    // List row reflects new name and still shows Candidate type
    cy.contains('tbody tr', newDisplay)
      .should('exist')
      .within(() => {
        cy.get('td').eq(1).should('contain.text', 'Candidate');
      });

    //
    // 4. Re-open and verify everything persisted
    //
    PageUtils.clickKababItem(newDisplay, 'Edit');
    cy.contains(/Edit Contact/i).should('exist');

    cy.get('#candidate_id').should('have.value', originalCandidateId);
    cy.get('#last_name').should('have.value', newLast);
    cy.get('#first_name').should('have.value', newFirst);
    cy.get('#middle_name').should('have.value', newMiddle);
    cy.get('#prefix').should('have.value', newPrefix);
    cy.get('#suffix').should('have.value', newSuffix);

    cy.get('#street_1').should('have.value', newStreet1);
    cy.get('#street_2').should('have.value', newStreet2);
    cy.get('#city').should('have.value', newCity);
    cy.get('#zip').should('have.value', newZip);
    cy.contains('label', /^State\/Territory/i)
      .parent()
      .should('contain.text', newState);
    cy.contains('label', /^Telephone/i)
      .parent()
      .find('input')
      .last()
      .should('have.value', newPhone);

    cy.get('#employer').should('have.value', newEmployer);
    cy.get('#occupation').should('have.value', newOccupation);

    cy.contains('label', /^Candidate office/i)
      .parent()
      .should('contain.text', newOffice);
    cy.contains('label', /^Candidate state/i)
      .parent()
      .should('contain.text', newCandState);
    cy.contains('label', /^Candidate district/i)
      .parent()
      .should('contain.text', newCandDistrict);
  });

  //
  // COMMITTEE – required validation + update/check all editable fields
  //
  it('validates required fields and updates all editable fields for a Committee, persisting to list and edit form', () => {
    const newCommitteeId = 'C00000099';
    const newName = `${committeeDisplayName} Updated`;
    const newStreet1 = 'PO BOX 999';
    const newStreet2 = 'Suite 101';
    const newCity = 'Burlington';
    const newState = 'Vermont';
    const newZip = '05499';
    const newPhone = '5550001111';

    const expectRequiredNearLabel = (labelRx: RegExp) => {
      cy.contains('label', labelRx)
        .parent()
        .within(() => {
          cy.contains(/This is a required field\./i).should('exist');
        });
    };

    PageUtils.clickKababItem(committeeDisplayName, 'Edit');
    cy.contains(/Edit Contact/i).should('exist');

    //
    // 1. Clear required fields and assert inline validation
    //
    cy.get('#committee_id').clear();
    cy.get('#name').clear();
    cy.get('#street_1').clear();
    cy.get('#city').clear();
    cy.get('#zip').clear();

    PageUtils.clickButton('Save');

    cy.contains(/Edit Contact/i).should('exist');

    expectRequiredNearLabel(/^Committee ID/i);
    expectRequiredNearLabel(/^Name/i);
    expectRequiredNearLabel(/^Street address/i);
    expectRequiredNearLabel(/^City/i);
    expectRequiredNearLabel(/^Zip\/Postal code/i);

    // Committee ID should be marked invalid
    cy.get('#committee_id').should(($input) => {
      const ariaInvalid = $input.attr('aria-invalid');
      if (ariaInvalid) {
        expect(ariaInvalid).to.eq('true');
      }
    });

    //
    // 2. Fill ALL fields with valid data and save
    //
    cy.get('#committee_id').type(newCommitteeId);
    cy.get('#name').type(newName);

    setDropdownByLabel(/^Country\/Region/i, 'United States of America');
    cy.get('#street_1').type(newStreet1);
    cy.get('#street_2').clear().type(newStreet2);
    cy.get('#city').type(newCity);
    PageUtils.dropdownSetValue('#state', newState);
    cy.get('#zip').type(newZip);
    setTelephone(newPhone);

    PageUtils.clickButton('Save');

    ContactsHelpers.assertSuccessToastMessage();
    cy.contains(/Manage contacts/i).should('exist');

    // List row reflects new name and type
    cy.contains('tbody tr', newName)
      .should('exist')
      .within(() => {
        cy.get('td').eq(1).should('contain.text', 'Committee');
      });

    //
    // 3. Re-open and verify persisted values + Transaction history table visible
    //
    PageUtils.clickKababItem(newName, 'Edit');
    cy.contains(/Edit Contact/i).should('exist');

    cy.get('#committee_id').should('have.value', newCommitteeId);
    cy.get('#name').should('have.value', newName);
    cy.get('#street_1').should('have.value', newStreet1);
    cy.get('#street_2').should('have.value', newStreet2);
    cy.get('#city').should('have.value', newCity);
    cy.get('#zip').should('have.value', newZip);
    cy.contains('label', /^State\/Territory/i)
      .parent()
      .should('contain.text', newState);
    cy.contains('label', /^Telephone/i)
      .parent()
      .find('input')
      .last()
      .should('have.value', newPhone);

    // Transaction history section is present (rows may or may not exist)
    cy.contains('h2', 'Transaction history')
      .should('exist')
      .parentsUntil('body')
      .last()
      .find('table')
      .should('exist');
  });

  // ORGANIZATION: required validation + max length + update/check all editable fields
  it('validates required fields and max length, then updates all editable fields for an Organization and persists to list and edit form', () => {
    const newName = `${organizationDisplayName} Updated`;
    const newStreet1 = '1234 Org Updated Ln';
    const newStreet2 = 'Floor 3';
    const newCity = 'Orgville';
    const newState = 'Alabama';
    const newZip = '12345';
    const newPhone = '5552223333';

    const overlongName = 'a'.repeat(201); // > 200 chars

    const expectRequiredNearLabel = (labelRx: RegExp) => {
      cy.contains('label', labelRx)
        .parent()
        .within(() => {
          cy.contains(/This is a required field\./i).should('exist');
        });
    };

    PageUtils.clickKababItem(organizationDisplayName, 'Edit');
    cy.contains(/Edit Contact/i).should('exist');

    //
    // 1. Clear required fields and assert inline "This is a required field." messages
    //
    cy.get('#name').clear();
    cy.get('#street_1').clear();
    cy.get('#city').clear();
    cy.get('#zip').clear();

    PageUtils.clickButton('Save');

    cy.contains(/Edit Contact/i).should('exist');
    expectRequiredNearLabel(/^Name$/i);
    expectRequiredNearLabel(/^Street address/i);
    expectRequiredNearLabel(/^City/i);
    expectRequiredNearLabel(/^Zip\/Postal code/i);

    //
    // 2. Name max length: >200 chars should show "cannot contain more than 200 alphanumeric characters"
    //
    cy.get('#name').clear().type(overlongName);

    setDropdownByLabel(/^Country\/Region/i, 'United States of America');
    cy.get('#street_1').type(newStreet1);
    cy.get('#street_2').clear().type(newStreet2);
    cy.get('#city').type(newCity);
    PageUtils.dropdownSetValue('#state', newState);
    cy.get('#zip').type(newZip);
    setTelephone(newPhone);

    PageUtils.clickButton('Save');

    cy.contains(/Edit Contact/i).should('exist');
    cy.contains('label', /^Name$/i)
      .parent()
      .within(() => {
        cy.contains(/cannot contain more than 200 alphanumeric characters/i).should('exist');
      });

    //
    // 3. Fix name, save successfully, and verify list row
    //
    cy.get('#name').clear().type(newName);
    PageUtils.clickButton('Save');

    ContactsHelpers.assertSuccessToastMessage();
    cy.contains(/Manage contacts/i).should('exist');

    cy.contains('tbody tr', newName)
      .should('exist')
      .within(() => {
        cy.get('td').eq(1).should('contain.text', 'Organization');
      });

    //
    // 4. Re-open and verify persisted values + Transaction history table visible
    //
    PageUtils.clickKababItem(newName, 'Edit');
    cy.contains(/Edit Contact/i).should('exist');

    cy.get('#name').should('have.value', newName);
    cy.get('#street_1').should('have.value', newStreet1);
    cy.get('#street_2').should('have.value', newStreet2);
    cy.get('#city').should('have.value', newCity);
    cy.get('#zip').should('have.value', newZip);
    cy.contains('label', /^State\/Territory/i)
      .parent()
      .should('contain.text', newState);
    cy.contains('label', /^Telephone/i)
      .parent()
      .find('input')
      .last()
      .should('have.value', newPhone);

    // Transaction history section present for Organization too
    cy.contains('h2', 'Transaction history')
      .should('exist')
      .parentsUntil('body')
      .last()
      .find('table')
      .should('exist');
  });
});
