import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { Report } from '../../../../shared/models/report.model';
import { ReportService } from '../../../../shared/services/report.service';
import { FORM_TYPES, FormTypes } from 'app/shared/utils/form-type.utils';
import { SidebarState } from '../../sidebar.component';
import { AbstractMenuComponent } from '../abstract-menu.component';

@Component({
  selector: 'app-f1m-menu',
  templateUrl: './f1m-menu.component.html',
  styleUrls: ['../menu-report.component.scss'],
})
export class F1MMenuComponent extends AbstractMenuComponent implements OnInit {
  subHeading: string = FORM_TYPES.get(FormTypes.F1M)?.description as string;

  constructor(store: Store, reportService: ReportService) {
    super(store, reportService);
    this.reportString = 'f1m';
  }

  getMenuItems(sidebarState: SidebarState, activeReport: Report | undefined, isEditable: boolean): MenuItem[] {
    const reviewReport = this.reviewReport(sidebarState);
    reviewReport.items = [this.printPreview(activeReport), this.addReportLevelMenu(activeReport, isEditable)];

    return [
      this.createReport(sidebarState, activeReport),
      reviewReport,
      this.signAndSubmit(sidebarState, activeReport, isEditable),
    ];
  }
}
