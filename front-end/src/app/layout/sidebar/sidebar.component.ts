import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Form24, Form3, Form3X } from 'app/shared/models';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { ReportService } from 'app/shared/services/report.service';
import { collectRouteData } from 'app/shared/utils/route.utils';
import { ReportTypes } from 'app/shared/models/reports/report.model';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { injectNavigationEnd } from 'ngxtension/navigation-end';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ReportSidebarSection } from './menu-info';
import { RenameF24DialogComponent } from 'app/reports/f24/rename-f24-dialog/rename-f24-dialog.component';
import { getFormTypes } from 'app/shared/utils/form-type.utils';

@Component({
  selector: 'app-drawer',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [PanelMenuModule, FecDatePipe, RenameF24DialogComponent],
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
    if (this.report().report_type === ReportTypes.F99) return getFormTypes(false).get(ReportTypes.F99)!.description!;
    return this.report().report_code_label;
  });
  readonly hasCoverage = computed(() => [ReportTypes.F3, ReportTypes.F3X].includes(this.report().report_type));
  readonly coverageFrom = computed(() => (this.report() as Form3 | Form3X).coverage_from_date);
  readonly coverageThrough = computed(() => (this.report() as Form3 | Form3X).coverage_through_date);

  readonly renameF24DialogVisible = signal(false);
  readonly isF24 = computed(() => this.report().report_type === ReportTypes.F24);
  form24ToUpdate?: Form24;

  constructor() {
    effect(() => {
      if (!this.renameF24DialogVisible() && this.form24ToUpdate) {
        this.form24ToUpdate = undefined;
        this.reportService.setActiveReportById(this.report().id);
      }
    });
  }

  public renameForm24(): void {
    this.form24ToUpdate = this.report() as Form24;
    this.renameF24DialogVisible.set(true);
  }
}
