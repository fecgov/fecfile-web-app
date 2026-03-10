import { buildDataCy, dataCySelector, slugifyDataCyPart } from '../../utils/dataCy';
export { currentYear } from '../../utils/date';

export class PageUtils {
  private static readonly toastCloseSelectors = [
    dataCySelector('layout-global-toast-close-button'),
    dataCySelector('transactions-secondary-report-selection-toast-close-button'),
  ];

  static closeToast() {
    const alias = PageUtils.getAlias('');
    cy.get(alias)
      .find(this.toastCloseSelectors.join(','))
      .first()
      .should('exist')
      .click();
  }

  static clickElement(elementSelector: string, alias = '') {
    alias = PageUtils.getAlias(alias);
    cy.get(alias).find(`[datatest='${elementSelector}']`).click();
  }

  static selectDropdownSetValue(querySelector: string, value: string, alias = '', index = 0) {
    alias = PageUtils.getAlias(alias);

    if (!value) return;

    cy.get(alias)
      .find(querySelector)
      .eq(index)
      .find('select')
      .contains('option', value)
      .then((option) => {
        cy.get(alias).find(querySelector).eq(index).find('select').select(option.val()!);
      });
  }

  static pSelectDropdownSetValue(querySelector: string, value: string, alias = '', index = 0) {
    alias = PageUtils.getAlias(alias);

    if (!value) return;

    cy.get(alias)
      .find(querySelector)
      .eq(index)
      .first()
      .then(($root) => {
        cy.wrap($root).click({ force: true });

        const dataCy = $root.attr('data-cy');
        const optionSelector = dataCy
          ? [dataCySelector(buildDataCy(dataCy, 'option')), '[role="option"]'].join(',')
          : '[role="option"], .p-select-option';

        cy.get('body').contains(optionSelector, value).scrollIntoView({ offset: { top: 0, left: 0 } }).click({ force: true });
      });
  }

  static calendarSetValue(calendar: string, dateObj: Date = new Date(), alias = '') {
    alias = PageUtils.getAlias(alias);

    cy.get(alias)
      .find(calendar)
      .first()
      .then(($calendar) => {
        const $input = $calendar.is('input') ? $calendar : $calendar.find('input').first();
        cy.wrap($input).clear({ force: true }).type(`${PageUtils.dateToString(dateObj)}{enter}`, { force: true });
      });
  }

  static clickSidebarSection(section: string) {
    cy.getByDataCy(buildDataCy('report-sidebar', section, 'section')).click({ force: true });
  }

  static clickSidebarItem(menuItem: string) {
    cy.getByDataCy(buildDataCy('report-sidebar', menuItem, 'link')).click({ force: true });
  }

  static shouldHaveSidebarItem(menuItem: string) {
    cy.getByDataCy(buildDataCy('report-sidebar', menuItem, 'link')).should('exist');
  }

  static shouldNotHaveSidebarItem(menuItem: string) {
    cy.get(dataCySelector(buildDataCy('report-sidebar', menuItem, 'link'))).should('not.exist');
  }

  static getAlias(alias = ''): string {
    if (!alias) {
      cy.get('body').as('body');
      return '@body';
    }

    return alias;
  }

  static clickLink(name: string, alias = '') {
    alias = PageUtils.getAlias(alias);
    cy.get(alias)
      .find(PageUtils.dataCySuffixSelector(name, 'link'))
      .first()
      .click({ force: true });
  }

  static clickAccordion(name: string, alias = '') {
    alias = PageUtils.getAlias(alias);
    cy.get(alias)
      .find(PageUtils.dataCySuffixSelector(name, 'section'))
      .first()
      .click({ force: true });
  }

  static clickButton(name: string, alias = '', force = false) {
    alias = PageUtils.getAlias(alias);
    cy.get(alias).find(PageUtils.dataCySuffixSelector(name, 'button')).first().as('btn');
    cy.get('@btn').click({ force });
  }

  static dateToString(date: Date) {
    return (
      (date.getMonth() > 8 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)) +
      '/' +
      (date.getDate() > 9 ? date.getDate() : '0' + date.getDate()) +
      '/' +
      date.getFullYear()
    );
  }

  static enterValue(fieldName: string, fieldValue: any, alias = '', index = 0) {
    if (alias.length > 0) {
      cy.get(alias).find(fieldName).eq(index).type(fieldValue);
    } else {
      cy.get(fieldName).eq(index).type(fieldValue);
    }
  }

  static urlCheck(input: string) {
    cy.url().should('contain', input);
  }

  static locationCheck(input: string, timeout = 20000) {
    cy.location('pathname', { timeout }).should('include', input);
  }

  static valueCheck(selector: string, input: any) {
    cy.get(selector).should('have.value', input);
  }

  static findOnPage(selector: string, value: string) {
    cy.get(selector).contains(value).should('exist');
  }

  static containedOnPage(selector: string) {
    cy.contains(selector).should('exist');
  }

  static getKabob(identifier: string, alias = '') {
    alias = PageUtils.getAlias(alias);
    cy.get(alias)
      .contains('tr', identifier)
      .should('be.visible')
      .within(() => {
        cy.get(PageUtils.dataCySuffixSelector('actions', 'button')).first().click({ force: true });
      });
  }

  static clickKababItem(identifier: string, item: string, alias = '') {
    PageUtils.getKabob(identifier, alias);
    cy.get('body')
      .find(PageUtils.dataCySuffixSelector(item, 'button'))
      .filter(':visible')
      .first()
      .click({ force: true });
  }

  static switchCommittee(committeeId: string) {
    cy.intercept('GET', 'http://localhost:8080/api/v1/committee-members/').as('GetCommitteeMembers');
    cy.visit('/login/select-committee');
    cy.getByDataCy(`select-committee-page-committee-card-${committeeId}`).click();
    cy.wait('@GetCommitteeMembers');
    cy.wait(1000);
    this.enterSecondCommitteeEmailIfneeded();
  }

  static enterSecondCommitteeEmailIfneeded() {
    cy.get(PageUtils.getAlias(''))
      .find(dataCySelector('select-committee-second-admin-dialog'))
      .should(Cypress._.noop)
      .then(($dialog) => {
        if ($dialog.length) {
          cy.getByDataCy('select-committee-second-admin-dialog-email-input').should('have.value', '');
          cy.getByDataCy('select-committee-second-admin-dialog-email-input').clear().type('admin@admin.com');
          cy.getByDataCy('select-committee-second-admin-dialog-save-button').click();
        }
      });
  }

  static submitReportForm() {
    cy.intercept('POST', 'http://localhost:8080/api/v1/web-services/submit-to-fec/').as('SubmitReport');
    PageUtils.urlCheck('/submit');
    cy.getByDataCy('report-submit-page-treasurer-last-name-input').type('TEST');
    cy.getByDataCy('report-submit-page-treasurer-first-name-input').type('TEST');
    cy.getByDataCy('report-submit-page-filing-password-input').type(Cypress.env('FILING_PASSWORD'));
    cy.getByDataCy('report-submit-page-user-certified-checkbox').click({ force: true });
    cy.getByDataCy('report-submit-page-submit-button').click();
    cy.getByDataCy('layout-confirm-dialog-submit-button').click();
    cy.wait('@SubmitReport');
  }

  static readonly blurActiveField = () => {
    cy.get('body').click(0, 0);
  };

  private static dataCySuffixSelector(label: string, kind: 'button' | 'link' | 'section') {
    const base = PageUtils.labelToDataCySegment(label);
    const alternates = Array.from(new Set([base, base.replaceAll('-and-', '-'), base.replaceAll('-', '_')])).filter(Boolean);
    const selectors = alternates.map((value) => `[data-cy$="-${value}-${kind}"]`);

    if (kind === 'button') {
      if (['confirm', 'continue', 'yes', 'start-building-report'].includes(base)) {
        selectors.push('[data-cy$="-dialog-submit-button"]');
      }

      if (['cancel', 'close', 'no'].includes(base)) {
        selectors.push('[data-cy$="-dialog-cancel-button"]', '[data-cy$="-dialog-close-button"]');
      }
    }

    return Array.from(new Set(selectors)).join(',');
  }

  private static labelToDataCySegment(label: string): string {
    return slugifyDataCyPart(label.replaceAll('&', ' and '));
  }
}
