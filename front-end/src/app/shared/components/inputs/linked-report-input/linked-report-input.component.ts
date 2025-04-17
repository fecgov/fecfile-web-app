import { Component, effect, inject } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';
import { Report, ReportTypes } from 'app/shared/models/report.model';
import { ReportService } from 'app/shared/services/report.service';
import { Form3X } from 'app/shared/models/form-3x.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';

import { buildCorrespondingForm3XValidator } from 'app/shared/utils/validators.utils';
import { SignalFormControl } from 'app/shared/utils/signal-form-control';
import { ReactiveFormsModule } from '@angular/forms';
import { Tooltip } from 'primeng/tooltip';
import { InputText } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';

@Component({
  selector: 'app-linked-report-input',
  styleUrls: ['./linked-report-input.component.scss'],
  templateUrl: './linked-report-input.component.html',
  imports: [ReactiveFormsModule, Tooltip, InputText, ErrorMessagesComponent],
})
export class LinkedReportInputComponent extends BaseInputComponent {
  private readonly reportService = inject(ReportService);
  private readonly datePipe = inject(FecDatePipe);
  committeeF3xReports: Promise<Report[]> = this.reportService.getAllReports();
  linkedF3xControl = new SignalFormControl(this.injector);

  readonly tooltipText =
    'Transactions created in Form 24 must be linked to a Form 3X with corresponding coverage dates. ' +
    'To determine coverage dates, calculations rely on an IE’s date of disbursement. If date of disbursement is not ' +
    'available, date of dissemination will be used. Before saving this transaction, create a Form 3X with ' +
    'corresponding coverage dates.';

  constructor() {
    super();
    this.form().addControl('linkedF3x', this.linkedF3xControl);
    this.form().addControl('linkedF3xId', new SignalFormControl(this.injector));
    const dateControl =
      (this.form().get(this.templateMap()['date']) as SignalFormControl<Date>) ??
      new SignalFormControl<Date>(this.injector);
    const date2Control =
      (this.form().get(this.templateMap()['date2']) as SignalFormControl<Date>) ??
      new SignalFormControl<Date>(this.injector);
    this.linkedF3xControl.addValidators(
      buildCorrespondingForm3XValidator(this.form(), this.templateMap()['date'], this.templateMap()['date2']),
    );

    effect(() => {
      const date = dateControl.valueChangeSignal();
      const date2 = date2Control.valueChangeSignal();
      this.setLinkedForm3X(date, date2);
    });
  }

  setLinkedForm3X(disbursementDate: Date, disseminationDate: Date): void {
    this.getLinkedForm3X(disbursementDate, disseminationDate).then((report) => {
      this.form().get('linkedF3x')?.setValue(this.getForm3XLabel(report));
      this.form().get('linkedF3xId')?.setValue(report?.id);
      this.form().get('linkedF3x')?.markAsTouched();
    });
  }

  async getLinkedForm3X(disbursementDate?: Date, disseminationDate?: Date): Promise<Form3X | undefined> {
    const date = disbursementDate ?? disseminationDate;
    if (date) {
      const reports = await this.committeeF3xReports.then((reports) => {
        return reports.filter((report) => {
          return report.report_type === ReportTypes.F3X;
        }) as Form3X[];
      });

      for (const report of reports) {
        if (report.coverage_from_date && report.coverage_through_date) {
          if (date >= report.coverage_from_date && date <= report.coverage_through_date) {
            return report;
          }
        }
      }
    }

    return undefined;
  }

  getForm3XLabel(report: Form3X | undefined): string {
    if (!report) return '';

    let label = report.report_code_label ?? '';
    const stringsToRemove = [' MID-YEAR-REPORT', ' YEAR-END', ' QUARTERLY REPORT', ' MONTHLY REPORT'];
    for (const string of stringsToRemove) {
      label = label?.replaceAll(string, '');
    }

    return `${label}: ${this.datePipe.transform(report.coverage_from_date)} - ${this.datePipe.transform(
      report.coverage_through_date,
    )}`;
  }
}
