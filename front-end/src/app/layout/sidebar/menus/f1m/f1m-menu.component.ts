import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { FORM_TYPES, FormTypes } from 'app/shared/utils/form-type.utils';
import { SidebarState } from '../../sidebar.component';
import { AbstractMenuComponent } from '../abstract-menu.component';
import { PanelMenu } from 'primeng/panelmenu';

@Component({
  selector: 'app-f1m-menu',
  templateUrl: './f1m-menu.component.html',
  styleUrls: ['../menu-report.component.scss'],
  imports: [PanelMenu],
})
export class F1MMenuComponent extends AbstractMenuComponent {
  readonly subHeading: string = FORM_TYPES.get(FormTypes.F1M)?.description as string;
  protected readonly reportString = 'f1m';

  getMenuItems(sidebarState: SidebarState, isEditable: boolean): MenuItem[] {
    const reviewReport = this.reviewReport(sidebarState);
    reviewReport.items = [this.printPreview(), this.addReportLevelMenu(isEditable)];

    return [this.editReport(sidebarState), reviewReport, this.signAndSubmit(sidebarState, isEditable)];
  }
}
