import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Report } from '../../../../shared/models/report.model';
import { SidebarState } from '../../sidebar.component';
import { AbstractMenuComponent } from '../abstract-menu.component';
import { AsyncPipe } from '@angular/common';
import { PanelMenu } from 'primeng/panelmenu';

@Component({
  selector: 'app-f99-menu',
  templateUrl: './f99-menu.component.html',
  styleUrls: ['../menu-report.component.scss'],
  imports: [PanelMenu, AsyncPipe],
})
export class F99MenuComponent extends AbstractMenuComponent implements OnInit {
  override reportString = 'f99';

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
