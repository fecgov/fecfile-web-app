import { Component, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Form3, Form3X, ReportTypes } from 'app/shared/models';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { ReportService } from 'app/shared/services/report.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { collectRouteData } from 'app/shared/utils/route.utils';
import { injectNavigationEnd } from 'ngxtension/navigation-end';
import { ReportSidebarSection } from './menu-info';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { PanelMenu } from 'primeng/panelmenu';

@Component({
  selector: 'app-report-sidebar',
  standalone: true,
  imports: [FecDatePipe, PanelMenu],
  templateUrl: 'report-sidebar.component.html',
})
export class ReportSidebarComponent {
  private readonly navEnd = toSignal(injectNavigationEnd());
  private readonly store = inject(Store);
  private readonly reportService = inject(ReportService);
  private readonly route = inject(ActivatedRoute);
  private readonly report = this.store.selectSignal(selectActiveReport);

  readonly items = computed(() => {
    this.navEnd();
    const data = collectRouteData(this.route.snapshot);
    if (!data) return [];
    const sidebarState = data['sidebarSection'] as ReportSidebarSection;
    const isEditable = this.reportService.isEditable(this.report());
    return this.report().getMenuItems(sidebarState, isEditable);
  });

  readonly formLabel = computed(() => this.report().formLabel);
  readonly subHeading = computed(() => this.report().report_code_label);
  readonly hasCoverage = computed(() => [ReportTypes.F3, ReportTypes.F3X].includes(this.report().report_type));
  readonly isAmmendable = computed(() =>
    [ReportTypes.F3, ReportTypes.F3X, ReportTypes.F24].includes(this.report().report_type),
  );
  readonly coverageFrom = computed(() => (this.report() as Form3 | Form3X).coverage_from_date);
  readonly coverageThrough = computed(() => (this.report() as Form3 | Form3X).coverage_through_date);

  readonly version = computed(() => this.report().version_label ?? 'Original');
}
