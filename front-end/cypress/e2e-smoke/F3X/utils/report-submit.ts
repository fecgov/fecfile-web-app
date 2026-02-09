import { ApiUtils } from '../../utils/api';
import { PageUtils } from '../../pages/pageUtils';

export class ReportSubmit {
  static interceptSubmit(alias = 'SubmitReport') {
    return cy.intercept('POST', ApiUtils.apiRoutePathname('/web-services/submit-to-fec/')).as(alias);
  }

  static submitWithPassword(password: string, alias = 'SubmitReport') {
    this.interceptSubmit(alias);

    PageUtils.enterValue('#treasurer_last_name', 'TEST');
    PageUtils.enterValue('#treasurer_first_name', 'TEST');
    PageUtils.enterValue('#filingPassword', password);
    cy.get('[data-cy="userCertified"]').first().click();
    PageUtils.clickButton('Submit');
    PageUtils.findOnPage('div', 'Are you sure?');
    PageUtils.clickButton('Confirm');

    cy.wait(`@${alias}`);
  }
}
