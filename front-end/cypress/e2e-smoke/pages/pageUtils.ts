export const currentYear = new Date().getFullYear();

export class PageUtils {
  // Contact type dropdowns sometimes render abbreviations (IND/CAN/COM/ORG)
  // even when the underlying value passed by tests is the full label.
  static readonly CONTACT_TYPE_LABEL_TO_ABBR: Record<string, string> = {
    individual: 'IND',
    candidate: 'CAN',
    committee: 'COM',
    organization: 'ORG',
  };

  // US states + DC + territories. Used to make dropdown selection resilient
  // when the UI switches between full names and abbreviations.
  static readonly REGION_NAME_TO_CODE: Record<string, string> = {
    Alabama: 'AL',
    Alaska: 'AK',
    Arizona: 'AZ',
    Arkansas: 'AR',
    California: 'CA',
    Colorado: 'CO',
    Connecticut: 'CT',
    Delaware: 'DE',
    'District of Columbia': 'DC',
    Florida: 'FL',
    Georgia: 'GA',
    Hawaii: 'HI',
    Idaho: 'ID',
    Illinois: 'IL',
    Indiana: 'IN',
    Iowa: 'IA',
    Kansas: 'KS',
    Kentucky: 'KY',
    Louisiana: 'LA',
    Maine: 'ME',
    Maryland: 'MD',
    Massachusetts: 'MA',
    Michigan: 'MI',
    Minnesota: 'MN',
    Mississippi: 'MS',
    Missouri: 'MO',
    Montana: 'MT',
    Nebraska: 'NE',
    Nevada: 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND',
    Ohio: 'OH',
    Oklahoma: 'OK',
    Oregon: 'OR',
    Pennsylvania: 'PA',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    Tennessee: 'TN',
    Texas: 'TX',
    Utah: 'UT',
    Vermont: 'VT',
    Virginia: 'VA',
    Washington: 'WA',
    'West Virginia': 'WV',
    Wisconsin: 'WI',
    Wyoming: 'WY',

    // territories
    'American Samoa': 'AS',
    Guam: 'GU',
    'Northern Mariana Islands': 'MP',
    'Puerto Rico': 'PR',
    'U.S. Virgin Islands': 'VI',
  };

  static readonly REGION_CODE_TO_NAME: Record<string, string> = Object.entries(
    PageUtils.REGION_NAME_TO_CODE,
  ).reduce((acc, [name, code]) => {
    acc[code] = name;
    return acc;
  }, {} as Record<string, string>);

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

    const raw = (value ?? '').toString().trim();
    if (!raw) return;

    const optionSelector = [
      '.p-select-option',
      '.p-dropdown-item',
      '.p-autocomplete-item',
      '.p-autocomplete-option',
      'p-selectitem',
      '.p-selectitem',
      '[role="option"]',
    ].join(',');

    const overlaySelector = [
      '.p-select-overlay:visible',
      '.p-select-panel:visible',
      '.p-dropdown-panel:visible',
      '.p-overlay:visible',
      '.p-connected-overlay:visible',
    ].join(',');

    const normalize = (s: string) => s.replaceAll('\u00a0', ' ').replaceAll(/\s+/g, ' ').trim();

    const buildVariants = (sel: string, v: string) => {
      const variants: string[] = [v];
      const lower = v.toLowerCase();

      // contact type labels/abbreviations
      const mappedAbbr = PageUtils.CONTACT_TYPE_LABEL_TO_ABBR[lower];
      if (mappedAbbr) variants.push(mappedAbbr);
      const mappedLabel = Object.entries(PageUtils.CONTACT_TYPE_LABEL_TO_ABBR)
        .find(([, abbr]) => abbr.toLowerCase() === lower)?.[0];
      if (mappedLabel) variants.push(mappedLabel);

      // state/territory name <-> code
      const maybeCode = PageUtils.REGION_NAME_TO_CODE[v] || PageUtils.REGION_NAME_TO_CODE[normalize(v)];
      if (maybeCode) variants.push(maybeCode);
      const upper = v.toUpperCase();
      if (upper.length === 2 && PageUtils.REGION_CODE_TO_NAME[upper]) {
        variants.push(PageUtils.REGION_CODE_TO_NAME[upper]);
      }

      // If selector looks like it is a state/territory field, prefer also trying the code.
      const looksLikeRegion = /\bstate\b|territory|region|\[inputid=['"]state['"]\]|#state\b/i.test(sel);
      if (looksLikeRegion && maybeCode) variants.unshift(maybeCode);

      return Array.from(new Set(variants.filter(Boolean)));
    };

    const variants = buildVariants(querySelector, raw);
    const matchers = variants.map((v) => new RegExp(String.raw`\\b${PageUtils.escapeRegExp(v)}\\b`, 'i'));

    cy.get(alias)
      .find(querySelector)
      .eq(index)
      .should('exist')
      .then(($host) => {
        const $clickTarget = $host
          .find(
            [
              '[role="combobox"]',
              '[aria-haspopup="listbox"]',
              '[data-pc-section="trigger"]',
              '.p-select',
              '.p-dropdown',
              '.p-select-trigger',
              '.p-dropdown-trigger',
              '.p-select-dropdown',
              '.p-dropdown-trigger-icon',
              '.p-inputwrapper',
              '[data-pc-section="label"]',
              '.p-select-label',
              '.p-dropdown-label',
            ].join(', '),
          )
          .filter(':visible')
          .first();

        let $target = $clickTarget.length ? $clickTarget : $host;
        if (!$clickTarget.length && $host.is('input')) {
          const $closest = $host.closest('app-searchable-select, p-select, .p-select, p-dropdown, .p-dropdown');
          if ($closest.length) $target = $closest;
        }
        const ariaControls =
          $target.attr('aria-controls') ||
          $host.find('[aria-controls]').first().attr('aria-controls');

        cy.wrap($target).scrollIntoView().click({ force: true });

        const resolvePanel = () => {
          if (ariaControls) {
            return cy
              .get(`[id="${ariaControls}"]`, { timeout: 10000 })
              .should('exist')
              .then(($list) => {
                const $panel = $list.closest(
                  '.p-select-overlay, .p-select-panel, .p-dropdown-panel, .p-overlay, .p-connected-overlay',
                );
                return cy.wrap($panel.length ? $panel : $list);
              });
          }
          return cy.get(overlaySelector, { timeout: 10000 }).last();
        };

        resolvePanel().then(($panel) => {
          // Some selects support filtering; typing makes virtualized lists reliable.
          const filterSel = [
            'input.p-select-filter',
            'input.p-dropdown-filter',
            'input[role="searchbox"]',
            'input[aria-label="Search"]',
          ].join(', ');

          const filterSeed = variants.find((v) => v.length === 2) || raw;

          cy.wrap($panel)
            .find(filterSel)
            .filter(':visible')
            .then(($filter) => {
              if ($filter.length) {
                cy.wrap($filter.first()).clear({ force: true }).type(filterSeed, {
                  force: true,
                  delay: 20,
                });
              }
            });

          cy.wrap($panel)
            .find(optionSelector, { timeout: 10000 })
            .filter(':visible')
            .should('have.length.greaterThan', 0)
            .then(($opts) => {
              const texts = $opts.toArray().map((el) => normalize((el.textContent ?? '') as string));
              const idx = texts.findIndex((t) => matchers.some((rx) => rx.test(t)));

              if (idx < 0) {
                const sample = texts.slice(0, 10).join(' | ');
                throw new Error(
                  `dropdownSetValue: option not found for "${raw}" (variants=${variants.join(', ')}) in ${querySelector}. ` +
                    `First options: ${sample}`,
                );
              }

              cy.wrap($opts.eq(idx)).scrollIntoView().click({ force: true });
            });
        });
      });
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
    cy.get(alias).contains('p-accordion-header', name).click();
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

  static escapeRegExp(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  static enterValue(fieldName: string, fieldValue: any, alias='', index=0) {
    if ( alias.length > 0 ){ 
      cy.get(alias).find(fieldName).eq(index).type(fieldValue);
    } else {
      cy.get(fieldName).eq(index).type(fieldValue);
    }
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
