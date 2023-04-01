export const currentYear = new Date().getFullYear();

export class PageUtils {
  static dropdownSetValue(querySelector: string, value: string, alias = '') {
    alias = PageUtils.getAlias(alias);

    if (value) {
      cy.get(alias).find(querySelector).click();
      cy.contains('p-dropdownitem', value).should('be.visible');
      cy.contains('p-dropdownitem', value).click({ scrollBehavior: 'top' });
    }
  }

  static calendarSetValue(calendar: string, dateObj: Date = new Date(), alias = '') {
    alias = PageUtils.getAlias(alias);

    const currentDate: Date = new Date();
    cy.get(alias).find(calendar).as('calendarElement').click();

    //    Choose the year
    cy.get('@calendarElement').find('.p-datepicker-year').click();

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
      console.log('RandomString: Invalid charType');
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

  static clickButton(name: string, alias = '') {
    alias = PageUtils.getAlias(alias);
    cy.get(alias).contains('button', name).click();
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
}
