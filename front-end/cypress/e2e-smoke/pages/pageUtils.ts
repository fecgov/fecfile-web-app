import { getNormalizedFilingPassword } from '../../support/filing-password';

export const currentYear = new Date().getFullYear();

export class PageUtils {
  private static readonly monthNames: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  private static exactText(value: string): RegExp {
    return new RegExp(`^\\s*${Cypress._.escapeRegExp(value)}\\s*$`);
  }

  private static normalizeSidebarLabel(value: string): string {
    return value.replace(/\s+/g, ' ').trim().toLowerCase();
  }

  private static isSidebarHeaderExpanded($header: JQuery<HTMLElement>): boolean {
    const ariaExpanded = ($header.attr('aria-expanded') ?? '').toLowerCase();
    if (ariaExpanded === 'true') return true;
    if (ariaExpanded === 'false') return false;

    const dataHighlight = ($header.attr('data-p-highlight') ?? '').toLowerCase();
    return dataHighlight === 'true' || $header.hasClass('p-highlight');
  }

  static closeToast() {
    const alias = PageUtils.getAlias('');
    cy.get(alias).then(($root) => {
      const closeButton = $root.find('.p-toast-close-button:visible').first();
      if (closeButton.length > 0) {
        cy.wrap(closeButton).click();
      }
    });
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
          const optionValue = option.val();
          expect(optionValue, `select option value for "${value}"`).to.not.be.oneOf([undefined, null]);
          if (optionValue === undefined || optionValue === null) {
            throw new Error(`Missing select option value for "${value}"`);
          }

          cy.get(alias).find(querySelector).eq(index).find('select').select(String(optionValue));
        }
      );
    }
  }
  

  static pSelectDropdownSetValue(querySelector: string, value: string, alias = '', index = 0) {
    alias = PageUtils.getAlias(alias);

    if (value) {
      cy.get(alias).find(querySelector).eq(index).click();
      cy.get('.p-select-overlay:visible')
        .find('[role="option"]')
        .filter((_, option) => PageUtils.exactText(value).test(option.textContent ?? ''))
        .should('have.length', 1)
        .first()
        .scrollIntoView({ offset: { top: 0, left: 0 } })
        .click();
    }
  }

  static calendarSetValue(calendar: string, dateObj: Date = new Date(), alias = '') {
    alias = PageUtils.getAlias(alias);
    cy.get(alias).find(calendar).first().click();
    cy.get('body').find('.p-datepicker-panel:visible').first().as('calendarElement');

    PageUtils.navigateCalendarTo(dateObj);
    PageUtils.pickDay(dateObj.getDate().toString());

    cy.wait(100);
  }

  private static monthIndex(monthText: string): number {
    const monthPrefix = monthText.trim().toLowerCase().slice(0, 3);
    return PageUtils.monthNames.findIndex((monthName) => monthName.toLowerCase().startsWith(monthPrefix));
  }

  static navigateCalendarTo(targetDate: Date) {
    cy.get('@calendarElement')
      .find('.p-datepicker-select-month:visible')
      .first()
      .invoke('text')
      .then((displayedMonthText) => {
        cy.get('@calendarElement')
          .find('.p-datepicker-select-year:visible')
          .first()
          .invoke('text')
          .then((displayedYearText) => {
            const displayedMonth = PageUtils.monthIndex(displayedMonthText);
            const displayedYear = Number(displayedYearText.trim());
            if (displayedMonth < 0 || Number.isNaN(displayedYear)) {
              throw new Error(
                `Unable to resolve displayed calendar month/year from "${displayedMonthText}" and "${displayedYearText}"`,
              );
            }

            const targetMonthIndex = targetDate.getFullYear() * 12 + targetDate.getMonth();
            const displayedMonthIndex = displayedYear * 12 + displayedMonth;
            const monthHops = targetMonthIndex - displayedMonthIndex;
            if (monthHops === 0) {
              return;
            }

            const navButton = monthHops > 0 ? '.p-datepicker-next-button:visible' : '.p-datepicker-prev-button:visible';
            for (let i = 0; i < Math.abs(monthHops); i += 1) {
              cy.get('@calendarElement').find(navButton).first().click();
            }
          });
      });
  }

  static pickDay(day: string) {
    cy.get('@calendarElement')
      .find('td')
      .find('span')
      .not('.p-disabled')
      .parent()
      .contains(PageUtils.exactText(day))
      .first()
      .click();
  }

  static clickSidebarSection(section: string) {
    return PageUtils.clickSidebarItem(section);
  }

  static clickSidebarItem(menuItem: string) {
    const normalizedMenuItem = PageUtils.normalizeSidebarLabel(menuItem);
    const menuLabelSelector = '.p-panelmenu-header-label, .p-panelmenu-item-label';
    const findPanelMenu = (): Cypress.Chainable<JQuery<HTMLElement>> =>
      cy.get('p-panelmenu', { timeout: 15000 }).should('exist');
    const nativeClick = ($link: JQuery<HTMLElement>, label: string) => {
      expect($link.length, `${label} link count for "${menuItem}"`).to.eq(1);
      const link = $link.get(0);
      expect(link, `${label} link element for "${menuItem}"`).to.exist;
      if (!link) {
        throw new Error(`Missing ${label} link element for "${menuItem}"`);
      }
      link.click();
    };
    const clickMenuLink = (visibleOnly: boolean, label: string): Cypress.Chainable<void> =>
      findMenuLink(visibleOnly)
        .should('be.visible')
        .then(($link) => nativeClick($link, label));

    const findMenuLabel = (visibleOnly: boolean): Cypress.Chainable<JQuery<HTMLElement>> => {
      return findPanelMenu()
        .find(menuLabelSelector)
        .filter(
          (_, label) =>
            PageUtils.normalizeSidebarLabel(label.textContent ?? '') === normalizedMenuItem &&
            (!visibleOnly || Cypress.dom.isVisible(label)),
        )
        .should(($labels) => {
          expect(
            $labels.length,
            `${visibleOnly ? 'visible ' : ''}sidebar link matches for "${menuItem}"`,
          ).to.eq(1);
        });
    };

    const findMenuLink = (visibleOnly: boolean): Cypress.Chainable<JQuery<HTMLElement>> =>
      findMenuLabel(visibleOnly)
        .closest('a.p-panelmenu-header-link, a.p-panelmenu-item-link')
        .should('have.length', 1);

    const ensureVisibleMenuLink = (): Cypress.Chainable<JQuery<HTMLElement>> =>
      findMenuLabel(false).then(($candidateLabel) => {
        if (Cypress.dom.isVisible($candidateLabel[0])) {
          return findMenuLink(true);
        }

        const $ownerPanel = $candidateLabel.closest('.p-panelmenu-panel');
        expect($ownerPanel.length, `owner sidebar panel for "${menuItem}"`).to.eq(1);
        const ownerPanelIndex = $ownerPanel.first().index();
        expect(ownerPanelIndex, `owner sidebar panel index for "${menuItem}"`).to.be.greaterThan(-1);

        const findOwnerHeader = (): Cypress.Chainable<JQuery<HTMLElement>> =>
          findPanelMenu()
            .find('.p-panelmenu-panel')
            .eq(ownerPanelIndex)
            .find('> .p-panelmenu-header')
            .should('have.length', 1);

        return findOwnerHeader().then(($ownerHeader) => {
          if (PageUtils.isSidebarHeaderExpanded($ownerHeader)) {
            return findMenuLink(true);
          }

          return findOwnerHeader()
            .find('a.p-panelmenu-header-link')
            .should('have.length', 1)
            .should('be.visible')
            .then(($link) => nativeClick($link, 'owner sidebar header'))
            .then(() =>
              findOwnerHeader().should(($header) => {
                expect(
                  PageUtils.isSidebarHeaderExpanded($header),
                  `owner sidebar header expanded for "${menuItem}"`,
                ).to.eq(true);
              }),
            )
            .then(() => findMenuLink(true));
        });
      });

    return ensureVisibleMenuLink().then(($menuLink) => {
      const isHeaderLink = $menuLink.hasClass('p-panelmenu-header-link');
      const $header = $menuLink.closest('.p-panelmenu-header');
      const shouldClick = !isHeaderLink || !PageUtils.isSidebarHeaderExpanded($header);

      if (shouldClick) {
        return clickMenuLink(true, 'sidebar target');
      }

      return cy.wrap(undefined, { log: false });
    });
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
    const exactName = PageUtils.exactText(name.trim());
    cy.get(alias)
      .find('a:visible')
      .filter((_, link) => exactName.test(link.textContent ?? ''))
      .first()
      .should('exist')
      .click();
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
      .as('btn');
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

  static submitReportForm() {
    cy.intercept('POST', 'http://localhost:8080/api/v1/web-services/submit-to-fec/').as('SubmitReport');
    const alias = PageUtils.getAlias('');
    PageUtils.urlCheck('/submit');
    PageUtils.enterValue('#treasurer_last_name', 'TEST');
    PageUtils.enterValue('#treasurer_first_name', 'TEST');
    return getNormalizedFilingPassword().then((filingPassword) => {
      PageUtils.enterValue('#filingPassword', filingPassword);
      cy.get(alias).find('[data-cy="userCertified"]').first().click();
      PageUtils.clickButton('Submit');
      PageUtils.findOnPage('div', 'Are you sure?');
      PageUtils.clickButton('Confirm');
      cy.wait('@SubmitReport');
    });
  }

  static readonly blurActiveField = () => {
    cy.get('body').click(0, 0);
  };

}
