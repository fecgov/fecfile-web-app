import { ApiUtils } from '../utils/api';

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

  static dropdownSetValue(querySelector: string, value: string, alias = '', index = 0) {
    alias = PageUtils.getAlias(alias);

    if (value) {
      cy.get(alias).find(querySelector).eq(index).click();
      cy.contains('p-selectitem', value)
        .scrollIntoView({ offset: { top: 0, left: 0 } })
        .click();
    }
  }

  static calendarSetValue(calendar: string, dateObj: Date = new Date(), alias = '') {
    alias = PageUtils.getAlias(alias);
    const dateString = PageUtils.dateToString(dateObj);

    cy.get(alias).find(calendar).first().as('calendarContainer');
    cy.get('@calendarContainer').find('input').first().as('calendarInput');
    cy.get('@calendarInput').click({ force: true });

    cy.get('@calendarInput').then(($calendarInput) => {
      const isReadOnly = Boolean($calendarInput.prop('readOnly')) || $calendarInput.is('[readonly]');

      // Prefer direct entry when allowed; it is stable across PrimeNG datepicker DOM changes.
      if (!isReadOnly) {
        cy.get('@calendarInput').clear({ force: true }).type(dateString, { force: true }).blur();
        PageUtils.closeVisibleDatepickerPanels();
        return;
      }

      cy.get('body').then(($body) => {
        const panel = $body.find('.p-datepicker-panel:visible');

        // Fallback for non-calendar inputs.
        if (!panel.length) {
          cy.get('@calendarInput').type(dateString, { force: true }).blur();
          return;
        }

        PageUtils.selectDateFromVisiblePanel(dateObj);
        cy.get('@calendarInput').blur({ force: true });
      });
    });
  }

  private static closeVisibleDatepickerPanels() {
    cy.get('body').then(($body) => {
      if ($body.find('.p-datepicker-panel:visible').length === 0) {
        return;
      }

      cy.get('body').type('{esc}', { force: true });
      cy.get('body').click(1, 1, { force: true });
      cy.get('body').find('.p-datepicker-panel:visible').should('have.length', 0);
    });
  }

  private static parsePanelMonthYear($panel: JQuery<HTMLElement>): { month: number; year: number } | null {
    const titleText = ($panel.find('.p-datepicker-title').first().text() || '').replace(/\s+/g, ' ').trim();
    const titleMatch = titleText.match(/([A-Za-z]+)\s*(\d{4})/);

    if (!titleMatch) {
      return null;
    }

    const parsedMonth = Date.parse(`${titleMatch[1]} 1, 2000`);
    if (Number.isNaN(parsedMonth)) {
      return null;
    }

    return {
      month: new Date(parsedMonth).getMonth(),
      year: Number.parseInt(titleMatch[2], 10),
    };
  }

  private static selectDateFromVisiblePanel(dateObj: Date, turn = 0): void {
    const maxTurns = 240;
    const targetMonth = dateObj.getMonth();
    const targetYear = dateObj.getFullYear();
    const targetDay = dateObj.getDate().toString();
    const targetDataDate = `${targetYear}-${targetMonth}-${dateObj.getDate()}`;

    cy.get('body')
      .find('.p-datepicker-panel:visible')
      .last()
      .then(($panel) => {
        if (!$panel.length) {
          throw new Error('No visible datepicker panel while selecting date');
        }

        const hasTargetDate = $panel.find(`[data-date="${targetDataDate}"]`).length > 0;
        if (hasTargetDate) {
          cy.wrap($panel).find(`[data-date="${targetDataDate}"]`).first().click({ force: true });
          PageUtils.closeVisibleDatepickerPanels();
          return;
        }

        const currentMonthYear = PageUtils.parsePanelMonthYear($panel);
        if (!currentMonthYear) {
          if ($panel.find('.p-datepicker-select-year').length > 0) {
            PageUtils.pickYear(targetYear);
            PageUtils.pickMonth(targetMonth);
            PageUtils.pickDay(targetDay);
            PageUtils.closeVisibleDatepickerPanels();
            return;
          }
          throw new Error('Unable to parse datepicker month/year from visible panel');
        }

        const monthDelta = (targetYear - currentMonthYear.year) * 12 + (targetMonth - currentMonthYear.month);
        if (monthDelta === 0) {
          PageUtils.pickDay(targetDay);
          PageUtils.closeVisibleDatepickerPanels();
          return;
        }

        if (turn >= maxTurns) {
          throw new Error(`Could not navigate datepicker to ${targetMonth + 1}/${targetYear}`);
        }

        const button = monthDelta > 0 ? '.p-datepicker-next-button' : '.p-datepicker-prev-button';
        cy.wrap($panel).find(button).should('exist').click({ force: true });
        PageUtils.selectDateFromVisiblePanel(dateObj, turn + 1);
      });
  }

  static pickDay(day: string) {
    const dayRegex = new RegExp(`^${Cypress._.escapeRegExp(day)}$`);
    cy.get('body')
      .find('.p-datepicker-panel:visible')
      .last()
      .find('td span')
      .not('.p-disabled')
      .parent()
      .contains(dayRegex)
      .first()
      .click({ force: true });
  }

  static pickMonth(month: number) {
    const Months: Array<string> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const Month: string = Months[month];
    cy.get('body')
      .find('.p-datepicker-panel:visible')
      .last()
      .find('.p-datepicker-month')
      .contains(Month)
      .click({ force: true });
  }

  static pickYear(year: number) {
    const panelSelector = '.p-datepicker-panel:visible';
    const yearLabel = year.toString();
    const maxTurns = 12; // 120 years of decade navigation is ample for test inputs.

    const openYearView = () => {
      cy.get('body')
        .find(panelSelector)
        .last()
        .then(($panel) => {
          const yearSelect = $panel.find('.p-datepicker-select-year').first();
          if (!yearSelect.length) {
            throw new Error('Could not locate datepicker year selector trigger');
          }
          cy.wrap(yearSelect).click({ force: true });
        });
    };

    const stepToYear = (turn = 0): void => {
      cy.get('body')
        .find(panelSelector)
        .last()
        .then(($panel) => {
          const hasYear = $panel.find('.p-datepicker-year').toArray().some((el) => {
            return (el.textContent || '').trim() === yearLabel;
          });

          if (hasYear) {
            cy.get('body')
              .find(panelSelector)
              .last()
              .find('.p-datepicker-year')
              .contains(yearLabel)
              .click({ force: true });
            return;
          }

          if (turn >= maxTurns) {
            throw new Error(`Could not locate year ${yearLabel} in datepicker after ${maxTurns} decade turns`);
          }

          const decadeText = $panel.find('.p-datepicker-decade').first().text().trim();
          const match = decadeText.match(/(\d{4})\D+(\d{4})/);

          if (match) {
            const start = Number.parseInt(match[1], 10);
            const end = Number.parseInt(match[2], 10);
            const button = year < start ? '.p-datepicker-prev-button' : year > end ? '.p-datepicker-next-button' : '';

            if (button) {
              cy.get('body')
                .find(panelSelector)
                .last()
                .find(button)
                .click({ force: true });
              stepToYear(turn + 1);
              return;
            }
          }

          // If year view is not active, open it and retry.
          openYearView();
          stepToYear(turn + 1);
        });
    };

    openYearView();
    stepToYear();
  }

  static clickSidebarSection(section: string) {
    cy.get('p-panelmenu').contains(section).parent().as('section');
    cy.get('@section').click();
  }

  static clickSidebarItem(menuItem: string) {
    cy.get('p-panelmenu').contains('a', menuItem).as('menuItem');
    cy.get('@menuItem').click({ force: true });
  }

  static shouldHaveSidebarItem(menuItem: string) {
    cy.get('p-panelmenu').as('PanelMenu');
    cy.get('@PanelMenu').contains('a', menuItem).should('exist');
  }

  static shouldNotHaveSidebarItem(menuItem: string) {
    cy.get('p-panelmenu').contains('a', menuItem).should('not.exist');
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
    const label = name.trim();
    const exactLabel = new RegExp(String.raw`^\s*${Cypress._.escapeRegExp(label)}\s*$`, 'i');

    cy.get(alias)
      .contains('.accordion-text strong, .header-label', exactLabel, { timeout: 5000 })
      .first()
      .closest('p-accordion-header, .p-accordionheader')
      .should('be.visible')
      .click();
  }

  static clickButton(name: string, alias = '', force = false) {
    alias = PageUtils.getAlias(alias);
    cy.get(alias)
      .contains('button', name)
      .first()
      .click({ force });
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
      .first()
      .click();
  }

  static clickKababItem(identifier: string, item: string, alias = '') {
    PageUtils.getKabob(identifier, alias);
    cy.get(PageUtils.getAlias(''))
      .find('.p-popover')
      .contains(item)
      .first()
      .click();
  }

  static switchCommittee(committeeId: string) {
    cy.intercept('GET', ApiUtils.apiRoutePathname('/committee-members/')).as('GetCommitteeMembers');
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

  static submitReportForm() {
    cy.intercept('POST', ApiUtils.apiRoutePathname('/web-services/submit-to-fec/')).as('SubmitReport');
    const alias = PageUtils.getAlias('');
    PageUtils.urlCheck('/submit');
    PageUtils.enterValue('#treasurer_last_name', 'TEST');
    PageUtils.enterValue('#treasurer_first_name', 'TEST');
    PageUtils.enterValue('#filingPassword', Cypress.env('FILING_PASSWORD'));
    cy.get(alias).find('[data-cy="userCertified"]').first().click();
    PageUtils.clickButton('Submit');
    PageUtils.findOnPage('div', 'Are you sure?');
    PageUtils.clickButton('Confirm');
    cy.wait('@SubmitReport');
  }

  static readonly blurActiveField = () => {
    cy.get('body').click(0, 0);
  };

}
