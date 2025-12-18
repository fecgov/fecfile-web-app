import { PageUtils } from '../../e2e-smoke/pages/pageUtils';
import { ContactFormData } from '../../e2e-smoke/models/ContactFormModel';

type ContactCaseType = ContactFormData['contact_type'];
type ContactCaseConfig = {
  label: string;
  overrides: Partial<ContactFormData>;
  rowText: string;
  type: ContactCaseType;
  fecId?: string;
};

type TxnHistoryRow = {
  type: string | RegExp;
  form?: string | RegExp;
  report?: string | RegExp;
  date?: string | RegExp;
  amount?: number | string | RegExp;
};

type FecApiCandidateLookup = {
  seed: string;
  candidate: any;
};

const normalize = (s: string) =>
  s.replaceAll(/\u00a0/g, ' ').replaceAll(/\s+/g, ' ').trim();

const toRx = (v: string | RegExp) =>
  v instanceof RegExp
    ? v
    : new RegExp(
      String.raw`^\s*${v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\s*$`,
      'i',
    );

const amountToExpected = (v: number | string | RegExp) => {
  if (v instanceof RegExp) return v;
  if (typeof v === 'number') return `$${v.toFixed(2)}`;
  return v;
};

export class ContactsHelpers {
  static readonly CONTACTS_HEADERS = [
    'Name',
    'Type',
    'FEC ID',
    'Employer',
    'Occupation',
    'Actions',
  ] as const;

  static readonly DIALOG = '.p-dialog:visible';

  static escapeRegExp(s: string) {
    return s.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
  }

  static fieldForLabel(labelRx: RegExp, root = ContactsHelpers.DIALOG) {
    return cy.get(root).contains('label', labelRx).closest('.field, .p-field, div.field');
  }

  static expectErrorNearLabel(labelRx: RegExp, errorRx: RegExp, root = ContactsHelpers.DIALOG) {
    ContactsHelpers.fieldForLabel(labelRx, root).within(() => {
      cy.contains(errorRx).should('exist');
    });
  }

  static setTelephone(value: string, root = ContactsHelpers.DIALOG) {
    ContactsHelpers.fieldForLabel(/^Telephone/i, root)
      .find('input')
      .last()
      .clear()
      .type(value);
  }

  static setDropdownByLabel(labelRegex: RegExp, optionText: string, root = ContactsHelpers.DIALOG) {
    ContactsHelpers.fieldForLabel(labelRegex, root).within(() => {
      cy.get('.p-select, .p-dropdown, .p-inputwrapper').first().click({ force: true });
    });

    cy.get('body')
      .find('.p-select-option, .p-dropdown-item')
      .contains(new RegExp(String.raw`^\\s*${ContactsHelpers.escapeRegExp(optionText)}\\s*$`))
      .click({ force: true });
  }

  static setDropdownByLabelIfPresent(
    labelRegex: RegExp,
    optionText: string,
    root = ContactsHelpers.DIALOG,
  ) {
    cy.get(root).then(($root) => {
      const has = Array.from($root.find('label')).some((l) =>
        labelRegex.test((l.textContent || '').replaceAll(/\s+/g, ' ').trim()),
      );

      if (!has) return;

      cy.wrap($root)
        .contains('label', labelRegex)
        .closest('.field, .p-field, div.field')
        .within(() => {
          cy.get('.p-select, .p-dropdown, .p-inputwrapper').first().click({ force: true });
        });

      cy.get('body')
        .find('.p-select-option, .p-dropdown-item')
        .contains(new RegExp(String.raw`^\\s*${ContactsHelpers.escapeRegExp(optionText)}\\s*$`))
        .click({ force: true });
    });
  }

  static assertAndContinueConfirmModal(contactName: string, expectedChanges: Array<string | RegExp> = []) {
    ContactsHelpers.getVisibleConfirmDialog().within(() => {
      cy.contains(contactName).should('exist');
      expectedChanges.forEach((c) => cy.contains(c).should('exist'));
      cy.contains('button', /Continue/i).click();
    });
    cy.contains('.p-dialog-title', /Confirm/i).should('not.exist');
  }

  static pickAutocompleteOptionForInput(
    inputSelector: string,
    opts: { match?: string | RegExp; index?: number } = {},
  ) {
    const { match, index = 0 } = opts;

    const selectableOptionSel = [
      'li.p-autocomplete-option:not(.p-autocomplete-option-group):not(.p-disabled):not([aria-disabled="true"])',
      'li.p-autocomplete-item:not(.p-disabled):not([aria-disabled="true"])',
      '[role="option"]:not(.p-autocomplete-option-group):not([aria-disabled="true"])',
    ].join(',');

    cy.get(inputSelector, { timeout: 20000 })
      .should('be.visible')
      .then(($input) => {
        const id = $input.attr('id');
        const ariaControls = $input.attr('aria-controls');
        const listId = ariaControls || (id ? `${id}_list` : undefined);

        expect(listId, 'autocomplete list id').to.exist;

        cy.get(`#${listId!}`, { timeout: 20000 })
          .should('be.visible')
          .then(($list) => {
            const list = () => cy.wrap($list);

            list()
              .find(selectableOptionSel)
              .filter(':visible')
              .its('length')
              .then((len) => {
                expect(len, 'selectable autocomplete options').to.be.greaterThan(0);
              });

            if (match) {
              const rx =
                match instanceof RegExp
                  ? match
                  : new RegExp(ContactsHelpers.escapeRegExp(match), 'i');

              list()
                .contains(selectableOptionSel, rx, { timeout: 20000 })
                .first()
                .scrollIntoView()
                .click({ force: true });
            } else {
              list()
                .find(selectableOptionSel)
                .filter(':visible')
                .eq(index)
                .scrollIntoView()
                .click({ force: true });
            }
          });
      });
  }

  static stubCandidateLookup(
    candidate: any,
    opts: { fecfileCandidates?: any[] } = {},
  ) {
    const { fecfileCandidates = [] } = opts;

    cy.intercept('GET', '**/api/v1/contacts/candidate_lookup/**', {
      statusCode: 200,
      body: {
        fec_api_candidates: [candidate],
        fecfile_candidates: fecfileCandidates,
      },
    }).as('candidateLookup');
  }

  static stubCandidateDetails(candidate: any) {
    cy.intercept('GET', '**/api/v1/contacts/candidate/**', (req) => {
      const id = (req.query as any)?.candidate_id;
      if (!id || id === candidate.candidate_id) {
        req.reply({ statusCode: 200, body: candidate });
      } else {
        req.continue();
      }
    }).as('candidateDetails');
  }

  static ensureInputHasValue(selector: string, value?: string | null) {
    if (!value) return;

    cy.get(selector)
      .scrollIntoView()
      .then(($el) => {
        const current = (($el.val() ?? '') as string).trim();
        if (!current) {
          cy.wrap($el).clear({ force: true }).type(value, { force: true });
        }
      });
  }

  static officeCodeToLabel(code?: string | null) {
    const c = (code ?? '').toUpperCase();
    if (c === 'H') return 'House';
    if (c === 'S') return 'Senate';
    if (c === 'P') return 'President';
    return undefined;
  }

  static stateCodeToName(code?: string | null) {
    const m: Record<string, string> = {
      AK: 'Alaska',
      AL: 'Alabama',
      TX: 'Texas',
      VA: 'Virginia',
    };
    const c = (code ?? '').toUpperCase();
    return m[c] ?? undefined;
  }

  static fillCandidateEditFormFromApi(candidate: any) {
    this.ensureInputHasValue('#last_name', candidate?.last_name);
    this.ensureInputHasValue('#first_name', candidate?.first_name);
    this.ensureInputHasValue('#street_1', candidate?.street_1 ?? '123 Default St');
    this.ensureInputHasValue('#city', candidate?.city ?? 'Defaultville');
    this.ensureInputHasValue('#zip', candidate?.zip ?? '00000');

    const addrState = this.stateCodeToName(candidate?.state) ?? candidate?.state;
    if (addrState) PageUtils.dropdownSetValue('#state', addrState);

    const office = this.officeCodeToLabel(candidate?.candidate_office);
    if (office) this.setDropdownByLabel(/^Candidate office/i, office);

    const candState = this.stateCodeToName(candidate?.candidate_state) ?? candidate?.candidate_state;
    if (candState) this.setDropdownByLabel(/^Candidate state/i, candState);

    if (candidate?.candidate_district) {
      this.setDropdownByLabel(/^Candidate district/i, String(candidate.candidate_district));
    }

    this.ensureInputHasValue('#employer', candidate?.employer);
    this.ensureInputHasValue('#occupation', candidate?.occupation);
  }

  static findExistingFecApiCandidate(
    seeds: readonly string[] = ['pre', 'pres', 'hou', 'smi', 'john', 'mar', 'wil', 'and'],
  ): Cypress.Chainable<FecApiCandidateLookup> {
    let found: FecApiCandidateLookup | null = null;

    return cy
      .wrap<string[]>([...seeds], { log: false })
      .each((seed: string) => {
        if (found) return false;

        return cy
          .request({
            method: 'GET',
            url:
              `http://localhost:8080/api/v1/contacts/candidate_lookup/` +
              `?q=${encodeURIComponent(seed)}` +
              `&max_fec_results=10&max_fecfile_results=5&office=&exclude_fec_ids=&exclude_ids=`,
          })
          .then((resp) => {
            const fecApi = resp.body?.fec_api_candidates ?? [];
            if (fecApi.length > 0) {
              found = { seed, candidate: fecApi[0] };
              return false;
            }
          });
      })
      .then(() => {
        expect(found, `fec_api_candidates found for seeds: ${seeds.join(', ')}`).to.exist;
        return found!;
      });
  }

  static assertColumnHeaders(
    expected: readonly string[] = this.CONTACTS_HEADERS,
  ): void {
    cy.get('p-table table thead th, table thead th')
      .then(($ths) =>
        Array.from($ths, (th) =>
          (th.textContent || '').trim().replaceAll(/\s+/g, ' '),
        ),
      )
      .should('deep.equal', [...expected]);
  }

  static assertDisabled(selector: string) {
    cy.get(selector)
      .first()
      .should('exist')
      .should(($el) => {
        const disabled =
          $el.is(':disabled') ||
          $el.hasClass('p-disabled') ||
          $el.attr('aria-disabled') === 'true';
        expect(disabled, `${selector} should be disabled`).to.eq(true);
      });
  }

  static assertEnabled(selector: string) {
    cy.get(selector)
      .first()
      .should('exist')
      .should(($el) => {
        const disabled =
          $el.is(':disabled') ||
          $el.hasClass('p-disabled') ||
          $el.attr('aria-disabled') === 'true';
        expect(disabled, `${selector} should be enabled`).to.eq(false);
      });
  }

  static selectResultsPerPage(n: number) {
    cy.contains(/results\s*per\s*page:/i)
      .parent()
      .within(() => {
        cy.get('.p-select-dropdown').first().scrollIntoView().click();
      });

    const optionRegex = new RegExp(String.raw`^\s*${n}\s*$`);
    cy.get('body')
      .find('.p-select-list')
      .should('be.visible')
      .last()
      .within(() => {
        cy.contains('.p-select-option', optionRegex)
          .should('be.visible')
          .click();
      });
  }

  static assertPageReport(start: number, end: number, total: number) {
    const rx = new RegExp(
      String.raw`showing\s+${start}\s*(?:-|to)\s*${end}\s+of\s+${total}\s+contacts?`,
      'i',
    );
    cy.contains(rx).should('exist');
  }

  static assertSuccessToastMessage() {
    cy.contains('.p-toast-message, .p-toast', /(success|saved|created)/i, {
      timeout: 10000,
    }).should('exist');
  }

  static assertRowValues(
    rowText: string,
    expectedType: string,
    expectedFecId?: string,
  ) {
    cy.contains('tbody tr', rowText, { matchCase: false })
      .should('exist')
      .within(() => {
        cy.get('td')
          .eq(1)
          .invoke('text')
          .then((t) => {
            expect(t.trim().toLowerCase()).to.eq(expectedType.toLowerCase());
          });

        if (expectedFecId) {
          cy.get('td')
            .eq(2)
            .invoke('text')
            .then((t) => {
              expect(t.replaceAll(/\s+/g, '').toUpperCase()).to.eq(
                expectedFecId.toUpperCase(),
              );
            });
        }
      });
  }

  static buildContactTypeCases(uid: number): ContactCaseConfig[] {
    const individualLast = `IndLn${uid}`;
    const individualFirst = `IndFn${uid}`;
    const individualDisplay = `${individualLast}, ${individualFirst}`;

    const candidateLast = `CandLn${uid}`;
    const candidateFirst = `CandFn${uid}`;
    const candidateId = 'H0VA00001';

    const committeeName = `Committee ${uid}`;
    const committeeId = `C${String(uid).padStart(8, '0')}`;

    const orgName = `Organization ${uid}`;

    return [
      {
        label: 'Individual',
        overrides: {
          contact_type: 'Individual',
          last_name: individualLast,
          first_name: individualFirst,
        },
        rowText: individualDisplay,
        type: 'Individual',
      },
      {
        label: 'Candidate',
        overrides: {
          contact_type: 'Candidate',
          last_name: candidateLast,
          first_name: candidateFirst,
          candidate_id: candidateId,
          candidate_office: 'House',
          candidate_state: 'Virginia',
          candidate_district: '01',
        },
        rowText: candidateId,
        type: 'Candidate',
        fecId: candidateId,
      },
      {
        label: 'Committee',
        overrides: {
          contact_type: 'Committee',
          name: committeeName,
          committee_id: committeeId,
        },
        rowText: committeeId,
        type: 'Committee',
        fecId: committeeId,
      },
      {
        label: 'Organization',
        overrides: {
          contact_type: 'Organization',
          name: orgName,
        },
        rowText: orgName,
        type: 'Organization',
      },
    ];
  }

  static createContactViaLookup(
    entityLabel: 'Committee' | 'Candidate',
    searchEndpoint: string,
    rowMatch: RegExp,
  ): Cypress.Chainable<JQuery<HTMLElement>> {
    PageUtils.clickButton('Add contact');
    cy.get('#entity_type_dropdown').first().click();

    cy.contains('.p-select-option', entityLabel)
      .scrollIntoView({ offset: { top: 0, left: 0 } })
      .click();

    cy.intercept('GET', searchEndpoint).as('entitySearch');
    cy.get('.p-autocomplete-input').should('exist').type('ber');

    cy.get('.p-autocomplete-option')
      .should('have.length.at.least', 1)
      .first()
      .click({ force: true });

    cy.wait('@entitySearch');
    cy.intercept('POST', '**/api/v1/contacts/').as('createContact');
    PageUtils.clickButton('Save');
    cy.wait('@createContact');

    ContactsHelpers.assertColumnHeaders(ContactsHelpers.CONTACTS_HEADERS);
    return cy.contains('tbody tr', rowMatch).should('exist');
  }

  static assertTransactionHistoryRow(row: TxnHistoryRow): Cypress.Chainable<void> {
    const typeRx = toRx(row.type);
    const formRx = row.form ? toRx(row.form) : undefined;
    const reportRx = row.report ? toRx(row.report) : undefined;
    const dateRx = row.date ? toRx(row.date) : undefined;

    const amountExpected =
      row.amount == null ? undefined : amountToExpected(row.amount);

    let amountRx: RegExp | undefined;

    if (amountExpected instanceof RegExp) {
      amountRx = amountExpected;
    } else if (amountExpected !== undefined) {
      amountRx = toRx(amountExpected);
    }

    const colIds = {
      type: 'transaction_type_identifier-column',
      form: 'form_type-column',
      report: 'report_code_label-column',
      date: 'date-column',
      amount: 'amount-column',
    } as const;

    const getColIndexByThIdOrText = (
      $table: JQuery<HTMLElement>,
      thId: string,
      headerText: string,
    ) => {
      const $ths = $table.find('thead th');

      const byId = $ths.toArray().findIndex((th) => th.getAttribute('id') === thId);
      if (byId >= 0) return byId;

      const rx = toRx(headerText);
      return $ths
        .toArray()
        .findIndex((th) => rx.test(normalize(th.textContent ?? '')));
    };

    return cy
      .get('app-table[title="Transaction history"]', { timeout: 15000 })
      .should('exist')
      .find('table[role="table"]', { timeout: 15000 })
      .first()
      .should('exist')
      .then(($table) => {
        const typeIdx = getColIndexByThIdOrText($table, colIds.type, 'Type');
        expect(typeIdx, 'Type column index').to.be.gte(0);

        const formIdx = row.form ? getColIndexByThIdOrText($table, colIds.form, 'Form') : -1;
        const reportIdx = row.report ? getColIndexByThIdOrText($table, colIds.report, 'Report') : -1;
        const dateIdx = row.date ? getColIndexByThIdOrText($table, colIds.date, 'Date') : -1;
        const amountIdx =
          row.amount === undefined
            ? -1
            : getColIndexByThIdOrText($table, colIds.amount, 'Amount');

        const $rows = $table.find('tbody tr');
        expect($rows.length, 'transaction history row count').to.be.greaterThan(0);

        const rowIndex = $rows.toArray().findIndex((tr) => {
          const tds = Array.from(tr.querySelectorAll('td'));
          const cell = tds[typeIdx];
          return !!cell && typeRx.test(normalize(cell.textContent ?? ''));
        });

        expect(rowIndex, `row index for type ${typeRx}`).to.be.gte(0);

        const $row = $rows.eq(rowIndex);
        const $tds = $row.find('td');

        const assertCell = (idx: number, rx: RegExp, label: string) => {
          expect(idx, `${label} column index`).to.be.gte(0);
          const text = normalize($tds.eq(idx).text());
          expect(text, `${label} cell text`).to.match(rx);
        };

        assertCell(typeIdx, typeRx, 'Type');
        if (formRx) assertCell(formIdx, formRx, 'Form');
        if (reportRx) assertCell(reportIdx, reportRx, 'Report');
        if (dateRx) assertCell(dateIdx, dateRx, 'Date');
        if (amountRx) assertCell(amountIdx, amountRx, 'Amount');
      })
      .then(() => cy.wrap<void>(undefined, { log: false }));
  }

  static clickSaveAndHandleConfirm() {
    cy.contains('button', /^Save$/).click();

    cy.get('body').then(($body) => {
      const hasConfirm = $body
        .find('.p-dialog-title')
        .toArray()
        .some((el) => /confirm/i.test((el.textContent || '').trim()));

      if (hasConfirm) {
        ContactsHelpers.continueConfirmModal();
      }
    });
  }

  private static getVisibleConfirmDialog() {
    return cy
      .contains('.p-dialog-title', /Confirm/i, { timeout: 10000 })
      .should('be.visible')
      .closest('.p-confirm-dialog, .p-dialog');
  }

  static continueConfirmModal() {
    ContactsHelpers.getVisibleConfirmDialog().within(() => {
      cy.contains('button', /Continue/i).should('be.enabled').click();
    });

    cy.contains('.p-dialog-title', /Confirm/i).should('not.exist');
  }


}
