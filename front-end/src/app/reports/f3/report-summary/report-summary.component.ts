import { Component } from '@angular/core';
import { ReportDetailedSummaryComponent } from '../report-detailed-summary/report-detailed-summary.component';
import { Card } from 'primeng/card';
import { CurrencyPipe } from '@angular/common';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { DefaultZeroPipe } from '../../../shared/pipes/default-zero.pipe';
import { CalculationOverlayComponent } from '../../../shared/components/calculation-overlay/calculation-overlay.component';

@Component({
  selector: 'app-report-summary',
  templateUrl: './report-summary.component.html',
  styleUrls: ['../../styles.scss', './report-summary.component.scss'],
  imports: [Card, ButtonDirective, Ripple, CalculationOverlayComponent, CurrencyPipe, DefaultZeroPipe],
})
export class ReportSummaryComponent extends ReportDetailedSummaryComponent {}
