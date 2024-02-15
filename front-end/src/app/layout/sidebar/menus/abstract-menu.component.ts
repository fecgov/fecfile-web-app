import { Component, OnInit } from '@angular/core';
import { DestroyerComponent } from '../../../shared/components/app-destroyer.component';
import { selectActiveReport } from '../../../store/active-report.selectors';
import { filter, map, Observable, of, takeUntil } from 'rxjs';
import { ReportSidebarSection, SidebarState } from '../sidebar.component';
import { Report } from '../../../shared/models/report.model';
import { MenuItem } from 'primeng/api';
import { Store } from '@ngrx/store';
import { ReportService } from '../../../shared/services/report.service';
import { collectRouteData } from 'app/shared/utils/route.utils';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  template: '',
})
export abstract class AbstractMenuComponent extends DestroyerComponent implements OnInit {
  activeReport$?: Observable<Report | undefined>;
  activeReport: Report | undefined;
  items$: Observable<MenuItem[]> = of([]);
  reportString?: string;
  sidebarState: SidebarState | undefined;

  protected constructor(
    private store: Store,
    private reportService: ReportService,
    private router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
    this.activeReport$ = this.store.select(selectActiveReport);
    this.sidebarState = new SidebarState(collectRouteData(this.router)['sidebarSection']);

    this.items$ = this.activeReport$.pipe(
      takeUntil(this.destroy$),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      map((activeReport: Report | undefined) => {
        this.activeReport = activeReport;
        return this.updateMenuItems(activeReport);
      }),
    );

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.sidebarState = new SidebarState(collectRouteData(this.router)['sidebarSection']);
      this.items$ = of(this.updateMenuItems(this.activeReport));
    });
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

  updateMenuItems(activeReport: Report | undefined) {
    const isEditable = this.reportService.isEditable(activeReport);

    return this.getMenuItems(this.sidebarState as SidebarState, activeReport, isEditable);
  }

  abstract getMenuItems(sidebarState: SidebarState, activeReport: Report | undefined, isEditable: boolean): MenuItem[];
}
