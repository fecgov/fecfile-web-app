import { Initialize } from '../../e2e-smoke/pages/loginPage';
import { ContactListPage } from '../../e2e-smoke/pages/contactListPage';
import { currentYear, PageUtils } from '../../e2e-smoke/pages/pageUtils';
import { ContactsHelpers } from './contacts.helpers';

import { makeContact, makeF3x } from '../../e2e-smoke/requests/methods';
import { F3X_Q2 } from '../../e2e-smoke/requests/library/reports';
import { Individual_A_A, MockContact } from '../../e2e-smoke/requests/library/contacts';

import { ReportListPage } from '../../e2e-smoke/pages/reportListPage';
import { StartTransaction } from '../../e2e-smoke/F3X/utils/start-transaction/start-transaction';
import { ContactLookup } from '../../e2e-smoke/pages/contactLookup';

import {
  defaultScheduleFormData,
  ScheduleFormData,
} from '../../e2e-smoke/models/TransactionFormModel';
import { TransactionDetailPage } from '../../e2e-smoke/pages/transactionDetailPage';

type Address = {
  street1: string;
  city: string;
  state: string;
  zip: string;
};

type CreateContactWhich = 'first' | 'last';
type ContactTypeLower = 'individual' | 'committee' | 'organization';
type ContactLookupType = 'Individual' | 'Organization' | 'Committee';
type DisbursementDateField = 'expenditure_date' | 'disbursement_date';

const DEFAULT_TIMEOUT = 15000;

const normalizeWhitespace = (s: string) => s.replaceAll(/\s+/g, ' ').trim();
const normalizeNbsp = (s: string) => s.replaceAll('\u00a0', ' ');
const normalizeText = (s: string) => normalizeWhitespace(normalizeNbsp(s));
const tightenHyphens = (s: string) => normalizeText(s).replaceAll(/-\s+/g, '-');

const hasVisibleDialogMatching = ($body: JQuery<HTMLElement>, rx: RegExp): boolean => {
  const dialogs = $body.find('.p-dialog:visible').toArray();
  for (let i = 0; i < dialogs.length; i += 1) {
    const txt = dialogs[i].textContent ?? '';
    if (rx.test(txt)) return true;
  }
  return false;
};

const getVisibleConfirmDialog = () =>
  cy
    .contains('.p-dialog-title', /^Confirm$/i, { timeout: DEFAULT_TIMEOUT })
    .should('be.visible')
    .closest('.p-confirm-dialog, .p-dialog');

const openCreateContactModal = (which: CreateContactWhich = 'first') => {
  cy.get('body').then(($body) => {
    const $containers = $body.find('.contact-lookup-container');

    if ($containers.length > 0) {
      const $target = which === 'last' ? $containers.last() : $containers.first();
      cy.wrap($target)
        .contains(/Create a new contact/i, { timeout: DEFAULT_TIMEOUT })
        .scrollIntoView()
        .click({ force: true });
      return;
    }

    cy.contains(/Create a new contact/i, { timeout: DEFAULT_TIMEOUT })
      .scrollIntoView()
      .click({ force: true });
  });

  cy.contains('.p-dialog', /Create a new contact/i, { timeout: DEFAULT_TIMEOUT })
    .filter(':visible')
    .should('be.visible')
    .as('createContactDialog');
};

const fillCommonRequiredAddressInDialog = (dialogAlias: string, address: Address) => {
  cy.get(dialogAlias).find('#street_1').clear().type(address.street1);
  cy.get(dialogAlias).find('#city').clear().type(address.city);
  cy.get(dialogAlias).find('#zip').clear().type(address.zip);

  cy.get(dialogAlias)
    .find('#state')
    .then(($state) => {
      if ($state.length === 0) return;
      cy.wrap($state)
        .click({ force: true })
        .type('{downarrow}{enter}', { force: true });
    });
};

const saveCreateContactDialog = () => {
  cy.get('@createContactDialog')
    .contains('button', /Save\s*&\s*continue/i)
    .should('be.enabled')
    .click({ force: true });

  cy.get('body', { timeout: DEFAULT_TIMEOUT }).should(($body) => {
    expect(hasVisibleDialogMatching($body, /Create a new contact/i)).to.eq(false);
  });
};

const findFirstAnchorMatching = ($body: JQuery<HTMLElement>, rx: RegExp): HTMLAnchorElement | null => {
  const anchors = $body.find('a').toArray();
  for (let i = 0; i < anchors.length; i += 1) {
    const txt = (anchors[i].textContent || '').trim();
    if (rx.test(txt)) return anchors[i] as HTMLAnchorElement;
  }
  return null;
};

const findAndClickTransactionLink = (txnLinkRx: RegExp): Cypress.Chainable<boolean> => {
  return cy.get('body').then(($body) => {
    const link = findFirstAnchorMatching($body, txnLinkRx);

    if (!link) {
      return cy.wrap(false, { log: false });
    }

    return cy
      .wrap(link)
      .scrollIntoView()
      .click({ force: true })
      .then(() => true);
  });
};

const expandAccordionsAndTryClickLink = (txnLinkRx: RegExp): Cypress.Chainable<boolean> => {
  return cy
    .get('body')
    .then(($body): void => {
      const $headers = $body.find('p-accordion-header');

      if ($headers.length === 0) return;

      cy.wrap($headers).each(($h) => {
        if ($h.attr('aria-expanded') === 'false') {
          cy.wrap($h).scrollIntoView().click({ force: true });
        }
      });
    })
    .then(() => findAndClickTransactionLink(txnLinkRx));
};

const clickTransactionLinkOnSelectPage = (txnLinkRx: RegExp): Cypress.Chainable<boolean> => {
  return findAndClickTransactionLink(txnLinkRx)
    .then((found): Cypress.Chainable<boolean> => {
      if (found) return cy.wrap(true, { log: false });
      return expandAccordionsAndTryClickLink(txnLinkRx);
    })
    .then((found) => {
      if (!found) throw new Error(`Could not find transaction link matching: ${txnLinkRx}`);
      return true;
    });
};

const goToTransactionCreateFromList = (panelMenuRx: RegExp, txnLinkRx: RegExp) => {
  cy.get('p-panelmenu', { timeout: DEFAULT_TIMEOUT }).should('exist');

  cy.contains('a', panelMenuRx, { timeout: DEFAULT_TIMEOUT })
    .first()
    .scrollIntoView()
    .click({ force: true });

  cy.url({ timeout: DEFAULT_TIMEOUT }).should('include', '/select/');
  clickTransactionLinkOnSelectPage(txnLinkRx);
  cy.url({ timeout: DEFAULT_TIMEOUT }).should('include', '/create/');
};

const resolveDisbursementDateField = (): Cypress.Chainable<DisbursementDateField> => {
  return cy.get('body').then(($body) => {
    if ($body.find('[data-cy="expenditure_date"]').length) return 'expenditure_date';
    if ($body.find('[data-cy="disbursement_date"]').length) return 'disbursement_date';
    return 'expenditure_date';
  });
};

const assertTxnRowByContact = (contactDisplay: string, expectedType: RegExp, amount: number) => {
  const amountStr = `$${amount.toFixed(2)}`;

  cy.contains('tbody tr', contactDisplay, { timeout: DEFAULT_TIMEOUT })
    .should('exist')
    .within(() => {
      cy.get('td').eq(1).invoke('text').should('match', expectedType);
      cy.contains(amountStr).should('exist');
    });
};

const assertContactsListRow = (name: string, type: string, fecId?: string) => {
  cy.contains('tbody tr', name, { timeout: DEFAULT_TIMEOUT })
    .should('exist')
    .within(() => {
      cy.get('td').eq(1).should('contain.text', type);
      if (fecId) cy.get('td').eq(2).should('contain.text', fecId);
    });
};

const assertCreatesNewContactConfirmMessage = (
  contactTypeLower: ContactTypeLower,
  contactDisplay: string,
) => {
  getVisibleConfirmDialog().within(() => {
    cy.get('[data-pc-section="message"], .p-confirm-dialog-message').should(($msg) => {
      const text = normalizeText($msg.text());

      const rx = new RegExp(
        String.raw`By saving this transaction, you.?re also creating a new ${contactTypeLower} contact for ${ContactsHelpers.escapeRegExp(
          contactDisplay,
        )}\.?$`,
        'i',
      );

      expect(text).to.match(rx);
    });
  });
};

const clickSaveAndConfirmCreatesNewContact = (
  reportId: string,
  contactTypeLower: ContactTypeLower,
  contactDisplay: string,
) => {
  cy.intercept(
    'GET',
    `**/api/v1/transactions/?page=1&ordering=line_label,created&page_size=5&report_id=${reportId}&schedules=A`,
  ).as('GetReceipts');

  cy.intercept(
    'GET',
    `**/api/v1/transactions/?page=1&ordering=line_label,created&page_size=5&report_id=${reportId}&schedules=C,D`,
  ).as('GetLoans');

  cy.intercept(
    'GET',
    `**/api/v1/transactions/?page=1&ordering=line_label,created&page_size=5&report_id=${reportId}&schedules=B,E,F`,
  ).as('GetDisbursements');

  PageUtils.clickButton('Save');

  assertCreatesNewContactConfirmMessage(contactTypeLower, contactDisplay);

  PageUtils.clickButton('Continue');

  cy.wait('@GetLoans');
  cy.wait('@GetDisbursements');
  cy.wait('@GetReceipts');
};

const assertSuggestedChangesConfirmDialog = (displayName: string, expectedItems: string[]) => {
  getVisibleConfirmDialog().within(() => {
    cy.get('[data-pc-section="message"]').should(($msg) => {
      const full = tightenHyphens($msg.text());
      expect(full).to.include('Change(s):');

      const [intro] = full.split('Change(s):');

      expect(normalizeText(intro)).to.eq(
        `Your suggested changes for ${displayName} will affect all transactions involving this contact.`,
      );
    });

    cy.get('[data-pc-section="message"]')
      .find('b')
      .first()
      .should(($b) => {
        expect(normalizeText($b.text())).to.eq(displayName);
      });

    cy.get('ul.contact-confirm-dialog li').should('have.length.at.least', expectedItems.length);

    for (let i = 0; i < expectedItems.length; i += 1) {
      cy.get('ul.contact-confirm-dialog li')
        .eq(i)
        .should(($li) => {
          expect(tightenHyphens($li.text())).to.eq(expectedItems[i]);
        });
    }
  });
};

// --- helpers for the xit (kept at top-level so lint still passes) ---
const selectContactLookupType = (type: ContactLookupType) => {
  cy.get('select').then(($selects) => {
    const selects = $selects.toArray() as HTMLSelectElement[];
    let found: HTMLSelectElement | undefined;

    for (let i = 0; i < selects.length; i += 1) {
      const sel = selects[i];
      const opts = new Set<string>();

      for (let j = 0; j < sel.options.length; j += 1) {
        opts.add(sel.options[j].text.trim());
      }

      if (opts.has('Individual') && opts.has('Organization') && opts.has('Committee')) {
        found = sel;
        break;
      }
    }

    expect(found, 'Contact Lookup type <select>').to.exist;
    cy.wrap(found as HTMLSelectElement).select(type);
  });
};

const fillInputByLabel = (label: RegExp, value: string) => {
  cy.contains('label', label)
    .should('be.visible')
    .then(($label) => {
      const forAttr = $label.attr('for');
      if (forAttr) {
        cy.get(`#${forAttr}`).clear().type(value);
        return;
      }
      cy.wrap($label).parent().find('input,textarea').first().clear().type(value);
    });
};

const selectByLabel = (label: RegExp, value: string) => {
  cy.contains('label', label)
    .should('be.visible')
    .then(($label) => {
      const forAttr = $label.attr('for');
      if (forAttr) {
        cy.get(`#${forAttr}`).select(value);
        return;
      }
      cy.wrap($label).parent().find('select').first().select(value);
    });
};

describe('Contacts: Transactions integration', () => {
  beforeEach(() => {
    Initialize();
  });

  it('creates Individual, Committee, and Organization contacts inside a transaction, completes each transaction, then verifies in Contacts list', () => {
    const unique = Date.now();
    const uniq = String(unique).slice(-6);

    const individual = {
      last: `TxnIndLn${uniq}`,
      first: `TxnIndFn${uniq}`,
      display: `TxnIndLn${uniq}, TxnIndFn${uniq}`,
    };

    const committee = {
      id: `C${uniq.padStart(8, '0')}`, // C########
      name: `Txn Committee ${uniq}`,
      display: `Txn Committee ${uniq}`,
    };

    const organization = {
      name: `Txn Organization ${uniq}`,
      display: `Txn Organization ${uniq}`,
    };

    const address: Address = {
      street1: '123 Test Ln',
      city: 'Testville',
      state: 'Texas',
      zip: '12345',
    };

    const txnDate = new Date(currentYear, 4 - 1, 27);

    let reportId: string | undefined;
    makeF3x(F3X_Q2, (resp) => {
      reportId = resp.body.id;
    });

    cy.then(() => {
      expect(reportId, 'reportId').to.exist;
      const rid = reportId as string;

      // INDIVIDUAL RECEIPT
      ReportListPage.goToReportList(rid);
      goToTransactionCreateFromList(/Add a receipt/i, /Individual Receipt/i);
      cy.contains(/Individual Receipt/i).should('exist');

      openCreateContactModal('first');
      cy.get('@createContactDialog').find('#last_name').clear().type(individual.last);
      cy.get('@createContactDialog').find('#first_name').clear().type(individual.first);
      fillCommonRequiredAddressInDialog('@createContactDialog', address);
      saveCreateContactDialog();

      const indData: ScheduleFormData = {
        amount: 10,
        date_received: txnDate,
        electionType: undefined,
        electionYear: undefined,
        election_other_description: '',
        purpose_description: 'E2E receipt',
        memo_code: false,
        memo_text: '',
        category_code: '',
      };

      TransactionDetailPage.enterScheduleFormData(indData, false, '', true, 'contribution_date');
      clickSaveAndConfirmCreatesNewContact(rid, 'individual', individual.display);

      cy.url({ timeout: DEFAULT_TIMEOUT }).should('include', `/reports/transactions/report/${rid}/list`);
      assertTxnRowByContact(individual.display, /Individual Receipt/i, 10);

      // TRANSFER
      ReportListPage.goToReportList(rid);
      goToTransactionCreateFromList(/Add a receipt/i, /^Transfer$/i);
      cy.contains('h1', 'Transfer').should('exist');

      openCreateContactModal('first');
      cy.get('@createContactDialog').find('#committee_id').clear().type(committee.id);
      cy.get('@createContactDialog').find('#name').clear().type(committee.name);
      fillCommonRequiredAddressInDialog('@createContactDialog', address);
      saveCreateContactDialog();

      const transferData: ScheduleFormData = {
        amount: 30,
        date_received: txnDate,
        electionType: undefined,
        electionYear: undefined,
        election_other_description: '',
        purpose_description: 'E2E transfer',
        memo_code: false,
        memo_text: '',
        category_code: '',
      };

      TransactionDetailPage.enterScheduleFormData(transferData, false, '', true, 'contribution_date');
      clickSaveAndConfirmCreatesNewContact(rid, 'committee', committee.display);

      cy.url({ timeout: DEFAULT_TIMEOUT }).should('include', `/reports/transactions/report/${rid}/list`);
      assertTxnRowByContact(committee.display, /Transfer/i, 30);

      // OPERATING EXPENDITURE
      ReportListPage.goToReportList(rid);
      goToTransactionCreateFromList(/Add a disbursement/i, /Operating Expenditure/i);
      cy.contains(/Operating Expenditure/i).should('exist');

      openCreateContactModal('first');
      cy.get('@createContactDialog').find('#name').clear().type(organization.name);
      fillCommonRequiredAddressInDialog('@createContactDialog', address);
      saveCreateContactDialog();

      const opExpData: ScheduleFormData = {
        amount: 40,
        date_received: txnDate,
        electionType: undefined,
        electionYear: undefined,
        election_other_description: '',
        purpose_description: 'E2E op exp',
        memo_code: false,
        memo_text: '',
        category_code: '',
      };

      resolveDisbursementDateField().then((dateField) => {
        TransactionDetailPage.enterScheduleFormData(opExpData, false, '', true, dateField);
      });

      clickSaveAndConfirmCreatesNewContact(rid, 'organization', organization.display);

      cy.url({ timeout: DEFAULT_TIMEOUT }).should('include', `/reports/transactions/report/${rid}/list`);
      assertTxnRowByContact(organization.display, /Operating Expenditure/i, 40);

      // Final verification: Contacts list
      ContactListPage.goToPage();
      ContactsHelpers.assertColumnHeaders(ContactsHelpers.CONTACTS_HEADERS);

      assertContactsListRow(individual.display, 'Individual');
      assertContactsListRow(committee.display, 'Committee', committee.id);
      assertContactsListRow(organization.display, 'Organization');
    });
  });

  it('creating an Individual receipt transaction w/ aggregate >$200 updates contact employer and occupation', () => {
    const unique = Date.now();
    const id = unique % 1000000;

    const lastName = `TxnLn${id}`;
    const firstName = `TxnFn${id}`;
    const displayName = `${lastName}, ${firstName}`;
    const newEmployer = `Employer-${id}`;
    const newOccupation = `Occupation-${id}`;

    const contactPayload: MockContact & {
      employer?: string | null;
      occupation?: string | null;
    } = {
      ...Individual_A_A,
      last_name: lastName,
      first_name: firstName,
      employer: '',
      occupation: '',
    };

    makeContact(contactPayload);

    let reportId: string | undefined;
    makeF3x(F3X_Q2, (resp) => {
      reportId = resp.body.id;
    });

    cy.then(() => {
      expect(reportId, 'F3X report id should be defined').to.exist;

      const rid = reportId as string;

      cy.intercept('GET', '**/api/v1/transactions/previous/entity/**').as('getPrevAggregate');

      ReportListPage.goToReportList(rid);
      StartTransaction.Receipts().Individual().IndividualReceipt();

      cy.contains('Individual Receipt').should('exist');
      ContactLookup.getContact(lastName);

      const scheduleData: ScheduleFormData = {
        ...defaultScheduleFormData,
        amount: 250,
        electionYear: undefined,
        electionType: undefined,
        date_received: new Date(currentYear, 4 - 1, 27),
        purpose_description: '',
        memo_text: '',
      };

      TransactionDetailPage.enterScheduleFormData(scheduleData, false, '', false, 'contribution_date');

      cy.wait('@getPrevAggregate');

      cy.get('#employer').should('have.value', '').click();
      cy.get('#occupation').should('have.value', '').click();

      cy.contains('button', 'Save').scrollIntoView();
      PageUtils.clickButton('Save');

      cy.url().should('include', `report/${rid}/create/INDIVIDUAL_RECEIPT`);
      cy.contains(/employer.*required|this is a required field\./i, { timeout: 10000 }).should('exist');
      cy.contains(/occupation.*required|this is a required field\./i, { timeout: 10000 }).should('exist');

      cy.get('#employer').type(newEmployer);
      cy.get('#occupation').type(newOccupation);

      PageUtils.clickButton('Save');

      assertSuggestedChangesConfirmDialog(displayName, [
        `Updated employer to ${newEmployer}`,
        `Updated occupation to ${newOccupation}`,
      ]);

      PageUtils.clickButton('Continue');

      cy.contains('tbody tr', 'Individual Receipt')
        .should('contain.text', displayName)
        .and('contain.text', `$${scheduleData.amount.toFixed(2)}`);

      ContactListPage.goToPage();
      ContactsHelpers.assertColumnHeaders(ContactsHelpers.CONTACTS_HEADERS);

      cy.contains('tbody tr', displayName)
        .should('exist')
        .within(() => {
          cy.get('td').eq(3).should('contain.text', newEmployer);
          cy.get('td').eq(4).should('contain.text', newOccupation);
        });

      cy.intercept('GET', '**/api/v1/transactions/?**contact=*').as('getContactTxns');
      PageUtils.clickKababItem(displayName, 'Edit');
      cy.contains(/Edit Contact/i).should('exist');

      cy.wait('@getContactTxns');

      cy.get('#employer').should('have.value', newEmployer);
      cy.get('#occupation').should('have.value', newOccupation);

      ContactsHelpers.assertTransactionHistoryRow({
        type: /Individual Receipt/i,
        form: /Form\s*3X/i,
        report: /JULY 15 QUARTERLY/i,
        date: '04/27/2025',
        amount: /\$250\.00/,
      });
    });
  });

  // waiting on bug fix for FECFILE-2685
  xit('switching Contact Lookup type before first save (Individual → Committee) [OTHER_RECEIPT]', () => {
    const reportId = '98c197fb-8304-42b2-9963-28ff0905474b';
    cy.visit(`/reports/transactions/report/${reportId}/create/OTHER_RECEIPT`);

    selectContactLookupType('Individual');
    cy.contains(/Create a new contact/i).click();

    fillInputByLabel(/LAST NAME/i, 'ABBOTT');
    fillInputByLabel(/FIRST NAME/i, 'MARTHA');
    fillInputByLabel(/MIDDLE NAME/i, 'Francis');
    fillInputByLabel(/PREFIX/i, 'Miss');
    fillInputByLabel(/SUFFIX/i, 'Sr');

    fillInputByLabel(/STREET ADDRESS/i, '920 MAIN STREET suite');
    fillInputByLabel(/APARTMENT, SUITE/i, 'Apt B');
    fillInputByLabel(/^CITY$/i, 'Michigan');
    selectByLabel(/STATE\/TERRITORY/i, 'Kentucky');
    fillInputByLabel(/ZIP\/POSTAL CODE/i, '76543');

    selectContactLookupType('Committee');

    cy.contains('label', /COMMITTEE NAME/i).should('be.visible');
    fillInputByLabel(/COMMITTEE NAME/i, "Testing of Guarantor's");
    fillInputByLabel(/AMOUNT/i, '100');
    fillInputByLabel(/DATE RECEIVED/i, '03/31/2024');

    cy.intercept('POST', '**/transactions/**').as('saveTransaction');

    cy.contains('button', /^Save$/).scrollIntoView().click();

    cy.contains(/You suggested changes for/i).should('not.exist');
    cy.contains(/^Confirm$/i).should('not.exist');

    cy.wait('@saveTransaction')
      .its('response.statusCode')
      .should('be.oneOf', [200, 201]);
  });
});
