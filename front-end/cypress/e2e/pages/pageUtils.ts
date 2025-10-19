export const currentYear = new Date().getFullYear();

export class PageUtils {
  static closeToast() {
    const alias = PageUtils.getAlias('');
    cy.get(alias).find('.p-toast-close-button').should('exist').click();
  }

  static clickElement(elementSelector: string, alias = '') {
    alias = PageUtils.getAlias(alias);
    cy.get(alias)
      .find("[datatest='" + elementSelector + "']")
      .click();
  }

  static dropdownSetValue(querySelector: string, value: string, alias = '') {
    alias = PageUtils.getAlias(alias);

    if (value) {
      cy.get(alias).find(querySelector).first().click();
      cy.contains('p-selectitem', value)
        .scrollIntoView({ offset: { top: 0, left: 0 } })
        .click();
    }
  }

  static calendarSetValue(calendar: string, dateObj: Date = new Date(), alias = '') {
    alias = PageUtils.getAlias(alias);
    // Open the calendar
    cy.get(alias).find(calendar).first().click();
    // Always act on the newest visible panel only
    cy.get('.p-datepicker-panel:visible').last().as('calendarElement');

    // Pick Year -> Month -> Day, all scoped to this single panel
    PageUtils.pickYear(dateObj.getFullYear());
    PageUtils.pickMonth(dateObj.getMonth());
    PageUtils.pickDay(dateObj.getDate().toString());

    // Ensure the overlay is closed before moving on to avoid double panels later
    cy.get('body').type('{esc}', { force: true });               // nudge close if still open
    cy.get('.p-datepicker-panel:visible').should('not.exist'); 
  }

  static pickDay(day: string) {
    // Single, scoped click (no double-clicking)
    cy.get('@calendarElement')
      .find('td:not(.p-disabled):not(.p-datepicker-other-month) > span')
      .contains(new RegExp(`^\\s*${day}\\s*$`))
      .click({ force: true });
  }

  static pickMonth(month: number) {
    const Months: Array<string> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const Month: string = Months[month];
    cy.get('@calendarElement')
      .find('.p-datepicker-month')
      .contains(Month)
      .click({ force: true });
  }

  static pickYear(year: number) {
    const currentYear: number = new Date().getFullYear();

    // Open the decade view within the single, scoped panel
    cy.get('@calendarElement')
      .find('.p-datepicker-select-year:visible')
      .first()
      .should('be.visible')
      .click({ force: true });

    cy.get('@calendarElement')
      .find('.p-datepicker-decade')
      .should('be.visible');

    const decadeStart: number = currentYear - (currentYear % 10);
    const decadeEnd: number = decadeStart + 9;
    if (year < decadeStart) {
      for (let i = 0; i < decadeStart - year; i += 10) {
        cy.get('@calendarElement').find('.p-datepicker-prev-button').click();
      }
    }
    if (year > decadeEnd) {
      for (let i = 0; i < year - decadeEnd; i += 10) {
        cy.get('@calendarElement').find('.p-datepicker-next-button').click();
      }
    }

    // Ensure target year is visible even if initial decade math doesn't match current panel view
    const ensureYearVisible = () =>
      cy.get('@calendarElement').find('.p-datepicker-year').then(($years) => {
        const first = Number($years.first().text().trim());
        const last = Number($years.last().text().trim());
        if (Number.isFinite(first) && Number.isFinite(last)) {
          if (year < first) {
            cy.get('@calendarElement').find('.p-datepicker-prev-button').click();
            return ensureYearVisible();
          }
          if (year > last) {
            cy.get('@calendarElement').find('.p-datepicker-next-button').click();
            return ensureYearVisible();
          }
        }
      });
    ensureYearVisible();

    cy.get('@calendarElement')
      .find('.p-datepicker-year')
      .contains(year.toString())
      .should('be.visible')
      .click({ force: true });
  }

  static clickSidebarSection(section: string) {
    cy.get('p-panelmenu').contains(section).parent().as('section');
    cy.get('@section').click();
  }

  static clickSidebarItem(menuItem: string) {
    cy.get('p-panelmenu').contains('a', menuItem).as('menuItem');
    cy.get('@menuItem').click({ force: true });
  }

  static getAlias(alias = ''): string {
    // Create the alias to limit the scope of the query selectors
    if (!alias) {
      cy.get('body').as('body');
      return '@body';
    }
    return alias;
  }

  static clickLink(name: string, alias = '') {
    alias = PageUtils.getAlias(alias);
    cy.get(alias).contains('a', name).click();
  }

  static clickAccordion(name: string, alias = '') {
    alias = PageUtils.getAlias(alias);
    cy.get(alias).contains('p-accordion-header', name).click();
  }

  static clickButton(name: string, alias = '', force = false) {
    alias = PageUtils.getAlias(alias);
    cy.get(alias).contains('button', name).as('btn');
    if (force) {
      PageUtils.findAndReturn('button', name).click();
    } else {
      cy.get('@btn').click();
    }
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

  static enterValue(fieldName: string, fieldValue: any) {
    cy.get(fieldName).type(fieldValue);
  }

  static urlCheck(input: string) {
    cy.url().should('contain', input);
  }

  static valueCheck(selector: string, input: any) {
    cy.get(selector).should('have.value', input);
  }

  static findOnPage(selector: string, value: string) {
    cy.get(selector).contains(value).should('exist');
  }

  static findAndReturn(selector: string, value: string) {
    cy.get(selector).contains(value).should('exist').as('foundElement');
    return cy.get('@foundElement');
  }

  static containedOnPage(selector: string) {
    cy.contains(selector).should('exist');
  }

  /**
   * Important note, the identifier must be unique. If there are multiple rows with the same info
   * it will fail.
   * Also, the identifier must be directly under the <td>.
   * Example: <td>text</td> is good, but <td><div>text</div></td> won't work
   * @param identifier string to identify which Row the kabob is in.
   */
  static getKabob(identifier: string, alias = '') {
    alias = PageUtils.getAlias(alias);
    cy.get(alias)
      .contains(identifier)
      .closest('td')
      .siblings()
      .last()
      .find('app-table-actions-button')
      .children()
      .first()
      .children()
      .then(($btn) => {
        cy.wrap($btn.first()).as('btn');
        cy.get('@btn').click();
      });
  }

  static clickKababItem(identifier: string, item: string, alias = '') {
    PageUtils.getKabob(identifier, alias);
    cy.get(PageUtils.getAlias(''))
      .find('.p-popover')
      .contains(item)
      .then(($item) => {
        cy.wrap($item.first()).as('btn');
        cy.get('@btn').click();
      });
  }

  static switchCommittee(committeeId: string) {
    cy.intercept('GET', 'http://localhost:8080/api/v1/committee-members/').as('GetCommitteeMembers');
    cy.visit('/login/select-committee');
    cy.get('.committee-list .committee-info').get(`[id="${committeeId}"]`).click();
    cy.wait('@GetCommitteeMembers'); // Wait for the guard request to resolve
    cy.wait(1000);
    this.enterSecondCommitteeEmailIfneeded();
  }

  static enterSecondCommitteeEmailIfneeded() {
    cy.get(PageUtils.getAlias(''))
      .find('[id="second-committee-admin-dialog"]')
      .should(Cypress._.noop) // No-op to avoid failure if it doesn't exist
      .then(($email) => {
        if ($email.length) {
          cy.contains('Welcome to FECfile+').should('exist').click(); // Ensures that the modal is in focus
          cy.get('#email').should('have.value', '');
          cy.get('#email').clear().type('admin@admin.com'); // Clearing the field makes the typing behavior consistent
          cy.get('#email').should('have.value', 'admin@admin.com');
          cy.get('#email').click();
          PageUtils.clickButton('Save');
        }
      });
    cy.contains('Welcome to FECfile+').should('not.exist');
  }

  static typeIntoLookup = (text: string, container?: string) => {
    const root = container ? cy.get(container) : cy.get('body');

    root.find('[id="searchBox"]:visible').last().within(() => {
      cy.get('input.p-autocomplete-input, input[role="combobox"], input[type="text"]')
        .filter(':visible').first()
        .should('be.visible').and('not.be.disabled')
        .click({ force: true })
        .type('{selectall}{backspace}')
        .type(text, { force: true });
    });
  }

  static waitForTransactionsList() {
    cy.wait('@GetReceipts');
    cy.wait('@GetDisbursements');
    cy.wait('@GetLoans');
    cy.get('.p-progress-spinner, .calculation-overlay').should('not.exist');
    cy.contains('Transactions in this report').should('be.visible');
  }
}
