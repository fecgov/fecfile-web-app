import { Initialize } from '../../e2e-smoke/pages/loginPage';
import { ContactListPage } from '../../e2e-smoke/pages/contactListPage';
import { PageUtils } from '../../e2e-smoke/pages/pageUtils';
import { ContactsHelpers } from './contacts.helpers';
import { makeContact, makeTransaction } from '../../e2e-smoke/requests/methods';
import {
  Individual_A_A,
  Candidate_House_A,
  Candidate_House_B,
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
const IND_TXN_AMOUNT = 123;
const LOOKUP_CAND_LAST = 'House';
const LOOKUP_CAND_FIRST = 'Beth';

describe('Contacts Edit', () => {
  const updatedEmployerBase = `Updated Emp ${Date.now()}`;
  const updatedOccupationBase = `Updated Occ ${Date.now()}`;
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

    const lookupCandidateContact: MockContact = {
      ...Candidate_House_B,
      last_name: LOOKUP_CAND_LAST,
      first_name: LOOKUP_CAND_FIRST,
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

    // Create one Schedule A transaction so Transaction history is populated for Individual Contact
    makeContact(individualContact, (contactResp) => {
      const contact = contactResp.body;
      const today = new Date();
      const dateStr = today.toISOString().slice(0, 10);
      const txn = buildScheduleA(
        INDIVIDUAL_RECEIPT_TYPE,
        IND_TXN_AMOUNT,
        dateStr,
        contact,
        undefined,
        { report_ids: [] },
      );

      makeTransaction(txn);
    });

    makeContact(lookupCandidateContact);
    makeContact(candidateContact);
    makeContact(committeeContact);
    makeContact(organizationContact);

    ContactListPage.goToPage();
    ContactsHelpers.assertColumnHeaders(ContactsHelpers.CONTACTS_HEADERS);
  });

  type CandidateLookupStub = {
    candidate_id: string;
    office: string;
    name: string;
  };

  type CandidateLookupResult = {
    candidateId: string;
    last: string;
    first: string;
    display: string;
  };

  type AddressPhoneValues = {
    street1: string;
    street2: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
  };

  type PersonContactValues = AddressPhoneValues & {
    last: string;
    first: string;
    middle: string;
    prefix: string;
    suffix: string;
    employer: string;
    occupation: string;
  };

  type NamedContactValues = AddressPhoneValues & {
    name: string;
  };

  const selectCandidateViaLookup = (
    lookupCandidate: CandidateLookupStub,
    lookupCandidateDetails: Record<string, unknown>,
    seed = 'pre',
  ): Cypress.Chainable<CandidateLookupResult> => {
    ContactsHelpers.stubCandidateLookup(lookupCandidate);
    ContactsHelpers.stubCandidateDetails(lookupCandidateDetails);

    cy.get('input#searchBox')
      .should('be.visible')
      .clear()
      .type(seed, { delay: 50 });

    cy.wait('@candidateLookup');

    ContactsHelpers.pickAutocompleteOptionForInput('input#searchBox', {
      match: lookupCandidate.candidate_id,
    });

    cy.wait('@candidateDetails');
    cy.get('#candidate_id:visible').should('have.value', lookupCandidate.candidate_id);

    ContactsHelpers.ensureInputHasValue('#last_name', LOOKUP_CAND_LAST);
    ContactsHelpers.ensureInputHasValue('#first_name', LOOKUP_CAND_FIRST);

    return cy.get('#last_name:visible').invoke('val').then((lastVal) => {
      const last = (lastVal as string)?.trim() || LOOKUP_CAND_LAST;

      return cy.get('#first_name:visible').invoke('val').then((firstVal) => {
        const first = (firstVal as string)?.trim() || LOOKUP_CAND_FIRST;

        return {
          candidateId: lookupCandidate.candidate_id,
          last,
          first,
          display: `${last}, ${first}`,
        };
      });
    });
  };

  const assertCandidateRowInList = (display: string, candidateId: string) => {
    cy.contains('tbody tr', display)
      .should('be.visible')
      .within(() => {
        cy.get('td').eq(1).should('contain.text', 'CAN');
        cy.get('td').eq(2).should('contain.text', candidateId);
      });
  };

  const reopenAndAssertCandidateBasics = (display: string, candidateId: string, last: string, first: string) => {
    PageUtils.clickKababItem(display, 'Edit');
    cy.contains(/Edit Contact/i).should('be.visible');

    cy.get('#candidate_id:visible').should('have.value', candidateId);
    cy.get('#last_name:visible').should('have.value', last);
    cy.get('#first_name:visible').should('have.value', first);
  };

  const assertTelephoneValue = (phone: string) => {
    cy.contains('label', /^Telephone/i)
      .parent()
      .find('input')
      .last()
      .should('have.value', phone);
  };

  const assertAddressAndPhone = (v: AddressPhoneValues) => {
    cy.get('#street_1:visible').should('have.value', v.street1);
    cy.get('#street_2:visible').should('have.value', v.street2);
    cy.get('#city:visible').should('have.value', v.city);
    cy.get('#zip:visible').should('have.value', v.zip);
    cy.get('#state:visible').should('contain.text', v.state);
    assertTelephoneValue(v.phone);
  };

  const assertTransactionHistoryTableExists = () => {
    cy.contains('h2', 'Transaction history')
      .should('be.visible')
      .parentsUntil('body')
      .last()
      .find('table')
      .should('be.visible');
  };

  const assertPersonContactFormValues = (v: PersonContactValues) => {
    cy.get('#last_name:visible').should('have.value', v.last);
    cy.get('#first_name:visible').should('have.value', v.first);
    cy.get('#middle_name:visible').should('have.value', v.middle);
    cy.get('#prefix:visible').should('have.value', v.prefix);
    cy.get('#suffix:visible').should('have.value', v.suffix);

    assertAddressAndPhone(v);

    cy.get('#employer:visible').should('have.value', v.employer);
    cy.get('#occupation:visible').should('have.value', v.occupation);
  };

  const assertNamedContactFormValuesWithTxn = (v: NamedContactValues) => {
    cy.get('#name:visible').should('have.value', v.name);
    assertAddressAndPhone(v);
    assertTransactionHistoryTableExists();
  };

  const expectRequiredNearLabel = (labelRx: RegExp) => {
    cy.contains('label', labelRx)
      .parent()
      .within(() => {
        cy.contains(/This is a required field\./i).should('be.visible');
      });
  };

  function candidateLookup(lookupCandidateId: string, lookupLast: string, lookupFirst: string, lookupName: string) {
    // Candidate Lookup: deterministic selection (stubs)
    const lookupCandidate = {
      candidate_id: lookupCandidateId,
      office: 'H',
      name: lookupName,
    };

    const lookupCandidateDetails = {
      candidate_id: lookupCandidateId,
      candidate_first_name: lookupFirst,
      candidate_last_name: lookupLast,
      candidate_middle_name: null,
      candidate_prefix: null,
      candidate_suffix: null,
      address_street_1: '123 FEC API St',
      address_street_2: null,
      address_city: 'Richmond',
      address_state: 'VA',
      address_zip: '23219',
      office: 'H',
      state: 'VA',
      district: '01',
      name: lookupName,
    };

    selectCandidateViaLookup(lookupCandidate, lookupCandidateDetails).then(
      ({ candidateId, last, first, display }) => {
        ContactsHelpers.clickSaveAndHandleConfirm();

        ContactsHelpers.assertSuccessToastMessage();
        cy.contains(/Manage contacts/i).should('be.visible');

        assertCandidateRowInList(display, candidateId);
        reopenAndAssertCandidateBasics(display, candidateId, last, first);
      },
    );
  }

  // INDIVIDUAL: update/check all editable fields, required fields, length validation
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
    const newStateAbb = 'AL';
    const newZip = '54321';
    const newPhone = '5551234567';

    const newEmployer = `${updatedEmployerBase}-ind-all`;
    const newOccupation = `${updatedOccupationBase}-ind-all`;
    const newDisplay = `${newLast}, ${newFirst}`;
    const oldDisplay = `${IND_LAST}, ${IND_FIRST}`;

    const expectRequiredNearLabel = (labelRx: RegExp) => {
      ContactsHelpers.expectErrorNearLabel(labelRx, /This is a required field\./i);
    };

    const expectMaxErrorNearLabel = (labelRx: RegExp, text: RegExp) => {
      ContactsHelpers.expectErrorNearLabel(labelRx, text);
    };

    PageUtils.clickKababItem(IND_DISPLAY, 'Edit');
    cy.contains(/Edit Contact/i).should('be.visible');

    cy.get('#last_name:visible').clear();
    cy.get('#first_name:visible').clear();
    cy.get('#street_1:visible').clear();
    cy.get('#city:visible').clear();
    cy.get('#zip:visible').clear();

    ContactsHelpers.clickSaveAndHandleConfirm();

    cy.contains(/Edit Contact/i).should('be.visible');
    expectRequiredNearLabel(/^Last name/i);
    expectRequiredNearLabel(/^First name/i);
    expectRequiredNearLabel(/^Street address/i);
    expectRequiredNearLabel(/^City/i);
    expectRequiredNearLabel(/^Zip\/Postal code/i);

    const over30 = 'A'.repeat(31);
    const over20 = 'B'.repeat(21);
    const over10 = 'C'.repeat(11);
    const over34 = 'D'.repeat(35);
    const over38 = 'E'.repeat(39);
    const badPhone = '12345678901';

    cy.get('#last_name:visible').clear().type(over30);
    cy.get('#first_name:visible').clear().type(over20);
    cy.get('#middle_name:visible').clear().type(over20);
    cy.get('#prefix:visible').clear().type(over10);
    cy.get('#suffix:visible').clear().type(over10);

    ContactsHelpers.setDropdownByLabelIfPresent(/^Country(\/Region)?/i, 'United States of America');

    cy.get('#street_1:visible').clear().type(over34);
    cy.get('#street_2:visible').clear().type(over34);
    cy.get('#city:visible').clear().type(over30);
    PageUtils.pSelectDropdownSetValue('#state', newState);
    cy.get('#zip:visible').clear().type('0123456783');
    ContactsHelpers.setTelephone(badPhone);

    cy.get('#employer:visible').clear().type(over38);
    cy.get('#occupation:visible').clear().type(over38);

    ContactsHelpers.clickSaveAndHandleConfirm();

    cy.contains(/Edit Contact/i).should('be.visible');

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
    ContactsHelpers.expectErrorNearLabel(/^Telephone/i, /must contain 10 numeric characters/i);

    cy.get('#last_name:visible').clear().type(newLast);
    cy.get('#first_name:visible').clear().type(newFirst);
    cy.get('#middle_name:visible').clear().type(newMiddle);
    cy.get('#prefix:visible').clear().type(newPrefix);
    cy.get('#suffix:visible').clear().type(newSuffix);

    cy.get('#street_1:visible').clear().type(newStreet1);
    cy.get('#street_2:visible').clear().type(newStreet2);
    cy.get('#city:visible').clear().type(newCity);
    PageUtils.pSelectDropdownSetValue('#state', newState);
    cy.get('#zip:visible').clear().type(newZip);
    ContactsHelpers.setTelephone(newPhone);

    cy.get('#employer:visible').clear().type(newEmployer);
    cy.get('#occupation:visible').clear().type(newOccupation);

    PageUtils.clickButton('Save');
    ContactsHelpers.assertAndContinueConfirmModal(oldDisplay, [
      `Updated last name to ${newLast}`,
      `Updated first name to ${newFirst}`,
      `Updated middle name to ${newMiddle}`,
      `Updated prefix to ${newPrefix}`,
      `Updated suffix to ${newSuffix}`,
      `Updated street address to ${newStreet1}`,
      `Updated apartment, suite, etc. to ${newStreet2}`,
      `Updated city to ${newCity}`,
      `Updated state/territory to ${newStateAbb}`,
      `Updated zip/postal code to ${newZip}`,
      new RegExp(`Updated employer to ${newEmployer}`),
      new RegExp(`Updated occupation to ${newOccupation}`),
    ]);

    ContactsHelpers.assertSuccessToastMessage();
    cy.contains(/Manage contacts/i).should('be.visible');

    cy.contains('tbody tr', newDisplay)
      .should('be.visible')
      .within(() => {
        cy.get('td').eq(3).should('contain.text', newEmployer);
        cy.get('td').eq(4).should('contain.text', newOccupation);
      });

    PageUtils.clickKababItem(newDisplay, 'Edit');
    cy.contains(/Edit Contact/i).should('be.visible');

    assertPersonContactFormValues({
      last: newLast,
      first: newFirst,
      middle: newMiddle,
      prefix: newPrefix,
      suffix: newSuffix,
      street1: newStreet1,
      street2: newStreet2,
      city: newCity,
      state: newState,
      zip: newZip,
      phone: newPhone,
      employer: newEmployer,
      occupation: newOccupation,
    });

    ContactsHelpers.assertTransactionHistoryRow({
      type: /Individual Receipt/i,
      amount: IND_TXN_AMOUNT,
    });
  });

  // CANDIDATE: required validation, update/check all editable fields (including office fields)
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

    const lookupCandidateId = 'H0VA00001';
    const lookupLast = 'FecApiLnA';
    const lookupFirst = 'FecApiFnA';
    const lookupName = `${lookupLast}, ${lookupFirst}`;

    const expectRequiredNearLabel = (labelRx: RegExp) => {
      ContactsHelpers.fieldForLabel(labelRx).within(() => {
        cy.contains('This is a required field.').should('be.visible');
      });
    };

    PageUtils.clickKababItem(CAND_DISPLAY, 'Edit');
    cy.contains(/Edit Contact/i).should('be.visible');

    cy.get('#candidate_id:visible').should('have.value', originalCandidateId).clear();
    cy.get('#last_name:visible').clear();
    cy.get('#first_name:visible').clear();
    cy.get('#street_1:visible').clear();
    cy.get('#city:visible').clear();
    cy.get('#zip:visible').clear();

    ContactsHelpers.clickSaveAndHandleConfirm();

    cy.contains(/Edit Contact/i).should('be.visible');
    expectRequiredNearLabel(/^Candidate ID/i);
    expectRequiredNearLabel(/^Last name/i);
    expectRequiredNearLabel(/^First name/i);
    expectRequiredNearLabel(/^Street address/i);
    expectRequiredNearLabel(/^City/i);
    expectRequiredNearLabel(/^Zip\/Postal code/i);


    cy.get('select[id^="candidate_office-"]').select('Senate');
    ContactsHelpers.clickSaveAndHandleConfirm();
    cy.contains(/Edit Contact/i).should('be.visible');

    ContactsHelpers.fieldForLabel(/^Candidate district/i)
      .find('small.p-error, .p-error')
      .should('not.exist');

      
    cy.get('select[id^="candidate_office-"]').select('House');
    ContactsHelpers.clickSaveAndHandleConfirm();
    cy.contains(/Edit Contact/i).should('be.visible');

    expectRequiredNearLabel(/^Candidate district/i);


    cy.get('#candidate_id:visible').clear().type(originalCandidateId);

    cy.get('#last_name:visible').type(newLast);
    cy.get('#first_name:visible').type(newFirst);
    cy.get('#middle_name:visible').clear().type(newMiddle);
    cy.get('#prefix:visible').clear().type(newPrefix);
    cy.get('#suffix:visible').clear().type(newSuffix);

    ContactsHelpers.setDropdownByLabelIfPresent(/^Country(\/Region)?/i, 'United States of America');

    cy.get('#street_1:visible').type(newStreet1);
    cy.get('#street_2:visible').clear().type(newStreet2);
    cy.get('#city:visible').type(newCity);
    PageUtils.pSelectDropdownSetValue('#state', newState);
    cy.get('#zip:visible').type(newZip);
    ContactsHelpers.setTelephone(newPhone);

    cy.get('#employer:visible').clear().type(newEmployer);
    cy.get('#occupation:visible').clear().type(newOccupation);

    cy.get('select[id^="candidate_office-"]').select(newOffice);
    cy.get('select[id^="candidate_state-"]').select(newCandState);
    cy.get('select[id^="candidate_district-"]').select(newCandDistrict);

    ContactsHelpers.clickSaveAndHandleConfirm();

    ContactsHelpers.assertSuccessToastMessage();
    cy.contains(/Manage contacts/i).should('be.visible');

    cy.contains('tbody tr', newDisplay)
      .should('be.visible')
      .within(() => {
        cy.get('td').eq(1).should('contain.text', 'CAN');
        cy.get('td').eq(2).should('contain.text', originalCandidateId);
      });

    // Re-open and verify everything persisted
    PageUtils.clickKababItem(newDisplay, 'Edit');
    cy.contains(/Edit Contact/i).should('be.visible');

    cy.get('#candidate_id:visible').should('have.value', originalCandidateId);
    assertPersonContactFormValues({
      last: newLast,
      first: newFirst,
      middle: newMiddle,
      prefix: newPrefix,
      suffix: newSuffix,
      street1: newStreet1,
      street2: newStreet2,
      city: newCity,
      state: newState,
      zip: newZip,
      phone: newPhone,
      employer: newEmployer,
      occupation: newOccupation,
    });

    cy.get('select[id^="candidate_office-"]').find('selectedcontent').should('contain.text', newOffice);
    cy.get('select[id^="candidate_state-"]').find('selectedcontent').should('contain.text', newCandState);
    cy.get('select[id^="candidate_district-"]').parent().find('selectedcontent').should('contain.text', newCandDistrict);

    candidateLookup(lookupCandidateId, lookupLast, lookupFirst, lookupName);
  });

  // CANDIDATE LOOKUP: replace candidate via lookup search and persist new candidate details
  it('allows selecting a new Candidate via lookup and persists updated candidate fields', () => {
    const lookupCandidateId = 'H0VA00002';
    const lookupLast = 'FecApiLnB';
    const lookupFirst = 'FecApiFnB';
    const lookupName = `${lookupLast}, ${lookupFirst}`;

    PageUtils.clickKababItem(CAND_DISPLAY, 'Edit');
    cy.contains(/Edit Contact/i).should('be.visible');

    candidateLookup(lookupCandidateId, lookupLast, lookupFirst, lookupName);
    assertCandidateRowInList(lookupName, lookupCandidateId);
  });

  // COMMITTEE – required validation, update/check all editable fields
  it('validates required fields and updates all editable fields for a Committee, persisting to list and edit form', () => {
    const newCommitteeId = 'C00000099';
    const newName = `${committeeDisplayName} Updated`;
    const newStreet1 = 'PO BOX 999';
    const newStreet2 = 'Suite 101';
    const newCity = 'Burlington';
    const newState = 'Vermont';
    const newStateAbb = 'VT';
    const newZip = '05499';
    const newPhone = '5550001111';

    PageUtils.clickKababItem(committeeDisplayName, 'Edit');
    cy.contains(/Edit Contact/i).should('be.visible');

    cy.get('#committee_id:visible').clear();
    cy.get('#name:visible').clear();
    cy.get('#street_1:visible').clear();
    cy.get('#city:visible').clear();
    cy.get('#zip:visible').clear();

    ContactsHelpers.clickSaveAndHandleConfirm();

    cy.contains(/Edit Contact/i).should('be.visible');

    expectRequiredNearLabel(/^Committee ID/i);
    expectRequiredNearLabel(/^Name/i);
    expectRequiredNearLabel(/^Street address/i);
    expectRequiredNearLabel(/^City/i);
    expectRequiredNearLabel(/^Zip\/Postal code/i);

    cy.get('#committee_id:visible').should(($input) => {
      const ariaInvalid = $input.attr('aria-invalid');
      if (ariaInvalid) {
        expect(ariaInvalid).to.eq('true');
      }
    });

    cy.get('#committee_id:visible').type(newCommitteeId);
    cy.get('#name:visible').type(newName);

    ContactsHelpers.setDropdownByLabelIfPresent(/^Country(\/Region)?/i, 'United States of America');

    cy.get('#street_1:visible').type(newStreet1);
    cy.get('#street_2:visible').clear().type(newStreet2);
    cy.get('#city:visible').type(newCity);
    PageUtils.pSelectDropdownSetValue('#state', newState);
    cy.get('#zip:visible').type(newZip);
    ContactsHelpers.setTelephone(newPhone);

    PageUtils.clickButton('Save');
    ContactsHelpers.assertAndContinueConfirmModal(committeeDisplayName, [
      `Updated street address to ${newStreet1}`,
      `Updated apartment, suite, etc. to ${newStreet2}`,
      `Updated city to ${newCity}`,
      `Updated state/territory to ${newStateAbb}`,
      `Updated zip/postal code to ${newZip}`,
      `Updated telephone to +1 ${newPhone}`,
      `Updated committee id to ${newCommitteeId}`,
      `Updated name to ${newName}`,
    ]);

    ContactsHelpers.assertSuccessToastMessage();
    cy.contains(/Manage contacts/i).should('be.visible');

    cy.contains('tbody tr', newName)
      .should('be.visible')
      .within(() => {
        cy.get('td').eq(1).should('contain.text', 'COM');
        cy.get('td').eq(2).should('contain.text', newCommitteeId);
      });

    PageUtils.clickKababItem(newName, 'Edit');
    cy.contains(/Edit Contact/i).should('be.visible');

    cy.get('#committee_id:visible').should('have.value', newCommitteeId);
    assertNamedContactFormValuesWithTxn({
      name: newName,
      street1: newStreet1,
      street2: newStreet2,
      city: newCity,
      state: newState,
      zip: newZip,
      phone: newPhone,
    });
  });

  // ORGANIZATION: required validation, max length, update/check all editable fields
  it('validates required fields and max length, then updates all editable fields for an Organization and persists to list and edit form', () => {
    const newName = `${organizationDisplayName} Updated`;
    const newStreet1 = '1234 Org Updated Ln';
    const newStreet2 = 'Floor 3';
    const newCity = 'Orgville';
    const newState = 'Alabama';
    const newStateAbb = 'AL';
    const newZip = '12345';
    const newPhone = '5552223333';

    const overlongName = 'a'.repeat(201);

    PageUtils.clickKababItem(organizationDisplayName, 'Edit');
    cy.contains(/Edit Contact/i).should('be.visible');

    cy.get('#name:visible').clear();
    cy.get('#street_1:visible').clear();
    cy.get('#city:visible').clear();
    cy.get('#zip:visible').clear();

    ContactsHelpers.clickSaveAndHandleConfirm();

    cy.contains(/Edit Contact/i).should('be.visible');
    expectRequiredNearLabel(/^Name$/i);
    expectRequiredNearLabel(/^Street address/i);
    expectRequiredNearLabel(/^City/i);
    expectRequiredNearLabel(/^Zip\/Postal code/i);

    cy.get('#name:visible').clear().type(overlongName);

    ContactsHelpers.setDropdownByLabelIfPresent(/^Country(\/Region)?/i, 'United States of America');

    cy.get('#street_1:visible').type(newStreet1);
    cy.get('#street_2:visible').clear().type(newStreet2);
    cy.get('#city:visible').type(newCity);
    PageUtils.pSelectDropdownSetValue('#state', newState);
    cy.get('#zip:visible').type(newZip);
    ContactsHelpers.setTelephone(newPhone);

    ContactsHelpers.clickSaveAndHandleConfirm();

    cy.contains(/Edit Contact/i).should('be.visible');
    cy.contains('label', /^Name$/i)
      .parent()
      .within(() => {
        cy.contains(/cannot contain more than 200 alphanumeric characters/i).should('be.visible');
      });

    cy.get('#name:visible').clear().type(newName);

    PageUtils.clickButton('Save');
    ContactsHelpers.assertAndContinueConfirmModal(organizationDisplayName, [
      `Updated street address to ${newStreet1}`,
      `Updated apartment, suite, etc. to ${newStreet2}`,
      `Updated city to ${newCity}`,
      `Updated state/territory to ${newStateAbb}`,
      `Updated telephone to +1 ${newPhone}`,
      `Updated name to ${newName}`,
    ]);

    ContactsHelpers.assertSuccessToastMessage();
    cy.contains(/Manage contacts/i).should('be.visible');

    cy.contains('tbody tr', newName)
      .should('be.visible')
      .within(() => {
        cy.get('td').eq(1).should('contain.text', 'ORG');
      });

    PageUtils.clickKababItem(newName, 'Edit');
    cy.contains(/Edit Contact/i).should('be.visible');

    assertNamedContactFormValuesWithTxn({
      name: newName,
      street1: newStreet1,
      street2: newStreet2,
      city: newCity,
      state: newState,
      zip: newZip,
      phone: newPhone,
    });
  });
});
