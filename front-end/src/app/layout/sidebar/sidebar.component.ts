import { Component, computed, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Form3, Form3X } from 'app/shared/models';
import { ReportStatus, ReportTypes } from 'app/shared/models/report.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { ReportService } from 'app/shared/services/report.service';
import { FORM_TYPES } from 'app/shared/utils/form-type.utils';
import { collectRouteData } from 'app/shared/utils/route.utils';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { injectNavigationEnd } from 'ngxtension/navigation-end';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
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
  private readonly sidebarState = computed(() => {
    this.navEnd();
    const data = collectRouteData(this.route.snapshot);
    if (!data) return undefined;
    return data['sidebarSection'] as ReportSidebarSection;
  });
  private readonly isEditable = computed(() => this.reportService.isEditable(this.report()));
  private readonly reportType = computed(() => this.report().report_type);
  private readonly isF3X = computed(() => this.reportType() === ReportTypes.F3X);
  private readonly isF1F99 = computed(() => [ReportTypes.F99, ReportTypes.F1M].includes(this.reportType()));
  private readonly baseUrl = computed(() => `/reports/${this.reportType().toLowerCase()}`);
  private readonly transBaseUrl = computed(() => `/reports/transactions/report/${this.reportId()}`);
  private readonly reportId = computed(() => this.report().id);
  private readonly reportStatus = computed(() => this.report().report_status);

  readonly formLabel = computed(() => this.report().formLabel);
  readonly subHeading = computed(() => {
    if (this.isF1F99()) return FORM_TYPES.get(this.report().report_type)?.description as string;
    return this.report().formSubLabel;
  });
  readonly hasCoverage = computed(() => [ReportTypes.F3, ReportTypes.F3X].includes(this.reportType()));
  readonly coverageFrom = computed(() => (this.report() as Form3 | Form3X).coverage_from_date);
  readonly coverageThrough = computed(() => (this.report() as Form3 | Form3X).coverage_through_date);

  readonly items: Signal<MenuItem[]> = computed(() => {
    let items: MenuItem[] = [];
    switch (this.reportType()) {
      case ReportTypes.F1M:
      case ReportTypes.F99:
        return [this.editReport(), this.reviewReport(), this.submitReport()];
      case ReportTypes.F24:
      case ReportTypes.F3:
        return [this.enterTransaction(), this.reviewTransactions(), this.reviewReport(), this.submitReport()];
      case ReportTypes.F3X:
        // Add edit report item to menu if the report is in progress or submission failure
        if (this.reportStatus() === ReportStatus.IN_PROGRESS || this.reportStatus() === ReportStatus.SUBMIT_FAILURE) {
          items = [this.editReport()];
        }
        items = [
          ...items,
          this.enterTransaction(),
          this.reviewTransactions(),
          this.reviewReport(),
          this.submitReport(),
        ];
        return items;
    }
  });

  private readonly editReport: Signal<MenuItem> = computed(() => {
    return {
      label: this.isF3X() ? 'EDIT REPORT DETAILS' : 'EDIT A REPORT',
      styleClass: this.isF3X() ? '' : 'edit-report-menu-item',
      routerLink: [`${this.baseUrl()}/edit/${this.reportId()}`],
      expanded: this.sidebarState() === ReportSidebarSection.CREATE,
    };
  });

  private reportItems = computed(() => {
    switch (this.reportType()) {
      case ReportTypes.F1M:
      case ReportTypes.F24:
        return [this.printPreview(), this.addReportLevelMenu()];
      case ReportTypes.F3:
      case ReportTypes.F3X:
        return [
          {
            label: 'View summary page',
            routerLink: `${this.baseUrl()}/summary/${this.reportId()}`,
          },
          {
            label: 'View detailed summary page',
            routerLink: `${this.baseUrl()}/detailed-summary/${this.reportId()}`,
          },
          this.printPreview(),
          this.addReportLevelMenu(),
        ];
      case ReportTypes.F99:
        return [this.printPreview()];
    }
  });
  private readonly reviewReport: Signal<MenuItem> = computed(() => {
    return {
      label: 'REVIEW A REPORT',
      expanded: this.sidebarState() == ReportSidebarSection.REVIEW,
      items: this.reportItems(),
    };
  });

  private readonly printPreview: Signal<MenuItem> = computed(() => {
    return {
      label: 'View print preview',
      routerLink: [`${this.baseUrl()}/web-print/${this.reportId()}`],
    };
  });

  private readonly addReportLevelMenu: Signal<MenuItem> = computed(() => {
    return {
      label: 'Add a report level memo',
      routerLink: `${this.baseUrl()}/memo/${this.reportId()}`,
      visible: this.isEditable(),
    };
  });

  private readonly enterTransaction: Signal<MenuItem> = computed(() => {
    let transactionItems: MenuItem[] = [
      {
        label: 'Manage your transactions',
        routerLink: `${this.transBaseUrl()}/list`,
      },
    ];
    if (this.reportType() === ReportTypes.F24) {
      transactionItems.push({
        label: 'Add an independent expenditure',
        routerLink: `${this.baseUrl()}/report/${this.reportId()}/transactions/select/independent-expenditures`,
      });
    } else {
      transactionItems = [
        ...transactionItems,
        {
          label: 'Add a receipt',
          routerLink: `${this.transBaseUrl()}/select/receipt`,
        },
        {
          label: 'Add a disbursement',
          routerLink: `${this.transBaseUrl()}/select/disbursement`,
        },
        {
          label: 'Add loans and debts',
          routerLink: `${this.transBaseUrl()}/select/loans-and-debts`,
        },
        { label: 'Add other transactions', styleClass: 'menu-item-disabled' },
      ];
    }

    return {
      label: 'ENTER A TRANSACTION',
      expanded: this.sidebarState() == ReportSidebarSection.TRANSACTIONS,
      visible: this.isEditable(),
      items: transactionItems,
    };
  });

  private readonly reviewTransactions: Signal<MenuItem> = computed(() => {
    return {
      label: 'REVIEW TRANSACTIONS',
      expanded: this.sidebarState() == ReportSidebarSection.TRANSACTIONS,
      visible: !this.isEditable(),
      routerLink: `${this.transBaseUrl()}/list`,
    };
  });

  readonly submitLabel = computed(() => (this.isF1F99() ? 'SIGN & SUBMIT' : 'SUBMIT YOUR REPORT'));
  private readonly submitReport: Signal<MenuItem> = computed(() => {
    return {
      label: this.submitLabel(),
      expanded: this.sidebarState() == ReportSidebarSection.SUBMISSION,
      items: this.submitReportArray(),
    };
  });

  private readonly submitReportArray: Signal<MenuItem[]> = computed(() => {
    return [
      {
        label: 'Submit report',
        routerLink: `${this.baseUrl()}/submit/${this.reportId()}`,
        visible: this.isEditable(),
      },
      {
        label: 'Report Status',
        routerLink: `${this.baseUrl()}/submit/status/${this.reportId()}`,
        visible: this.reportStatus() !== ReportStatus.IN_PROGRESS,
      },
    ];
  });
}

export enum ReportSidebarSection {
  'TRANSACTIONS',
  'REVIEW',
  'SUBMISSION',
  'CREATE',
}
