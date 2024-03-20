import { Component, OnInit } from '@angular/core';
import { combineLatestWith, startWith, takeUntil } from 'rxjs';
import { BaseInputComponent } from '../base-input.component';
import { Report, ReportTypes } from 'app/shared/models/report.model';
import { ReportService } from 'app/shared/services/report.service';
import { Form3X } from 'app/shared/models/form-3x.model';
import { getReportCodeLabel } from 'app/shared/utils/report-code.utils';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { FormControl } from '@angular/forms';
import { buildCorrespondingForm3XValidator } from 'app/shared/utils/validators.utils';

@Component({
  selector: 'app-linked-report-input',
  templateUrl: './linked-report-input.component.html',
})
export class LinkedReportInputComponent extends BaseInputComponent implements OnInit {
  committeeF3xReports: Promise<Report[]>;
  linkedF3xControl = new FormControl();

  tooltipText =
    'Transactions created in Form 24 must be linked to a Form 3X with corresponding coverage dates. ' +
    'To determine coverage dates, calculations rely on an IE’s date of disbursement. If date of disbursement is not ' +
    'available, date of dissemination will be used. Before saving this transaction, create a Form 3X with ' +
    'corresponding coverage dates.';

  constructor(
    private reportService: ReportService,
    private datePipe: FecDatePipe,
  ) {
    super();
    this.committeeF3xReports = this.reportService.getAllReports();
  }

  ngOnInit(): void {
    this.form.addControl('linkedF3x', this.linkedF3xControl);
    this.form.addControl('linkedF3xId', new FormControl());
    const dateControl = this.form.get(this.templateMap['date']) ?? new FormControl();
    const date2Control = this.form.get(this.templateMap['date2']) ?? new FormControl();
    this.linkedF3xControl.addValidators(buildCorrespondingForm3XValidator(dateControl, date2Control));

    dateControl.valueChanges
      .pipe(
        startWith(dateControl.value),
        combineLatestWith(date2Control.valueChanges.pipe(startWith(date2Control.value))),
        takeUntil(this.destroy$),
      )
      .subscribe(this.setLinkedForm3X.bind(this));
  }

  setLinkedForm3X([disbursementDate, disseminationDate]: (Date | undefined)[]): void {
    this.getLinkedForm3X(disbursementDate, disseminationDate).then((report) => {
      this.form.get('linkedF3x')?.setValue(this.getForm3XLabel(report));
      this.form.get('linkedF3xId')?.setValue(report?.id);
      this.form.get('linkedF3x')?.markAsTouched();
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

    let label = getReportCodeLabel(report.report_code);
    const stringsToRemove = [' MID-YEAR-REPORT', ' YEAR-END', ' QUARTERLY REPORT', ' MONTHLY REPORT'];
    for (const string of stringsToRemove) {
      label = label?.replaceAll(string, '');
    }

    return `${label}: ${this.datePipe.transform(report.coverage_from_date)} - ${this.datePipe.transform(
      report.coverage_through_date,
    )}`;
  }
}
