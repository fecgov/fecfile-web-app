export const currentYear = new Date().getFullYear();

export class PageUtils {
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
    cy.get(alias).find(calendar).first().click();
    cy.get('body').find('.p-datepicker-panel').as('calendarElement');

    PageUtils.pickYear(dateObj.getFullYear());
    PageUtils.pickMonth(dateObj.getMonth());

    PageUtils.pickDay(dateObj.getDate().toString());

    cy.wait(100);
  }

  static pickDay(day: string) {
    cy.get('@calendarElement').find('td').find('span').not('.p-disabled').parent().contains(day).click();
    cy.get('@calendarElement')
      .find('td')
      .find('span')
      .not('.p-disabled')
      .parent()
      .contains(day)
      .then(($day) => {
        cy.wrap($day.parent()).click();
      });
  }

  static pickMonth(month: number) {
    const Months: Array<string> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const Month: string = Months[month];
    cy.get('@calendarElement').find('.p-datepicker-month').contains(Month).click({ force: true });
  }

  static pickYear(year: number) {
    const currentYear: number = new Date().getFullYear();

    cy.get('@calendarElement').find('.p-datepicker-select-year').should('be.visible').click({ force: true });
    cy.wait(100);
    cy.get('@calendarElement').then(($calendarElement) => {
      if ($calendarElement.find('.p-datepicker-select-year:visible').length > 0) {
        cy.get('@calendarElement').find('.p-datepicker-select-year').click({ force: true });
      }
    });
    cy.get('@calendarElement').find('.p-datepicker-decade').should('be.visible');

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
    cy.get('body').find('.p-datepicker-year').contains(year.toString()).should('be.visible').click({ force: true });
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
    cy.get(alias).contains('button', name).click({ force });
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

  static containedOnPage(selector: string) {
    cy.contains(selector).should('exist');
  }

  /**
   * Finds the row containing `identifier` (anywhere in the row),
   * clicks its kebab ("more actions") button, and returns the active overlay.
   *
   * - No longer requires the identifier to be a direct TD child.
   * - Targets the topmost visible PrimeNG overlay (popover/menu/panel).
   * - Handles various kebab button markups.
   */
  static getKabob(identifier: string) {
    const alias = PageUtils.getAlias('');

    const OVERLAY_SEL =
      'div.p-overlay, div.p-overlaypanel, div.p-menu, div.p-popover, [role="menu"]';
    const KEBAB_BTN_SEL =
      // common cases first, then fallbacks
      'app-table-actions-button button, ' +
      'button[aria-label="More actions"], ' +
      'button:has(.pi-ellipsis-v), ' + // requires Cypress+jQuery :has (OK)
      '.pi.pi-ellipsis-v';

    // 1) Locate the row by content anywhere inside it (no direct <td> requirement)
    cy.get(alias)
      .contains('tr', new RegExp(String(identifier).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), {
        timeout: 15000,
      })
      .should('be.visible')
      .scrollIntoView()
      .within(() => {
        // 2) Click the kebab button inside the row (handle icon-only and various wrappers)
        cy.get(KEBAB_BTN_SEL)
          .first()
          .then(($btn) => {
            // If we matched the <i.pi-ellipsis-v>, click its nearest button
            const $clickTarget =
              $btn.is('button') ? $btn : $btn.closest('button').length ? $btn.closest('button') : $btn;

            cy.wrap($clickTarget)
              .scrollIntoView()
              .should('be.visible')
              .click({ force: true });
          });
      });

    // 3) Wait for the topmost overlay to appear and be visible, then return it
    return cy
      .get(OVERLAY_SEL, { timeout: 15000 })
      .should(($els) => {
        expect($els.length, 'an overlay should mount').to.be.greaterThan(0);
      })
      .last()
      .should('be.visible');
  }

  /**
   * Opens the row's kebab and clicks the given menu item by text.
   * Accepts exact string or a RegExp for flexibility ("Amend" vs "Create amendment").
   */
  static clickKababItem(identifier: string, item: string | RegExp) {
    const MENUITEM_SEL =
      'li, .p-menuitem, .p-menuitem-link, button, [role="menuitem"], .table-action-button';

    const rx =
      item instanceof RegExp
        ? item
        : new RegExp(`^\\s*${String(item).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'i');

    PageUtils.getKabob(identifier).within(() => {
      cy.contains(MENUITEM_SEL, rx, { timeout: 10000 })
        .should('be.visible')
        .click({ force: true });
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
}
