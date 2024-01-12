import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable, of, switchMap, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { selectActiveReport } from '../../../../store/active-report.selectors';
import { Report } from '../../../../shared/models/report.model';
import { ReportService } from '../../../../shared/services/report.service';
import { selectSidebarState } from 'app/store/sidebar-state.selectors';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { FORM_TYPES, FormTypes } from 'app/shared/utils/form-type.utils';
import { SidebarState, ReportSidebarSection } from '../../sidebar.component';

@Component({
  selector: 'app-f1m-menu',
  templateUrl: './f1m-menu.component.html',
  styleUrls: ['../menu-report.component.scss'],
})
export class F1MMenuComponent extends DestroyerComponent implements OnInit {
  subHeading: string = FORM_TYPES.get(FormTypes.F1M)?.description as string;
  activeReport$?: Observable<Report | undefined>;
  items$: Observable<MenuItem[]> = of([]);

  constructor(private store: Store, private reportService: ReportService) {
    super();
  }

  ngOnInit(): void {
    this.activeReport$ = this.store.select(selectActiveReport);

    this.items$ = combineLatest([this.store.select(selectSidebarState), this.activeReport$]).pipe(
      takeUntil(this.destroy$),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      switchMap(([sidebarState, activeReport]: [SidebarState, Report | undefined]) => {
        const isEditable = this.reportService.isEditable(activeReport);

        return of([
          {
            label: 'CREATE A REPORT',
            expanded: sidebarState?.section == ReportSidebarSection.CREATE,
            items: [
              {
                label: 'Edit your report',
                routerLink: [`/reports/f1m/edit/${activeReport?.id}`],
              },
            ],
          },
          {
            label: 'REVIEW A REPORT',
            expanded: sidebarState?.section == ReportSidebarSection.REVIEW,
            items: [
              // {
              //   label: 'View summary page',
              //   routerLink: [`/reports/f1m/summary/${activeReport?.id}`],
              // },
              // {
              //   label: 'View detailed summary page',
              //   routerLink: [`/reports/f1m/detailed-summary/${activeReport?.id}`],
              // },
              {
                label: 'View print preview',
                routerLink: [`/reports/f1m/web-print/${activeReport?.id}`],
              },
              {
                label: 'Add a report level memo',
                routerLink: [`/reports/f1m/memo/${activeReport?.id}`],
                visible: isEditable,
              },
            ],
          },
          {
            label: 'SIGN & SUBMIT',
            expanded: sidebarState?.section == ReportSidebarSection.SUBMISSION,
            items: [
              {
                label: 'Confirm information',
                routerLink: [`/reports/f1m/submit/step1/${activeReport?.id}`],
                visible: isEditable,
              },
              {
                label: 'Submit report',
                routerLink: [`/reports/f1m/submit/step2/${activeReport?.id}`],
                visible: isEditable,
              },
              {
                label: 'Report status',
                routerLink: [`/reports/f1m/submit/status/${activeReport?.id}`],
              },
            ],
          },
        ] as MenuItem[]);
      })
    );
  }
}
