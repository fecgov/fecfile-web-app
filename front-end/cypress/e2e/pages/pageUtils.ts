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
    const currentDate: Date = new Date();
    //
    cy.get(alias).find(calendar).first().as('calendarElement').click();

    cy.get('@calendarElement').find('.p-datepicker-select-year').first().scrollIntoView().click();
    //    Choose the year
    const year: number = dateObj.getFullYear();
    const currentYear: number = currentDate.getFullYear();
    const decadeStart: number = currentYear - (currentYear % 10);
    const decadeEnd: number = decadeStart + 9;
    if (year < decadeStart) {
      for (let i = 0; i < decadeStart - year; i += 10) {
        cy.get('@calendarElement').find('.p-datepicker-prev-button').scrollIntoView().click();
      }
    }
    if (year > decadeEnd) {
      for (let i = 0; i < year - decadeEnd; i += 10) {
        cy.get('@calendarElement').find('.p-datepicker-next-button').scrollIntoView().click();
      }
    }
    cy.get('@calendarElement')
      .find('.p-datepicker-year')
      .contains(year.toString())
      .scrollIntoView()
      .click({ force: true });

    //    Choose the month
    const Months: Array<string> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const Month: string = Months[dateObj.getMonth()];
    cy.get('@calendarElement').find('.p-datepicker-month').contains(Month).scrollIntoView().click({ force: true });

    //    Choose the day
    const Day: string = dateObj.getDate().toString();
    cy.get('@calendarElement')
      .find('td')
      .find('span')
      .not('.p-disabled')
      .parent()
      .contains(Day)
      .scrollIntoView()
      .click();
    cy.wait(100);
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

  static searchBoxInput(input: string) {
    cy.get('[id="searchBox"]').type(input.slice(0, 3));
    cy.intercept({
      method: 'Get',
    }).as('search');
    cy.wait('@search');
    cy.contains(input).should('exist');
    cy.contains(input).click({ force: true });
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
   * Important note, the identifier must be unique. If there are multiple rows with the same info
   * it will fail.
   * Also, the identifier must be directly under the <td>.
   * Example: <td>text</td> is good, but <td><div>text</div></td> won't work
   * @param identifier string to identify which Row the kabob is in.
   */
  static getKabob(identifier: string) {
    const alias = PageUtils.getAlias('');
    cy.get(alias)
      .contains(identifier)
      .closest('td')
      .siblings()
      .last()
      .find('app-table-actions-button')
      .children()
      .last()
      .click();
    return cy.get(alias).find('.p-popover');
  }

  static clickKababItem(identifier: string, item: string) {
    PageUtils.getKabob(identifier).contains(item).first().click({ force: true });
  }
}
