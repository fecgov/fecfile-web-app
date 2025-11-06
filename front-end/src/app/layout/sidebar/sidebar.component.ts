import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Form3, Form3X } from 'app/shared/models';
import { ReportTypes } from 'app/shared/models/report.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { ReportService } from 'app/shared/services/report.service';
import { FORM_TYPES } from 'app/shared/utils/form-type.utils';
import { collectRouteData } from 'app/shared/utils/route.utils';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { injectNavigationEnd } from 'ngxtension/navigation-end';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ReportSidebarSection } from './menu-info';

@Component({
  selector: 'app-drawer',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [PanelMenuModule, FecDatePipe],
})
export class SidebarComponent {
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
  readonly subHeading = computed(() => {
    if (this.report().report_type === ReportTypes.F99) return FORM_TYPES.get(ReportTypes.F99)!.description!;
    return this.report().formSubLabel;
  });
  readonly hasCoverage = computed(() => [ReportTypes.F3, ReportTypes.F3X].includes(this.report().report_type));
  readonly coverageFrom = computed(() => (this.report() as Form3 | Form3X).coverage_from_date);
  readonly coverageThrough = computed(() => (this.report() as Form3 | Form3X).coverage_through_date);
}
