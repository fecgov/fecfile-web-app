import { Component, computed, inject } from '@angular/core';
import { selectActiveReport } from '../../../store/active-report.selectors';
import { ReportSidebarSection, SidebarState } from '../sidebar.component';
import { MenuItem } from 'primeng/api';
import { Store } from '@ngrx/store';
import { ReportService } from '../../../shared/services/report.service';
import { collectRouteData } from 'app/shared/utils/route.utils';
import { ActivatedRoute } from '@angular/router';
import { injectNavigationEnd } from 'ngxtension/navigation-end';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  template: '',
})
export abstract class AbstractMenuComponent {
  private readonly store = inject(Store);
  private readonly reportService = inject(ReportService);
  private readonly route = inject(ActivatedRoute);
  readonly activeReport = this.store.selectSignal(selectActiveReport);

  protected abstract readonly reportString: string;

  private readonly navEnd = toSignal(injectNavigationEnd());
  private readonly routeData = computed(() => {
    this.navEnd();
    return collectRouteData(this.route.snapshot);
  });
  readonly items = computed(() => {
    const sidebarState = new SidebarState(this.routeData()['sidebarSection']);
    const isEditable = this.reportService.isEditable(this.activeReport());
    return this.getMenuItems(sidebarState, isEditable);
  });

  createReport(sidebarState: SidebarState): MenuItem {
    return {
      label: 'CREATE A REPORT',
      expanded: sidebarState?.section == ReportSidebarSection.CREATE,
      items: [
        {
          label: 'Edit your report',
          routerLink: [`/reports/${this.reportString}/edit/${this.activeReport().id}`],
        },
      ],
    } as MenuItem;
  }

  editReport(sidebarState: SidebarState): MenuItem {
    return {
      label: 'EDIT A REPORT',
      styleClass: 'edit-report-menu-item',
      routerLink: [`/reports/${this.reportString}/edit/${this.activeReport().id}`],
      expanded: sidebarState?.section === ReportSidebarSection.CREATE,
    };
  }

  signAndSubmit(sidebarState: SidebarState, isEditable: boolean): MenuItem {
    return {
      label: 'SIGN & SUBMIT',
      expanded: sidebarState?.section == ReportSidebarSection.SUBMISSION,
      items: [
        {
          label: 'Confirm information',
          routerLink: [`/reports/${this.reportString}/submit/step1/${this.activeReport().id}`],
          visible: isEditable,
        },
        {
          label: 'Submit report',
          routerLink: [`/reports/${this.reportString}/submit/step2/${this.activeReport().id}`],
          visible: isEditable,
        },
        {
          label: 'Report status',
          routerLink: [`/reports/${this.reportString}/submit/status/${this.activeReport().id}`],
        },
      ],
    } as MenuItem;
  }

  reviewReport(sidebarState: SidebarState): MenuItem {
    return {
      label: 'REVIEW A REPORT',
      expanded: sidebarState?.section == ReportSidebarSection.REVIEW,
      items: [],
    } as MenuItem;
  }

  printPreview(): MenuItem {
    return {
      label: 'View print preview',
      routerLink: [`/reports/${this.reportString}/web-print/${this.activeReport().id}`],
    };
  }

  addReportLevelMenu(isEditable: boolean): MenuItem {
    return {
      label: 'Add a report level memo',
      routerLink: `/reports/${this.reportString}/memo/${this.activeReport().id}`,
      visible: isEditable,
    };
  }

  enterTransaction(sidebarState: SidebarState, isEditable: boolean, transactionItems: MenuItem[]): MenuItem {
    return {
      label: 'ENTER A TRANSACTION',
      expanded: sidebarState?.section == ReportSidebarSection.TRANSACTIONS,
      visible: isEditable,
      items: transactionItems,
    };
  }

  reviewTransactions(sidebarState: SidebarState, isEditable: boolean): MenuItem {
    return {
      label: 'REVIEW TRANSACTIONS',
      expanded: sidebarState?.section == ReportSidebarSection.TRANSACTIONS,
      visible: !isEditable,
      routerLink: `/reports/transactions/report/${this.activeReport().id}/list`,
    };
  }

  confirmInformation(isEditable: boolean): MenuItem {
    return {
      label: 'Confirm information',
      routerLink: `/reports/${this.reportString}/submit/step1/${this.activeReport().id}`,
      visible: isEditable,
    };
  }

  submitReport(isEditable: boolean): MenuItem {
    return {
      label: 'Submit report',
      routerLink: `/reports/${this.reportString}/submit/step2/${this.activeReport().id}`,
      visible: isEditable,
    };
  }

  reportStatus(isEditable: boolean): MenuItem {
    return {
      label: 'Report Status',
      routerLink: `/reports/${this.reportString}/submit/status/${this.activeReport().id}`,
      visible: !isEditable,
    };
  }

  submitReportArray(isEditable: boolean): MenuItem[] {
    return [this.confirmInformation(isEditable), this.submitReport(isEditable), this.reportStatus(isEditable)];
  }

  abstract getMenuItems(sidebarState: SidebarState, isEditable: boolean): MenuItem[];
}
