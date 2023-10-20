import { Component, OnInit } from '@angular/core';
import { ReportDetailedSummaryComponent } from '../report-detailed-summary/report-detailed-summary.component';

@Component({
  selector: 'app-report-summary',
  templateUrl: './report-summary.component.html',
  styleUrls: ['../../styles.scss'],
})
export class ReportSummaryComponent extends ReportDetailedSummaryComponent implements OnInit {}
