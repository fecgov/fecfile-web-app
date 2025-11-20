import { Report, ReportStatus } from 'app/shared/models';
import { MenuItem } from 'primeng/api';

export enum ReportSidebarSection {
  'TRANSACTIONS',
  'REVIEW',
  'SUBMISSION',
  'CREATE',
}

export class MenuInfo {
  static editReport(sidebarSection: ReportSidebarSection, report: Report, label = 'EDIT A REPORT'): MenuItem {
    return {
      label,
      routerLink: [`/reports/${report.report_type.toLowerCase()}/edit/${report.id}`],
      expanded: sidebarSection === ReportSidebarSection.CREATE,
    };
  }

  static reviewReport(sidebarSection: ReportSidebarSection, items: MenuItem[]): MenuItem {
    return {
      label: 'REVIEW A REPORT',
      expanded: sidebarSection === ReportSidebarSection.REVIEW,
      items,
    };
  }

  static printPreview(report: Report): MenuItem {
    return {
      label: 'View print preview',
      routerLink: [`/reports/${report.report_type.toLowerCase()}/web-print/${report.id}`],
    };
  }

  static addReportLevelMenu(report: Report, isEditable: boolean): MenuItem {
    return {
      label: 'Add a report level memo',
      routerLink: `/reports/${report.report_type.toLowerCase()}/memo/${report.id}`,
      visible: isEditable,
    };
  }

  static enterTransaction(
    sidebarSection: ReportSidebarSection,
    isEditable: boolean,
    transactionItems: MenuItem[],
  ): MenuItem {
    return {
      label: 'ENTER A TRANSACTION',
      expanded: sidebarSection === ReportSidebarSection.TRANSACTIONS,
      visible: isEditable,
      items: transactionItems,
    };
  }

  static reviewTransactions(sidebarSection: ReportSidebarSection, report: Report, isEditable: boolean): MenuItem {
    return {
      label: 'REVIEW TRANSACTIONS',
      expanded: sidebarSection === ReportSidebarSection.TRANSACTIONS,
      visible: !isEditable,
      routerLink: `/reports/transactions/report/${report.id}/list`,
    };
  }

  static reportStatus(report: Report): MenuItem {
    return {
      label: 'Report status',
      routerLink: `/reports/${report.report_type.toLowerCase()}/submit/status/${report.id}`,
      visible: report.report_status !== ReportStatus.IN_PROGRESS,
    };
  }

  static submitReport(
    sidebarSection: ReportSidebarSection,
    report: Report,
    isEditable: boolean,
    label: string,
  ): MenuItem {
    return {
      label,
      expanded: sidebarSection === ReportSidebarSection.SUBMISSION,
      items: MenuInfo.submitReportArray(report, isEditable),
    };
  }

  static submitReportArray(report: Report, isEditable: boolean): MenuItem[] {
    return [
      {
        label: 'Submit report',
        routerLink: `/reports/${report.report_type.toLowerCase()}/submit/${report.id}`,
        visible: isEditable,
      },
      MenuInfo.reportStatus(report),
    ];
  }

  static manageTransactions(report: Report): MenuItem {
    return {
      label: 'Manage your transactions',
      routerLink: `/reports/transactions/report/${report.id}/list`,
    };
  }

  static addTransactions(report: Report): MenuItem[] {
    return [
      {
        label: 'Add a receipt',
        routerLink: `/reports/transactions/report/${report.id}/select/receipt`,
      },
      {
        label: 'Add a disbursement',
        routerLink: `/reports/transactions/report/${report.id}/select/disbursement`,
      },
      {
        label: 'Add loans and debts',
        routerLink: `/reports/transactions/report/${report.id}/select/loans-and-debts`,
      },
      { label: 'Add other transactions', styleClass: 'menu-item-disabled' },
    ];
  }

  static viewSummary(report: Report): MenuItem[] {
    return [
      {
        label: 'View summary page',
        routerLink: `/reports/${report.report_type.toLowerCase()}/summary/${report.id}`,
      },
      {
        label: 'View detailed summary page',
        routerLink: `/reports/${report.report_type.toLowerCase()}/detailed-summary/${report.id}`,
      },
    ];
  }
}
