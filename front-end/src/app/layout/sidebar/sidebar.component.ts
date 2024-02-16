import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Report, ReportTypes } from 'app/shared/models/report.model';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  activeReport$?: Observable<Report | undefined>;
  reportTypes = ReportTypes;

  constructor(private store: Store) {
    this.activeReport$ = this.store.select(selectActiveReport);
  }
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
