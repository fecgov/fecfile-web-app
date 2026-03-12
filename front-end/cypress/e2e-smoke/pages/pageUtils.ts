export const currentYear = new Date().getFullYear();

export class PageUtils {
  private static normalizeText(value: string) {
    return value.replaceAll(/\s+/g, ' ').trim();
  }

  private static getExactTextMatcher(value: string) {
    return new RegExp(String.raw`^\s*${Cypress._.escapeRegExp(value.trim())}\s*$`);
  }

  private static isNavigationControlScope(alias: string) {
    return (
      alias.includes('navigation-control-splitbutton') ||
      alias.includes('navigation-control-button') ||
      alias.includes('navigation-control-dropdown')
    );
  }

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

  static selectDropdownSetValue(querySelector: string, value: string, alias = '', index = 0) {
    alias = PageUtils.getAlias(alias);

    if (value) {
      cy.get(alias).find(querySelector).eq(index).find('select').contains('option', value).then(
        (option) => {
          cy.get(alias).find(querySelector).eq(index).find('select').select(option.val()!);
        }
      );
    }
  }
  

  static pSelectDropdownSetValue(querySelector: string, value: string, alias = '', index = 0) {
    alias = PageUtils.getAlias(alias);
    const exactValue = PageUtils.getExactTextMatcher(value);
    const comboboxSelector = '[role="combobox"]';
    const getVisibleComboboxes = ($elements: JQuery<HTMLElement>) =>
      $elements
        .map((_elementIndex, element) => {
          const matchedElement = Cypress.$(element);
          if (matchedElement.is(`${comboboxSelector}:visible`)) {
            return matchedElement.get(0);
          }
          return matchedElement.find(`${comboboxSelector}:visible`).get(0);
        })
        .get();

    if (value) {
      cy.get(alias)
        .find(querySelector)
        .should(($elements) => {
          expect(getVisibleComboboxes($elements as JQuery<HTMLElement>).length, `visible p-select trigger for ${querySelector}`).to.be.greaterThan(index);
        })
        .then(($elements) => {
          return cy.wrap(getVisibleComboboxes($elements as JQuery<HTMLElement>)[index]).scrollIntoView().click();
        });
      cy.contains('[role="option"]:visible', exactValue)
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
    const label = PageUtils.normalizeText(name);

    const getMatches = (selector: string) =>
      cy.get(alias)
        .find(selector)
        .filter(':visible')
        .filter((_index, element) => {
          const htmlElement = element as HTMLElement & { value?: string };
          const candidate =
            htmlElement.innerText ||
            htmlElement.textContent ||
            htmlElement.getAttribute('aria-label') ||
            htmlElement.getAttribute('label') ||
            htmlElement.value ||
            '';
          return PageUtils.normalizeText(candidate) === label;
        });

    if (PageUtils.isNavigationControlScope(alias)) {
      alias = PageUtils.getAlias('');
      getMatches(
        [
          '[data-cy="navigation-control-splitbutton"]:visible button:visible',
          '[data-cy="navigation-control-button"]:visible',
          '[data-cy="navigation-control-dropdown"]:visible',
          '.p-popover:visible [data-cy="navigation-control-dropdown-option"]:visible',
        ].join(', ')
      )
        .first()
        .click({ force });
      return;
    }

    getMatches('button:visible, a:visible, [role="button"]:visible')
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
      .then(($btn) => {
        cy.wrap($btn.first()).as('btn');
        cy.get('@btn').click();
      });
  }

  static clickKababItem(identifier: string, item: string, alias = '') {
    const label = PageUtils.normalizeText(item);

    PageUtils.getKabob(identifier, alias);
    cy.get(PageUtils.getAlias(''))
      .find('.p-popover:visible button:visible, .p-popover:visible a:visible, .p-popover:visible [role="menuitem"]:visible')
      .filter((_index, element) => {
        const htmlElement = element as HTMLElement & { value?: string };
        const candidate =
          htmlElement.innerText ||
          htmlElement.textContent ||
          htmlElement.getAttribute('aria-label') ||
          htmlElement.getAttribute('label') ||
          htmlElement.value ||
          '';
        return PageUtils.normalizeText(candidate) === label;
      })
      .first()
      .click();
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
    const secondCommitteeEmailSelector = '[data-cy="second-committee-email"]:visible';
    const secondCommitteeActionsSelector = '[data-cy="second-committee-admin-actions"]:visible';

    cy.get('body').then(($body) => {
      if (!$body.find(secondCommitteeEmailSelector).length) return;

      cy.get(secondCommitteeEmailSelector).first().as('secondCommitteeEmail');
      cy.get('@secondCommitteeEmail').should('have.value', '');
      cy.get('@secondCommitteeEmail').clear().type('admin@admin.com');
      cy.get('@secondCommitteeEmail').should('have.value', 'admin@admin.com');
      cy.get('@secondCommitteeEmail').click();
      cy.contains(secondCommitteeActionsSelector, 'Save').click();
      cy.get(secondCommitteeEmailSelector).should('not.exist');

      cy.get('body').then(($updatedBody) => {
        if ($updatedBody.find('.p-toast-close-button:visible').length) {
          cy.get('.p-toast-close-button:visible').first().click();
        }
      });
    });
  }

  static submitReportForm() {
    cy.intercept('POST', 'http://localhost:8080/api/v1/web-services/submit-to-fec/').as('SubmitReport');
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
