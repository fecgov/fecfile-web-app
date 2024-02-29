import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { firstValueFrom, takeUntil } from 'rxjs';
import { BaseInputComponent } from '../base-input.component';
import { Report, ReportTypes } from 'app/shared/models/report.model';
import { ReportService, getReportFromJSON } from 'app/shared/services/report.service';
import { Form3X } from 'app/shared/models/form-3x.model';
import { ListRestResponse } from 'app/shared/models/rest-api.model';
import { getReportCodeLabel } from 'app/shared/utils/report-code.utils';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';

@Component({
  selector: 'app-linked-report-input',
  templateUrl: './linked-report-input.component.html',
})
export class LinkedReportInputComponent extends BaseInputComponent implements OnInit {
  activeReport?: Report;
  committeeF3xReports: Promise<ListRestResponse>;
  form24ReportType = ReportTypes.F24;
  linkedReport?: Report;

  constructor(
    private store: Store,
    private reportService: ReportService,
  ) {
    super();
    this.committeeF3xReports = firstValueFrom(this.reportService.getAllReports());
  }

  ngOnInit(): void {
    firstValueFrom(this.store.select(selectActiveReport)).then((report) => {
      this.activeReport = report;
    });

    this.committeeF3xReports.then(() => {
      this.setLinkedReport();
    });

    this.form
      .get(this.templateMap['date'])
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.setLinkedReport();
      });
    this.form
      .get(this.templateMap['date2'])
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.setLinkedReport();
      });
  }

  setLinkedReport(): void {
    this.getLinkedReport().then((report) => {
      this.linkedReport = report;
      if (this.linkedReport) {
        this.linkedReport.toString = this.getForm3XLabel;
      }
    });
  }

  async getLinkedReport(): Promise<Form3X | undefined> {
    const disseminationDate = this.form.get(this.templateMap['date2'])?.value as Date | undefined;
    const disbursementDate = this.form.get(this.templateMap['date'])?.value as Date | undefined;

    const date = disbursementDate ?? disseminationDate;
    if (date) {
      const reports = await this.committeeF3xReports.then((response) => {
        return response.results
          .map((item) => {
            return getReportFromJSON(item);
          })
          .filter((report) => {
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

  getForm3XLabel(): string {
    const report = this as unknown as Form3X;
    const datePipe = new FecDatePipe();

    let label = getReportCodeLabel(report.report_code);
    const stringsToRemove = [' MID-YEAR-REPORT', ' YEAR-END', ' QUARTERLY REPORT', ' MONTHLY REPORT'];
    for (const string of stringsToRemove) {
      label = label?.replaceAll(string, '');
    }

    return `${label}: ${datePipe.transform(report.coverage_from_date)} - ${datePipe.transform(report.coverage_through_date)}`;
  }
}
