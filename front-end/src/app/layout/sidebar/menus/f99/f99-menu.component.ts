import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { SidebarState } from '../../sidebar.component';
import { AbstractMenuComponent } from '../abstract-menu.component';
import { PanelMenu } from 'primeng/panelmenu';

@Component({
  selector: 'app-f99-menu',
  templateUrl: './f99-menu.component.html',
  styleUrls: ['../menu-report.component.scss'],
  imports: [PanelMenu],
})
export class F99MenuComponent extends AbstractMenuComponent {
  override reportString = 'f99';

  getMenuItems(sidebarState: SidebarState, isEditable: boolean): MenuItem[] {
    const reviewReport = this.reviewReport(sidebarState);
    reviewReport.items = [this.printPreview()];

    return [this.editReport(sidebarState), reviewReport, this.signAndSubmit(sidebarState, isEditable)];
  }
}
