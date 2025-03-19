import { Component, computed, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { F3xReportCodes } from 'app/shared/utils/report-code.utils';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { Card } from 'primeng/card';
import { NgOptimizedImage } from '@angular/common';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { LongDatePipe } from '../../shared/pipes/long-date.pipe';

@Component({
  selector: 'app-report-summary',
  templateUrl: './submit-report-status.component.html',
  styleUrls: ['./submit-report-status.component.scss'],
  imports: [Card, NgOptimizedImage, ButtonDirective, Ripple, LongDatePipe],
})
export class SubmitReportStatusComponent extends DestroyerComponent implements OnInit {
  private readonly store = inject(Store);
  public readonly router = inject(Router);
  private readonly form3XService = inject(Form3XService);
  readonly activeReportSignal = this.store.selectSignal(selectActiveReport);
  readonly reportCodeSignal = computed(() => this.activeReportSignal().report_code as F3xReportCodes);
  readonly coverageDatesSignal = computed(() => this.activeReportSignal().coverageDates);
  readonly fecStatusSignal = computed(() => this.activeReportSignal().upload_submission?.fec_status);
  readonly taskStateSignal = computed(() => this.activeReportSignal().upload_submission?.fecfile_task_state);
  readonly fecMessageSignal = computed(() => this.activeReportSignal().upload_submission?.fec_message);

  reportCodeLabelMap?: { [key in F3xReportCodes]: string };

  ngOnInit(): void {
    this.form3XService.getReportCodeLabelMap().then((map) => (this.reportCodeLabelMap = map));
  }

  public backToReports() {
    this.router.navigateByUrl('/reports');
  }
}
