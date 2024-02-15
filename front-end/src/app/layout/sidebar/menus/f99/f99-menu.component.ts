import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { Report } from '../../../../shared/models/report.model';
import { ReportService } from '../../../../shared/services/report.service';
import { SidebarState } from '../../sidebar.component';
import { AbstractMenuComponent } from '../abstract-menu.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-f99-menu',
  templateUrl: './f99-menu.component.html',
  styleUrls: ['../menu-report.component.scss'],
})
export class F99MenuComponent extends AbstractMenuComponent implements OnInit {
  constructor(store: Store, reportService: ReportService, router: Router) {
    super(store, reportService, router);
    this.reportString = 'f99';
  }

  getMenuItems(sidebarState: SidebarState, activeReport: Report | undefined, isEditable: boolean): MenuItem[] {
    const reviewReport = this.reviewReport(sidebarState);
    reviewReport.items = [this.printPreview(activeReport)];

    return [
      this.editReport(sidebarState, activeReport),
      reviewReport,
      this.signAndSubmit(sidebarState, activeReport, isEditable),
    ];
  }
}
