import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {}

export enum ReportSidebarState {
  'TRANSACTIONS',
  'REVIEW',
  'SUBMISSION',
}

export class SidebarState {
  section: ReportSidebarState;
  url: string;
  constructor(section: ReportSidebarState, url: string) {
    this.section = section;
    this.url = url;
  }
}
