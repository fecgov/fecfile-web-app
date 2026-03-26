export const currentYear = new Date().getFullYear();

export class PageUtils {
  private static exactText(value: string): RegExp {
    return new RegExp(String.raw`^\s*${Cypress._.escapeRegExp(value)}\s*$`, 'i'); // NOSONAR
  }

  private static normalizeButtonLabel(value: string): string {
    return value.replaceAll(/\s+/g, ' ').trim();
  }

  private static normalizeSidebarLabel(value: string): string {
    return value.replaceAll(/\s+/g, ' ').trim().toLowerCase();
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
    cy.get('body').find('.p-datepicker-panel').as('calendarElement');

    PageUtils.pickYear(dateObj.getFullYear());
    PageUtils.pickMonth(dateObj.getMonth());
    PageUtils.pickDay(dateObj.getDate().toString());

    cy.get('@calendarElement').should('not.exist');
  }

  static pickDay(day: string) {
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
    const months: Array<string> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const targetMonth = months[month];
    cy.get('@calendarElement').find('.p-datepicker-month').contains(targetMonth).click({ force: true });
  }

  static pickYear(year: number) {
    const currentCalendarYear: number = new Date().getFullYear();

    cy.get('@calendarElement').find('.p-datepicker-select-year').should('be.visible').click({ force: true });
    cy.wait(100);
    cy.get('@calendarElement').then(($calendarElement) => {
      if ($calendarElement.find('.p-datepicker-select-year:visible').length > 0) {
        cy.get('@calendarElement').find('.p-datepicker-select-year').click({ force: true });
      }
    });
    cy.get('@calendarElement').find('.p-datepicker-decade').should('be.visible');

    const decadeStart: number = currentCalendarYear - (currentCalendarYear % 10);
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
    return PageUtils.clickSidebarItem(section);
  }

  static clickSidebarItem(menuItem: string) { // NOSONAR - sidebar helper intentionally uses nested closures for deterministic menu expansion
    const normalizedMenuItem = PageUtils.normalizeSidebarLabel(menuItem);
    const menuLabelSelector = '.p-panelmenu-header-label, .p-panelmenu-item-label';
    const findPanelMenu = (): Cypress.Chainable<JQuery<HTMLElement>> => // NOSONAR - scoped sidebar helper
      cy.get('p-panelmenu', { timeout: 15000 }).should('exist');
    const nativeClick = ($link: JQuery<HTMLElement>, label: string) => { // NOSONAR - scoped sidebar helper
      expect($link.length, `${label} link count for "${menuItem}"`).to.eq(1);
      const link = $link.get(0);
      expect(link, `${label} link element for "${menuItem}"`).to.exist;
      if (!link) {
        throw new Error(`Missing ${label} link element for "${menuItem}"`);
      }
      link.click();
    };
    const clickMenuLink = (visibleOnly: boolean, label: string): Cypress.Chainable<void> => // NOSONAR - scoped sidebar helper
      findMenuLink(visibleOnly)
        .should('be.visible')
        .then(($link) => nativeClick($link, label)); // NOSONAR - scoped sidebar helper

    const findMenuLabel = (visibleOnly: boolean): Cypress.Chainable<JQuery<HTMLElement>> => { // NOSONAR - scoped sidebar helper
      return findPanelMenu()
        .find(menuLabelSelector)
        .filter(
          (_, label) => // NOSONAR - scoped sidebar helper
            PageUtils.normalizeSidebarLabel(label.textContent ?? '') === normalizedMenuItem &&
            (!visibleOnly || Cypress.dom.isVisible(label)),
        )
        .should(($labels) => { // NOSONAR - scoped sidebar helper
          expect(
            $labels.length,
            `${visibleOnly ? 'visible ' : ''}sidebar link matches for "${menuItem}"`,
          ).to.eq(1);
        });
    };

    const findMenuLink = (visibleOnly: boolean): Cypress.Chainable<JQuery<HTMLElement>> => // NOSONAR - scoped sidebar helper
      findMenuLabel(visibleOnly)
        .closest('a.p-panelmenu-header-link, a.p-panelmenu-item-link')
        .should('have.length', 1);

    const ensureVisibleMenuLink = (): Cypress.Chainable<JQuery<HTMLElement>> => // NOSONAR - scoped sidebar helper
      findMenuLabel(false).then(($candidateLabel) => { // NOSONAR - scoped sidebar helper
        if (Cypress.dom.isVisible($candidateLabel[0])) {
          return findMenuLink(true);
        }

        const $ownerPanel = $candidateLabel.closest('.p-panelmenu-panel');
        expect($ownerPanel.length, `owner sidebar panel for "${menuItem}"`).to.eq(1);
        const ownerPanelIndex = $ownerPanel.first().index();
        expect(ownerPanelIndex, `owner sidebar panel index for "${menuItem}"`).to.be.greaterThan(-1);

        const findOwnerHeader = (): Cypress.Chainable<JQuery<HTMLElement>> => // NOSONAR - scoped sidebar helper
          findPanelMenu()
            .find('.p-panelmenu-panel')
            .eq(ownerPanelIndex)
            .find('> .p-panelmenu-header')
            .should('have.length', 1);

        return findOwnerHeader().then(($ownerHeader) => { // NOSONAR - scoped sidebar helper
          if (PageUtils.isSidebarHeaderExpanded($ownerHeader)) {
            return findMenuLink(true);
          }

          return findOwnerHeader()
            .find('a.p-panelmenu-header-link')
            .should('have.length', 1)
            .should('be.visible')
            .then(($link) => nativeClick($link, 'owner sidebar header')) // NOSONAR - scoped sidebar helper
            .then(() => // NOSONAR - scoped sidebar helper
              findOwnerHeader().should(($header) => { // NOSONAR - scoped sidebar helper
                expect(
                  PageUtils.isSidebarHeaderExpanded($header),
                  `owner sidebar header expanded for "${menuItem}"`,
                ).to.eq(true);
              }),
            )
            .then(() => findMenuLink(true)); // NOSONAR - scoped sidebar helper
        });
      });

    return ensureVisibleMenuLink().then(($menuLink) => { // NOSONAR - scoped sidebar helper
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
      .contains('.accordion-text strong, .header-label', exactLabel)
      .first()
      .closest('p-accordion-header, .p-accordionheader')
      .should('be.visible')
      .click();
  }

  static clickButton(name: string, alias = '', force = false) {
    alias = PageUtils.getAlias(alias);
    const normalizedName = PageUtils.normalizeButtonLabel(name);

    const resolveLabel = (button: HTMLElement): string => {
      const sources = [
        button.getAttribute('aria-label') ?? '',
        button.getAttribute('label') ?? '',
        button instanceof HTMLInputElement ? button.value : '',
        button.textContent ?? '',
      ];
      const matchingLabel = sources.find((value) => PageUtils.normalizeButtonLabel(value).length > 0) ?? '';
      return PageUtils.normalizeButtonLabel(matchingLabel);
    };

    cy.get(alias).then(($root) => {
      const selector = 'button:visible, input[type="button"]:visible, input[type="submit"]:visible';
      const directMatches = $root.filter(selector);
      const nestedMatches = $root.find(selector);
      const candidates = Cypress.$([...directMatches.toArray(), ...nestedMatches.toArray()]);
      const uniqueCandidates = Cypress.$(Array.from(new Set(candidates.toArray())));
      const matchingButtons = uniqueCandidates.filter((_, element) => {
        return resolveLabel(element) === normalizedName;
      });

      expect(matchingButtons.length, `visible button match for ${String(name)}`).to.eq(1);
      const button = matchingButtons.get(0);
      expect(button, `button element for ${String(name)}`).to.exist;
      if (!button) {
        throw new Error(`Missing visible button match for ${String(name)}`);
      }

      cy.wrap(button).click({ force });
    });
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
    const normalizedIdentifier = PageUtils.normalizeButtonLabel(identifier);
    cy.get(alias).find('tbody tr:visible, tr:visible').then(($rows) => {
      const matchingRows = $rows.filter((_, row) => {
        const $row = Cypress.$(row);
        const labels = $row
          .find('td:visible, th:visible, a:visible')
          .toArray()
          .map((element) => PageUtils.normalizeButtonLabel(element.textContent ?? ''))
          .filter(Boolean);

        return labels.includes(normalizedIdentifier);
      });

      expect(matchingRows.length, `kabob row matches for ${identifier}`).to.eq(1);
      const row = matchingRows.get(0);
      expect(row, `kabob row for ${identifier}`).to.exist;
      if (!row) {
        throw new Error(`Missing kabob row for ${identifier}`);
      }

      cy.wrap(row).within(() => {
        cy.get('app-table-actions-button button:visible')
          .should('have.length.at.least', 1)
          .first()
          .click();
      });
    });
  }

  static clickKababItem(identifier: string, item: string, alias = '') {
    PageUtils.getKabob(identifier, alias);
    cy.get(PageUtils.getAlias(''))
      .find('.p-popover:visible')
      .find('button:visible, a:visible')
      .then(($items) => {
        const matchingItems = $items.filter((_, element) => PageUtils.exactText(item).test(element.textContent ?? ''));
        expect(matchingItems.length, `kabob action matches for ${item}`).to.eq(1);
        const action = matchingItems.get(0);
        expect(action, `kabob action for ${item}`).to.exist;
        if (!action) {
          throw new Error(`Missing kabob action for ${item}`);
        }

        cy.wrap(action).click();
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
    cy.get(PageUtils.getAlias('[data-cy="second-committee-admin-actions"]:visible'))
      .should(Cypress._.noop) // No-op to avoid failure if it doesn't exist
      .then(($email) => {
        if ($email.length) {
          cy.contains('Welcome to FECfile+').should('exist').click(); // Ensures that the modal is in focus
          cy.get('#email').should('have.value', '');
          cy.get('#email').clear().type('admin@admin.com'); // Clearing the field makes the typing behavior consistent
          cy.get('#email').should('have.value', 'admin@admin.com');
          cy.get('#email').click();
          PageUtils.clickButton('Save', '[data-cy="second-committee-admin-actions"]');
          cy.get(PageUtils.getAlias('')).find('.p-toast-close-button').click();
        }
      });
  }

  static submitReportForm() {
    cy.intercept('POST', 'http://localhost:8080/api/v1/web-services/submit-to-fec/').as('SubmitReport');
    const alias = PageUtils.getAlias('');
    PageUtils.urlCheck('/submit');
    cy.contains('h1', 'Submit report').should('be.visible');
    PageUtils.enterValue('#treasurer_last_name', 'TEST');
    PageUtils.enterValue('#treasurer_first_name', 'TEST');
    PageUtils.enterValue('#filingPassword', 'filing!Passw0rd');
    cy.get(alias).find('[data-cy="userCertified"]').first().click();
    PageUtils.clickButton('Submit');
    PageUtils.findOnPage('div', 'Are you sure?');
    PageUtils.clickButton('Confirm');
    cy.wait('@SubmitReport');
  }
}
