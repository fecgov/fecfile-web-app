import * as _ from 'lodash';

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
      if (querySelector.includes('due_date_setting') || querySelector.includes('interest_rate_setting')) {
        cy.get(alias).find(querySelector).first().click();
      } else {
        cy.get(alias).find(querySelector).click();
      }
      cy.contains('p-dropdownitem', value).should('be.visible');
      cy.contains('p-dropdownitem', value).click();
    }
  }

  static calendarSetValue(calendar: string, dateObj: Date = new Date(), alias = '') {
    alias = PageUtils.getAlias(alias);
    const currentDate: Date = new Date();
    //
    if (calendar.includes('date_incurred') || calendar.includes('due_date') || calendar.includes('date_signed')) {
      cy.get(alias).find(calendar).first().as('calendarElement').click();
    } else {
      cy.get(alias).find(calendar).as('calendarElement').click();
    }

    cy.get('@calendarElement').find('.p-datepicker-year').click();
    //    Choose the year
    const year: number = dateObj.getFullYear();
    const currentYear: number = currentDate.getFullYear();
    const decadeStart: number = currentYear - (currentYear % 10);
    const decadeEnd: number = decadeStart + 9;
    if (year < decadeStart) {
      for (let i = 0; i < decadeStart - year; i += 10) {
        cy.get('@calendarElement').find('.p-datepicker-prev').click();
      }
    }
    if (year > decadeEnd) {
      for (let i = 0; i < year - decadeEnd; i += 10) {
        cy.get('@calendarElement').find('.p-datepicker-next').click();
      }
    }
    cy.get('@calendarElement').find('.p-yearpicker-year').contains(year.toString()).click();

    //    Choose the month
    const Months: Array<string> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const Month: string = Months[dateObj.getMonth()];
    cy.get('@calendarElement').find('.p-monthpicker-month').contains(Month).click();

    //    Choose the day
    const Day: string = dateObj.getDate().toString();
    cy.get('@calendarElement').find('td').find('span').not('.p-disabled').parent().contains(Day).click();
  }

  static randomString(
    strLength: number,
    charType: 'special' | 'alphanumeric' | 'alphabet' | 'numeric' | 'symbols' = 'alphanumeric',
    includeCurlyBraces = true
  ): string {
    // prettier-ignore
    let symbols: Array<string> = [' ', '!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+', ',', '-', '.', '/', '|', '~', '`'];
    if (includeCurlyBraces) symbols = symbols.concat('{', '}');
    // prettier-ignore
    const alphabet: Array<string> =   ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',];
    // prettier-ignore
    const numeric: Array<string> = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    const alphanumeric = alphabet.concat(numeric);
    const special = alphanumeric.concat(symbols);

    let characters: Array<string> = [];
    if (charType == 'special') {
      characters = special;
    } else if (charType == 'alphanumeric') {
      characters = alphanumeric;
    } else if (charType == 'numeric') {
      characters = numeric;
    } else if (charType == 'alphabet') {
      characters = alphabet;
    } else if (charType == 'symbols') {
      characters = symbols;
    } else {
      return '';
    }

    let outString = '';
    while (outString.length < strLength) {
      outString += _.sample(characters);
    }
    /*
     *  Cypress uses {} to escape the previous character.
     *  This is necessary to avoid accidentally passing
     *  cypress a command
     */
    return outString.replaceAll('{', '{{}');
  }

  static clickSidebarSection(section: string) {
    cy.get('p-panelmenu').contains(section).parent().as('section');
    cy.get('@section').click({ force: true });
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

  static clickButton(name: string, alias = '', force = false) {
    alias = PageUtils.getAlias(alias);
    if (force) {
      cy.get(alias).contains('button', name).click({ force: true });
    } else {
      cy.get(alias).contains('button', name).click();
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

  static searchBoxInput(input: string) {
    cy.get('[role="searchbox"]').type(input.slice(0, 3));
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
}
