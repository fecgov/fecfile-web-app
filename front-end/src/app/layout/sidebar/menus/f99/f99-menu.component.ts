import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable, of, switchMap, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { selectActiveReport } from '../../../../store/active-report.selectors';
import { Report } from '../../../../shared/models/report.model';
import { ReportService } from '../../../../shared/services/report.service';
import { ReportSidebarState, SidebarState } from '../../sidebar.component';
import { selectSidebarState } from 'app/store/sidebar-state.selectors';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';

@Component({
  selector: 'app-f99-menu',
  templateUrl: './f99-menu.component.html',
  styleUrls: ['../menu-report.component.scss'],
})
export class F99MenuComponent extends DestroyerComponent implements OnInit {
  activeReport$?: Observable<Report | undefined>;
  items$: Observable<MenuItem[]> = of([]);

  constructor(private store: Store, private reportService: ReportService) {
    super();
  }

  ngOnInit(): void {
    this.activeReport$ = this.store.select(selectActiveReport);

    this.items$ = combineLatest([this.store.select(selectSidebarState), this.activeReport$]).pipe(
      takeUntil(this.destroy$),
      switchMap(([sidebarState, activeReport]: [SidebarState, Report | undefined]) => {
        const isEditable = this.reportService.isEditable(activeReport);

        return of([
          {
            label: 'CREATE REPORT',
            expanded: sidebarState?.section == ReportSidebarState.CREATE,
            visible: isEditable,
            items: [
              {
                label: 'Edit your report',
                routerLink: [`/reports/f99/create/${activeReport?.id}`],
              },
            ],
          },
          {
            label: 'REVIEW A REPORT',
            expanded: sidebarState?.section == ReportSidebarState.REVIEW,
            items: [
              {
                label: 'View summary page',
                routerLink: [`/reports/f99/summary/${activeReport?.id}`],
              },
              {
                label: 'View detailed summary page',
                routerLink: [`/reports/f99/detailed-summary/${activeReport?.id}`],
              },
              {
                label: 'View print preview',
                routerLink: [`/reports/f99/web-print/${activeReport?.id}`],
              },
              {
                label: 'Add a report level memo',
                routerLink: [`/reports/f99/memo/${activeReport?.id}`],
                visible: isEditable,
              },
            ],
          },
          {
            label: 'SUBMIT YOUR REPORT',
            expanded: sidebarState?.section == ReportSidebarState.SUBMISSION,
            items: [
              {
                label: 'Confirm information',
                routerLink: [`/reports/f99/submit/step1/${activeReport?.id}`],
                visible: isEditable,
              },
              {
                label: 'Submit report',
                routerLink: [`/reports/f99/submit/step2/${activeReport?.id}`],
                visible: isEditable,
              },
              {
                label: 'Report status',
                routerLink: [`/reports/f99/submit/status/${activeReport?.id}`],
              },
            ],
          },
        ] as MenuItem[]);
      })
    );
  }
}
