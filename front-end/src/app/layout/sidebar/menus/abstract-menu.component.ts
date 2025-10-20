import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ReportStatus } from 'app/shared/models';
import { collectRouteData } from 'app/shared/utils/route.utils';
import { MenuItem } from 'primeng/api';
import { filter, map, startWith } from 'rxjs';
import { ReportService } from '../../../shared/services/report.service';
import { selectActiveReport } from '../../../store/active-report.selectors';
import { ReportSidebarSection, SidebarState } from '../sidebar.component';

@Component({
  template: '',
})
export abstract class AbstractMenuComponent {
  private readonly store = inject(Store);
  private readonly reportService = inject(ReportService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly activeReport = this.store.selectSignal(selectActiveReport);
  protected readonly routeDataSignal = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => {
        return collectRouteData(this.route.snapshot);
      }),
      startWith(collectRouteData(this.route.snapshot)),
    ),
  );
  itemsSignal = computed(() => {
    const routeData = this.routeDataSignal();
    if (!routeData) return [];
    const sidebarState = new SidebarState(routeData['sidebarSection']);
    const isEditable = this.reportService.isEditable(this.activeReport());
    return this.getMenuItems(sidebarState, isEditable);
  });
  reportString?: string;

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

  editReport(
    sidebarState: SidebarState,
    editLabel = 'EDIT A REPORT',
    editLabelStyleClass = 'edit-report-menu-item',
  ): MenuItem {
    return {
      label: editLabel,
      styleClass: editLabelStyleClass,
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
          label: 'Submit report',
          routerLink: [`/reports/${this.reportString}/submit/${this.activeReport().id}`],
          visible: isEditable,
        },
        {
          label: 'Report status',
          routerLink: [`/reports/${this.reportString}/submit/status/${this.activeReport().id}`],
          visible: this.activeReport().report_status !== ReportStatus.IN_PROGRESS,
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

  submitReport(isEditable: boolean): MenuItem {
    return {
      label: 'Submit report4',
      routerLink: `/reports/${this.reportString}/submit/${this.activeReport().id}`,
      visible: isEditable,
    };
  }

  reportStatus(): MenuItem {
    return {
      label: 'Report Status333',
      routerLink: `/reports/${this.reportString}/submit/status/${this.activeReport().id}`,
      visible: this.activeReport().report_status !== ReportStatus.IN_PROGRESS,
    };
  }

  submitReportArray(isEditable: boolean): MenuItem[] {
    return [this.submitReport(isEditable), this.reportStatus()];
  }

  abstract getMenuItems(sidebarState: SidebarState, isEditable: boolean): MenuItem[];
}
