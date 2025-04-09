import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ReportTypes } from 'app/shared/models/report.model';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { F3MenuComponent } from './menus/f3/f3-menu.component';
import { F3XMenuComponent } from './menus/f3x/f3x-menu.component';
import { F99MenuComponent } from './menus/f99/f99-menu.component';
import { F1MMenuComponent } from './menus/f1m/f1m-menu.component';
import { F24MenuComponent } from './menus/f24/f24-menu.component';

@Component({
  selector: 'app-drawer',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [F3MenuComponent, F3XMenuComponent, F99MenuComponent, F1MMenuComponent, F24MenuComponent],
})
export class SidebarComponent {
  private readonly store = inject(Store);
  readonly activeReport = this.store.selectSignal(selectActiveReport);
  readonly reportTypes = ReportTypes;
}

export enum ReportSidebarSection {
  'TRANSACTIONS',
  'REVIEW',
  'SUBMISSION',
  'CREATE',
}

export class SidebarState {
  section: ReportSidebarSection;
  constructor(section: ReportSidebarSection) {
    this.section = section;
  }
}
