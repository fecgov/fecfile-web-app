import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { firstValueFrom, takeUntil } from 'rxjs';
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
  activeReport?: Report;
  committeeF3xReports: Promise<Report[]>;
  form24ReportType = ReportTypes.F24;
  linkedF3x?: Form3X;
  linkedF3xLabel?: string;

  tooltipText =
    'Transactions created in Form 24 must be linked to a Form 3X with corresponding coverage dates. ' +
    'To determine coverage dates, calculations rely on an IE’s date of disbursement. If date of disbursement is not ' +
    'available, date of dissemination will be used. Before saving this transaction, create a Form 3X with ' +
    'corresponding coverage dates.';

  constructor(
    private store: Store,
    private reportService: ReportService,
    private datePipe: FecDatePipe,
  ) {
    super();
    this.committeeF3xReports = this.reportService.getAllReports();
  }

  ngOnInit(): void {
    this.form.addControl('linkedF3x', new FormControl());
    const dateControl = this.form.get(this.templateMap['date']);
    const date2Control = this.form.get(this.templateMap['date2']);
    if (dateControl && date2Control) {
      this.form.get('linkedF3x')?.addValidators(buildCorrespondingForm3XValidator(dateControl, date2Control));
    }

    firstValueFrom(this.store.select(selectActiveReport)).then((report) => {
      this.activeReport = report;
    });

    this.committeeF3xReports.then(() => {
      this.setLinkedForm3X();
    });

    this.form
      .get(this.templateMap['date'])
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.setLinkedForm3X();
      });
    this.form
      .get(this.templateMap['date2'])
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.setLinkedForm3X();
      });
  }

  setLinkedForm3X(): void {
    this.getLinkedForm3X().then((report) => {
      this.linkedF3x = report;
      this.form.get('linkedF3x')?.setValue(this.getForm3XLabel(this.linkedF3x));
      this.form.get('linkedF3x')?.markAsTouched();
    });
  }

  async getLinkedForm3X(): Promise<Form3X | undefined> {
    const disseminationDate = this.form.get(this.templateMap['date2'])?.value as Date | undefined;
    const disbursementDate = this.form.get(this.templateMap['date'])?.value as Date | undefined;

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
