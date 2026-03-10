import { buildDataCy } from '../../../utils/dataCy';

const clickSidebarLink = (label: string) => cy.getByDataCy(buildDataCy('report-sidebar', label, 'link')).click({ force: true });

export class ReviewReport {
  static Summary() {
    clickSidebarLink('REVIEW A REPORT');
    clickSidebarLink('View summary page');
  }

  static DSP() {
    clickSidebarLink('REVIEW A REPORT');
    clickSidebarLink('View detailed summary page');
  }

  static PrintPreview() {
    clickSidebarLink('REVIEW A REPORT');
    clickSidebarLink('View print preview');
  }

  static AddReportLevelMemo() {
    clickSidebarLink('REVIEW A REPORT');
    clickSidebarLink('Add a report level memo');
  }
}
