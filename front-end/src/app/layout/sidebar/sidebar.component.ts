import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {}

export enum Sidebars {
  'REPORT',
}

export enum ReportSidebarState {
  'TRANSACTIONS',
  'REVIEW',
  'SUBMISSION',
}

export class SidebarState {
  section: ReportSidebarState;
  constructor(section: ReportSidebarState) {
    this.section = section;
  }
}
