import { Component, OnInit } from '@angular/core';
import { DestroyerComponent } from '../../../shared/components/app-destroyer.component';
import { selectActiveReport } from '../../../store/active-report.selectors';
import { combineLatest, Observable, of, switchMap, takeUntil } from 'rxjs';
import { selectSidebarState } from '../../../store/sidebar-state.selectors';
import { SidebarState } from '../sidebar.component';
import { Report } from '../../../shared/models/report.model';
import { MenuItem } from 'primeng/api';
import { Store } from '@ngrx/store';
import { ReportService } from '../../../shared/services/report.service';

@Component({})
export abstract class AbstractMenuComponent extends DestroyerComponent implements OnInit {
  activeReport$?: Observable<Report | undefined>;
  items$: Observable<MenuItem[]> = of([]);

  protected constructor(
    private store: Store,
    private reportService: ReportService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.activeReport$ = this.store.select(selectActiveReport);

    this.items$ = combineLatest([this.store.select(selectSidebarState), this.activeReport$]).pipe(
      takeUntil(this.destroy$),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      switchMap(([sidebarState, activeReport]: [SidebarState, Report | undefined]) => {
        const isEditable = this.reportService.isEditable(activeReport);

        return of(this.getMenuItems(sidebarState, activeReport, isEditable));
      }),
    );
  }

  abstract getMenuItems(sidebarState: SidebarState, activeReport: Report | undefined, isEditable: boolean): MenuItem[];
}
