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

    const address = {
      street1: '123 Test Ln',
      city: 'Testville',
      state: 'Texas',
      zip: '12345',
    };

    const txnDate = new Date(currentYear, 4 - 1, 27);

    const openCreateContactModal = (which: 'first' | 'last' = 'first') => {
      cy.get('body').then(($body) => {
        const $containers = $body.find('.contact-lookup-container');

        if ($containers.length) {
          const $target =
            which === 'last'
              ? $containers.eq($containers.length - 1)
              : $containers.eq(0);

          cy.wrap($target).within(() => {
            cy.contains(/Create a new contact/i, { timeout: 15000 })
              .scrollIntoView()
              .click({ force: true });
          });
        } else {
          cy.contains(/Create a new contact/i, { timeout: 15000 })
            .scrollIntoView()
            .click({ force: true });
        }
      });

      cy.contains('.p-dialog', /Create a new contact/i, { timeout: 15000 })
        .filter(':visible')
        .should('be.visible')
        .as('createContactDialog');
    };

    const fillCommonRequiredAddressInDialog = (dialogAlias: string) => {
      cy.get(dialogAlias).within(() => {
        cy.get('#street_1').clear().type(address.street1);
        cy.get('#city').clear().type(address.city);
        cy.get('#zip').clear().type(address.zip);
      });

      cy.get('body').then(($body) => {
        const $dlg = $body.find('.p-dialog:visible');
        if ($dlg.find('#state').length) {
          cy.wrap($dlg)
            .find('#state')
            .click({ force: true })
            .type('{downarrow}{enter}', { force: true });
        }
      });
    };

    const saveCreateContactDialog = () => {
      cy.get('@createContactDialog').within(() => {
        cy.contains('button', /Save\s*&\s*continue/i)
          .should('be.enabled')
          .click({ force: true });
      });

      cy.get('body', { timeout: 15000 }).should(($body) => {
        const stillOpen = $body
          .find('.p-dialog:visible')
          .toArray()
          .some((el) => /Create a new contact/i.test(el.textContent ?? ''));
        expect(stillOpen).to.eq(false);
      });
    };

    const clickTransactionLinkOnSelectPage = (
      txnLinkRx: RegExp,
    ): Cypress.Chainable<boolean> => {
      const tryFindAndClick = (): Cypress.Chainable<boolean> => {
        return cy.get('body').then(($body) => {
          const $link = $body
            .find('a')
            .filter((_, el) => txnLinkRx.test((el.textContent || '').trim()));

          if ($link.length) {
            return cy
              .wrap($link.first())
              .scrollIntoView()
              .click({ force: true })
              .then(() => true);
          }
          return cy.wrap(false);
        });
      };

      const openHeaderAndRetry = (idx: number): Cypress.Chainable<boolean> => {
        return cy.get('p-accordion-header').then(($headers) => {
          const len = $headers.length;
          if (!len) return cy.wrap(false);
          if (idx >= len) return cy.wrap(false);
          const $h = $headers.eq(idx);
          return cy
            .wrap($h)
            .scrollIntoView()
            .then(($header) => {
              if ($header.attr('aria-expanded') === 'false') {
                return cy.wrap($header).click({ force: true });
              }
              return cy.wrap(null);
            })
            .then(() => tryFindAndClick())
            .then((found) => (found ? cy.wrap(true) : openHeaderAndRetry(idx + 1)));
        });
      };

      return tryFindAndClick()
        .then((found) => (found ? cy.wrap(true) : openHeaderAndRetry(0)))
        .then((found) => {
          if (!found) throw new Error(`Could not find transaction link matching: ${txnLinkRx}`);
          return true;
        });
    };

    const goToTransactionCreateFromList = (panelMenuRx: RegExp, txnLinkRx: RegExp) => {
      cy.get('p-panelmenu', { timeout: 15000 }).should('exist');
      cy.contains('a', panelMenuRx, { timeout: 15000 })
        .first()
        .scrollIntoView()
        .click({ force: true });

      cy.url({ timeout: 15000 }).should('include', '/select/');
      clickTransactionLinkOnSelectPage(txnLinkRx);
      cy.url({ timeout: 15000 }).should('include', '/create/');
    };

    const resolveDisbursementDateField = (): Cypress.Chainable<string> => {
      return cy.get('body').then(($body): string => {
        if ($body.find('[data-cy="expenditure_date"]').length) return 'expenditure_date';
        if ($body.find('[data-cy="disbursement_date"]').length) return 'disbursement_date';
        return 'expenditure_date';
      });
    };

    const assertTxnRowByContact = (
      contactDisplay: string,
      expectedType: RegExp,
      amount: number,
    ) => {
      const amountStr = `$${amount.toFixed(2)}`;
      cy.contains('tbody tr', contactDisplay, { timeout: 15000 })
        .should('exist')
        .within(() => {
          cy.get('td').eq(1).invoke('text').should('match', expectedType);
          cy.contains(amountStr).should('exist');
        });
    };

    let reportId: string | undefined;
    makeF3x(F3X_Q2, (resp) => {
      reportId = resp.body.id;
    });

    cy.then(() => {
      expect(reportId, 'reportId').to.exist;

      // INDIVIDUAL RECEIPT: create Individual contact, save transaction
      ReportListPage.goToReportList(reportId!);
      goToTransactionCreateFromList(/Add a receipt/i, /Individual Receipt/i);
      cy.contains(/Individual Receipt/i).should('exist');

      openCreateContactModal('first');
      cy.get('@createContactDialog').within(() => {
        cy.get('#last_name').clear().type(individual.last);
        cy.get('#first_name').clear().type(individual.first);
      });
      fillCommonRequiredAddressInDialog('@createContactDialog');
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
      clickSaveAndConfirmCreatesNewContact(reportId!, 'individual', individual.display);

      cy.url({ timeout: 15000 }).should(
        'include',
        `/reports/transactions/report/${reportId}/list`,
      );
      assertTxnRowByContact(individual.display, /Individual Receipt/i, 10);

      // TRANSFER: create Committee contact, save transaction
      ReportListPage.goToReportList(reportId!);
      goToTransactionCreateFromList(/Add a receipt/i, /^Transfer$/i);
      cy.contains('h1', 'Transfer').should('exist');

      openCreateContactModal('first');
      cy.get('@createContactDialog').within(() => {
        cy.get('#committee_id').clear().type(committee.id);
        cy.get('#name').clear().type(committee.name);
      });
      fillCommonRequiredAddressInDialog('@createContactDialog');
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

      TransactionDetailPage.enterScheduleFormData(
        transferData,
        false,
        '',
        true,
        'contribution_date',
      );
      clickSaveAndConfirmCreatesNewContact(reportId!, 'committee', committee.display);

      cy.url({ timeout: 15000 }).should(
        'include',
        `/reports/transactions/report/${reportId}/list`,
      );
      assertTxnRowByContact(committee.display, /Transfer/i, 30);

      // OPERATING EXPENDITURE: create Organization contact, save transaction
      ReportListPage.goToReportList(reportId!);
      goToTransactionCreateFromList(/Add a disbursement/i, /Operating Expenditure/i);
      cy.contains(/Operating Expenditure/i).should('exist');
      openCreateContactModal('first');
      cy.get('@createContactDialog').within(() => {
        cy.get('#name').clear().type(organization.name);
      });
      fillCommonRequiredAddressInDialog('@createContactDialog');
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
      clickSaveAndConfirmCreatesNewContact(reportId!, 'organization', organization.display);

      cy.url({ timeout: 15000 }).should(
        'include',
        `/reports/transactions/report/${reportId}/list`,
      );
      assertTxnRowByContact(organization.display, /Operating Expenditure/i, 40);

      // Final verification: Contacts list (after all 3 completed transactions)
      ContactListPage.goToPage();
      ContactsHelpers.assertColumnHeaders(ContactsHelpers.CONTACTS_HEADERS);
      const assertRow = (name: string, type: string, fecId?: string) => {
        cy.contains('tbody tr', name, { timeout: 15000 })
          .should('exist')
          .within(() => {
            cy.get('td').eq(1).should('contain.text', type);
            if (fecId) cy.get('td').eq(2).should('contain.text', fecId);
          });
      };

      assertRow(individual.display, 'Individual');
      assertRow(committee.display, 'Committee', committee.id);
      assertRow(organization.display, 'Organization');
    });
  });

  const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const clickSaveAndConfirmCreatesNewContact = (
    reportId: string,
    contactTypeLower: 'individual' | 'committee' | 'organization',
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
    cy.get('.p-confirm-dialog, .p-dialog', { timeout: 15000 })
      .filter(':visible')
      .last()
      .within(() => {
        cy.contains(/^Confirm$/i).should('exist');

        cy.get('[data-pc-section="message"], .p-confirm-dialog-message')
          .invoke('text')
          .then((raw) => raw.replace(/\s+/g, ' ').trim())
          .then((text) => {
            const rx = new RegExp(
              `By saving this transaction, you.?re also creating a new ${contactTypeLower} contact for ${escapeRegExp(
                contactDisplay,
              )}\\.?$`,
              'i',
            );
            expect(text).to.match(rx);
          });
      });
    PageUtils.clickButton('Continue');
    cy.wait('@GetLoans');
    cy.wait('@GetDisbursements');
    cy.wait('@GetReceipts');
  };

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
      cy.intercept('GET', '**/api/v1/transactions/previous/entity/**').as('getPrevAggregate');
      ReportListPage.goToReportList(reportId as string);
      StartTransaction.Receipts().Individual().IndividualReceipt();
      cy.contains('Individual Receipt').should('exist');
      ContactLookup.getContact(lastName);

      const scheduleData: ScheduleFormData = {
        ...defaultScheduleFormData,
        ...{
          amount: 250.0,
          electionYear: undefined,
          electionType: undefined,
          date_received: new Date(currentYear, 4 - 1, 27),
          purpose_description: '',
          memo_text: '',
        },
      };

      TransactionDetailPage.enterScheduleFormData(
        scheduleData,
        false,
        '',
        false,
        'contribution_date',
      );

      cy.wait('@getPrevAggregate');
      cy.get('#employer').should('have.value', '').click();
      cy.get('#occupation').should('have.value', '').click();
      cy.contains('button', 'Save').scrollIntoView();
      PageUtils.clickButton('Save');
      cy.url().should('include', `report/${reportId}/create/INDIVIDUAL_RECEIPT`).then(() => {
        cy.contains(/employer.*required|this is a required field\./i, {
          timeout: 10000,
        }).should('exist');

        cy.contains(/occupation.*required|this is a required field\./i, {
          timeout: 10000,
        }).should('exist');
      });

      cy.get('#employer').type(newEmployer);
      cy.get('#occupation').type(newOccupation);
      PageUtils.clickButton('Save');
      cy.get('.p-dialog, .p-confirm-dialog')
        .filter(':visible')
        .last()
        .should('be.visible')
        .within(() => {
          const normalize = (s: string) => s.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
          const tightenHyphens = (s: string) => normalize(s).replace(/-\s+/g, '-');
          cy.contains(/^Confirm$/).should('exist');
          cy.get('[data-pc-section="message"]')
            .should('be.visible')
            .as('confirmMsg');

          cy.get('@confirmMsg')
            .find('b')
            .first()
            .invoke('text')
            .then((t) => {
              expect(normalize(t)).to.eq(displayName);
            });

          cy.get('@confirmMsg')
            .invoke('text')
            .then((raw) => tightenHyphens(raw))
            .then((text) => {
              expect(text).to.include('Change(s):');
              const [intro] = text.split('Change(s):');
              expect(normalize(intro)).to.eq(
                `Your suggested changes for ${displayName} will affect all transactions involving this contact.`,
              );
            });

          cy.get('ul.contact-confirm-dialog li').should('have.length.at.least', 2);
          cy.get('ul.contact-confirm-dialog li')
            .eq(0)
            .invoke('text')
            .then((t) => tightenHyphens(t))
            .should('eq', `Updated employer to ${newEmployer}`);

          cy.get('ul.contact-confirm-dialog li')
            .eq(1)
            .invoke('text')
            .then((t) => tightenHyphens(t))
            .should('eq', `Updated occupation to ${newOccupation}`);
        });
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

    const selectContactLookupType = (type: 'Individual' | 'Organization' | 'Committee') => {
      cy.get('select').then(($selects) => {
        const selectEl = [...$selects].find((sel) => {
          const opts = Array.from((sel as HTMLSelectElement).options).map((o) => o.text.trim());
          return opts.includes('Individual') && opts.includes('Organization') && opts.includes('Committee');
        });

        expect(selectEl, 'Contact Lookup type <select>').to.exist;
        cy.wrap(selectEl!).select(type);
      });
    };

    const fillInputByLabel = (label: RegExp, value: string) => {
      cy.contains('label', label)
        .should('be.visible')
        .then(($label) => {
          const forAttr = $label.attr('for');

          if (forAttr) {
            cy.get(`#${forAttr}`).clear().type(value);
          } else {
            cy.wrap($label).parent().find('input,textarea').first().clear().type(value);
          }
        });
    };

    const selectByLabel = (label: RegExp, value: string) => {
      cy.contains('label', label)
        .should('be.visible')
        .then(($label) => {
          const forAttr = $label.attr('for');

          if (forAttr) {
            cy.get(`#${forAttr}`).select(value);
          } else {
            cy.wrap($label).parent().find('select').first().select(value);
          }
        });
    };

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
    cy.wait('@saveTransaction').its('response.statusCode').should('be.oneOf', [200, 201]);
  });
});
