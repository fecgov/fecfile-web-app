import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Report } from 'app/shared/models/report.model';
import { ReportService } from 'app/shared/services/report.service';
import { WebPrintService } from 'app/shared/services/web-print.service';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { Card } from 'primeng/card';
import { NgOptimizedImage } from '@angular/common';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { SingleClickDirective } from '../../../shared/directives/single-click.directive';
import { toSignal } from '@angular/core/rxjs-interop';
import { Form3X, WebPrintSubmission } from 'app/shared/models';
import { plainToInstance } from 'class-transformer';

@Component({
  selector: 'app-print-preview',
  templateUrl: './print-preview.component.html',
  styleUrls: ['../../styles.scss', './print-preview.component.scss'],
  imports: [Card, NgOptimizedImage, ButtonDirective, Ripple, SingleClickDirective],
})
export class PrintPreviewComponent {
  private readonly store = inject(Store);
  public readonly router = inject(Router);
  public readonly route = inject(ActivatedRoute);
  private readonly webPrintService = inject(WebPrintService);
  private readonly reportService = inject(ReportService);
  private readonly activeReport = this.store.selectSignal(selectActiveReport);
  readonly report = signal<Report>(this.activeReport());
  readonly committeeAccount = this.store.selectSignal(selectCommitteeAccount);

  readonly downloadURL = computed(() => this.report().webprint_submission?.fec_image_url ?? '');
  readonly submitDate = computed(() => this.report().webprint_submission?.created);
  readonly printError = computed(
    () => this.report().webprint_submission?.fec_message ?? this.report().webprint_submission?.fecfile_error ?? '',
  );

  private readonly pollingTime = 2000;
  readonly webPrintStage = computed(() => {
    const r = this.report();
    if (!r.webprint_submission) return 'not-submitted';
    const { fec_status, fecfile_task_state } = r.webprint_submission;
    if (fec_status === 'FAILED' || fecfile_task_state === 'FAILED') return 'failure';
    if (fec_status === 'COMPLETED' && fecfile_task_state === 'SUCCEEDED') return 'success';
    return 'checking';
  });

  private readonly data = toSignal(this.route.data, { initialValue: {} as Data });
  readonly getBackUrl = computed(() => this.data()?.['getBackUrl'] ?? (() => '/'));
  readonly getContinueUrl = computed(() => this.data()['getContinueUrl'] ?? (() => '/'));

  constructor() {
    effect(() => {
      if (this.webPrintStage() === 'checking') {
        setTimeout(() => this.pollPrintStatus(), this.pollingTime);
      }
    });
  }

  public async pollPrintStatus(): Promise<void> {
    /** Request the status of the report
     * tap into observable to update ui with status
     * delay polling again
     * if the status is not completed, poll again
     */
    try {
      const report = await this.reportService.get(this.report().id!);
      this.report.set(report);
      await new Promise((resolve) => setTimeout(resolve, this.pollingTime)); // Replaces `concatMap(timer(...))`
      if (!report.webprint_submission?.fec_status || report.webprint_submission?.fec_status === 'PROCESSING') {
        this.pollPrintStatus();
      }
    } catch (error) {
      console.error('Error fetching report:', error);
    }
  }

  async submitPrintJob() {
    const report = this.report();
    if (!report.id) return;
    await this.reportService.fecUpdate(report, this.committeeAccount());
    try {
      await this.webPrintService.submitPrintJob(report.id);
      this.pollPrintStatus();
    } catch {
      const current: Report = this.report();

      const updatedSubmission = plainToInstance(WebPrintSubmission, {
        ...current.webprint_submission,
        fecfile_task_state: 'FAILED',
        fec_message: 'Failed to compile PDF',
      });

      const updated = new Form3X();
      Object.assign(updated, current, {
        webprint_submission: updatedSubmission,
      });
      this.report.set(updated);
    }
  }

  public downloadPDF() {
    if (this.downloadURL().length > 0) {
      window.open(this.downloadURL(), '_blank');
    }
  }
}
