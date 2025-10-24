import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';
import { ReportTypes } from 'app/shared/models/report.model';
import { ReportService } from 'app/shared/services/report.service';
import { Form3X } from 'app/shared/models/form-3x.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { derivedAsync } from 'ngxtension/derived-async';
import { buildCorrespondingForm3XValidator } from 'app/shared/utils/validators.utils';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { ReactiveFormsModule } from '@angular/forms';
import { Tooltip } from 'primeng/tooltip';
import { InputText } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';

export const LinkedReportTooltipText =
  'Transactions created in Form 24 must be linked to a Form 3X with corresponding coverage dates. ' +
  'To determine coverage dates, calculations rely on an IE’s date of disbursement. If date of disbursement is not ' +
  'available, date of dissemination will be used. Before saving this transaction, create a Form 3X with ' +
  'corresponding coverage dates.';

@Component({
  selector: 'app-linked-report-input',
  styleUrls: ['./linked-report-input.component.scss'],
  templateUrl: './linked-report-input.component.html',
  imports: [ReactiveFormsModule, Tooltip, InputText, ErrorMessagesComponent],
})
export class LinkedReportInputComponent extends BaseInputComponent implements OnInit {
  private readonly reportService = inject(ReportService);
  private readonly datePipe = inject(FecDatePipe);

  readonly disbursementDate = signal<Date | undefined>(undefined);
  readonly disseminationDate = signal<Date | undefined>(undefined);
  readonly userTouchedValues = signal(false);
  readonly tooltipText = LinkedReportTooltipText;

  readonly committeeF3xReports = derivedAsync(
    () =>
      this.reportService.getAllReports().then((reports) => {
        return reports.filter((report) => {
          return report.report_type === ReportTypes.F3X;
        }) as Form3X[];
      }),
    { initialValue: [] },
  );

  // the form3X that is associated with the transaction on load
  private readonly initialForm3X = derivedAsync(async () => {
    const reports = this.transaction()?.reports;
    if (!reports) return undefined;
    const report = reports.find((report) => report.report_type === ReportTypes.F3X);
    if (!report?.id) return undefined;
    return (await this.reportService.get(report.id)) as Form3X;
  });

  // the form3X that is associated with the transaction based on
  // the disbursement date or dissemination date ONLY if the date or memo
  // code has been touched by the user, otherwise it will return the initialForm3X
  readonly associatedF3X = derivedAsync(() => {
    const disbursementDate = this.disbursementDate();
    const disseminationDate = this.disseminationDate();

    const report = this.initialForm3X();
    if (report && !this.userTouchedValues()) {
      return report;
    }
    const date = disbursementDate ?? disseminationDate;
    if (date) {
      for (const report of this.committeeF3xReports()) {
        if (report.coverage_from_date && report.coverage_through_date) {
          if (date >= report.coverage_from_date && date <= report.coverage_through_date) {
            return report;
          }
        }
      }
    }

    return null;
  });

  readonly form3XLabel = computed(() => {
    const report = this.associatedF3X();
    if (!report) return '';

    let label = report.report_code_label ?? '';
    const stringsToRemove = [' MID-YEAR-REPORT', ' YEAR-END', ' QUARTERLY REPORT', ' MONTHLY REPORT'];
    for (const string of stringsToRemove) {
      label = label?.replaceAll(string, '');
    }

    return `${label}: ${this.datePipe.transform(report.coverage_from_date)} - ${this.datePipe.transform(
      report.coverage_through_date,
    )}`;
  });

  constructor() {
    super();
    effect(() => {
      this.form.get('linkedF3x')?.setValue(this.form3XLabel());
      this.form.get('linkedF3xId')?.setValue(this.associatedF3X()?.id);
      this.form.get('linkedF3x')?.markAsTouched();
    });
  }

  ngOnInit(): void {
    const linkedF3xControl = new SubscriptionFormControl();
    this.form.addControl('linkedF3x', linkedF3xControl);
    this.form.addControl('linkedF3xId', new SubscriptionFormControl());
    const memoControl = this.form.get(this.templateMap.memo_code) as SubscriptionFormControl<boolean>;
    const dateControl =
      (this.form.get(this.templateMap['date']) as SubscriptionFormControl) ?? new SubscriptionFormControl();
    const date2Control =
      (this.form.get(this.templateMap['date2']) as SubscriptionFormControl) ?? new SubscriptionFormControl();
    linkedF3xControl.addValidators(
      buildCorrespondingForm3XValidator(this.form, this.templateMap['date'], this.templateMap['date2']),
    );

    this.disbursementDate.set(dateControl.value);
    this.disseminationDate.set(date2Control.value);

    dateControl.valueChanges.subscribe((value) => {
      this.userTouchedValues.set(true);
      this.disbursementDate.set(value);
    });
    date2Control.valueChanges.subscribe((value) => {
      this.userTouchedValues.set(true);
      this.disseminationDate.set(value);
    });
    memoControl.valueChanges.subscribe(() => this.userTouchedValues.set(true));
  }
}
