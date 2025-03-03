import { Component, inject, OnInit } from '@angular/core';
import { DestroyerComponent } from '../../../shared/components/app-destroyer.component';
import { selectActiveReport } from '../../../store/active-report.selectors';
import { combineLatest, filter, map, Observable, of, startWith, takeUntil } from 'rxjs';
import { ReportSidebarSection, SidebarState } from '../sidebar.component';
import { Report } from '../../../shared/models/report.model';
import { MenuItem } from 'primeng/api';
import { Store } from '@ngrx/store';
import { ReportService } from '../../../shared/services/report.service';
import { RouteData, collectRouteData } from 'app/shared/utils/route.utils';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  template: '',
})
export abstract class AbstractMenuComponent extends DestroyerComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly reportService = inject(ReportService);
  private readonly router = inject(Router);
  activeReport$: Observable<Report> = this.store.select(selectActiveReport);
  items$: Observable<MenuItem[]> = of([]);
  reportString?: string;
  sidebarState: SidebarState | undefined;

  ngOnInit(): void {
    const routeData$ = this.router.events.pipe(
      takeUntil(this.destroy$),
      filter((event) => event instanceof NavigationEnd),
      map(() => {
        return collectRouteData(this.router);
      }),
      startWith(collectRouteData(this.router)),
    );

    this.items$ = combineLatest([routeData$, this.activeReport$]).pipe(
      takeUntil(this.destroy$),
      map(([routeData, activeReport]: [RouteData, Report]) => {
        const sidebarState = new SidebarState(routeData['sidebarSection']);
        const isEditable = this.reportService.isEditable(activeReport);
        return this.getMenuItems(sidebarState, activeReport, isEditable);
      }),
    );
  }

  createReport(sidebarState: SidebarState, activeReport: Report | undefined): MenuItem {
    return {
      label: 'CREATE A REPORT',
      expanded: sidebarState?.section == ReportSidebarSection.CREATE,
      items: [
        {
          label: 'Edit your report',
          routerLink: [`/reports/${this.reportString}/edit/${activeReport?.id}`],
        },
      ],
    } as MenuItem;
  }

  editReport(sidebarState: SidebarState, activeReport: Report | undefined): MenuItem {
    return {
      label: 'EDIT A REPORT',
      styleClass: 'edit-report-menu-item',
      routerLink: [`/reports/${this.reportString}/edit/${activeReport?.id}`],
      expanded: sidebarState?.section === ReportSidebarSection.CREATE,
    };
  }

  signAndSubmit(sidebarState: SidebarState, activeReport: Report | undefined, isEditable: boolean): MenuItem {
    return {
      label: 'SIGN & SUBMIT',
      expanded: sidebarState?.section == ReportSidebarSection.SUBMISSION,
      items: [
        {
          label: 'Confirm information',
          routerLink: [`/reports/${this.reportString}/submit/step1/${activeReport?.id}`],
          visible: isEditable,
        },
        {
          label: 'Submit report',
          routerLink: [`/reports/${this.reportString}/submit/step2/${activeReport?.id}`],
          visible: isEditable,
        },
        {
          label: 'Report status',
          routerLink: [`/reports/${this.reportString}/submit/status/${activeReport?.id}`],
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

  printPreview(activeReport: Report | undefined): MenuItem {
    return {
      label: 'View print preview',
      routerLink: [`/reports/${this.reportString}/web-print/${activeReport?.id}`],
    };
  }

  addReportLevelMenu(activeReport: Report | undefined, isEditable: boolean): MenuItem {
    return {
      label: 'Add a report level memo',
      routerLink: `/reports/${this.reportString}/memo/${activeReport?.id}`,
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

  reviewTransactions(sidebarState: SidebarState, activeReport: Report | undefined, isEditable: boolean): MenuItem {
    return {
      label: 'REVIEW TRANSACTIONS',
      expanded: sidebarState?.section == ReportSidebarSection.TRANSACTIONS,
      visible: !isEditable,
      routerLink: `/reports/transactions/report/${activeReport?.id}/list`,
    };
  }

  confirmInformation(activeReport: Report | undefined, isEditable: boolean): MenuItem {
    return {
      label: 'Confirm information',
      routerLink: `/reports/${this.reportString}/submit/step1/${activeReport?.id}`,
      visible: isEditable,
    };
  }

  submitReport(activeReport: Report | undefined, isEditable: boolean): MenuItem {
    return {
      label: 'Submit report',
      routerLink: `/reports/${this.reportString}/submit/step2/${activeReport?.id}`,
      visible: isEditable,
    };
  }

  reportStatus(activeReport: Report | undefined, isEditable: boolean): MenuItem {
    return {
      label: 'Report Status',
      routerLink: `/reports/${this.reportString}/submit/status/${activeReport?.id}`,
      visible: !isEditable,
    };
  }

  submitReportArray(activeReport: Report | undefined, isEditable: boolean): MenuItem[] {
    return [
      this.confirmInformation(activeReport, isEditable),
      this.submitReport(activeReport, isEditable),
      this.reportStatus(activeReport, isEditable),
    ];
  }

  abstract getMenuItems(sidebarState: SidebarState, activeReport: Report | undefined, isEditable: boolean): MenuItem[];
}
