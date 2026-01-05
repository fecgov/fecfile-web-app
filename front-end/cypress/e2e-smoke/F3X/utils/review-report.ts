import { PageUtils } from '../../pages/pageUtils';

export class ReviewReport {
  static Summary() {
    PageUtils.clickSidebarItem('REVIEW A REPORT');
    PageUtils.clickSidebarItem('View summary page');
  }

  static DSP() {
    PageUtils.clickSidebarItem('REVIEW A REPORT');
    PageUtils.clickSidebarItem('View detailed summary page');
  }

  static PrintPreview() {
    PageUtils.clickSidebarItem('REVIEW A REPORT');
    PageUtils.clickSidebarItem('View print preview');
  }

  static AddReportLevelMemo() {
    PageUtils.clickSidebarItem('REVIEW A REPORT');
    PageUtils.clickSidebarItem('Add a report level memo');
  }
}
