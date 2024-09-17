import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Report } from '../../../../shared/models/report.model';
import { ReattRedesTypes, ReattRedesUtils } from '../../../../shared/utils/reatt-redes/reatt-redes.utils';
import { Router } from '@angular/router';
import { Transaction } from '../../../../shared/models/transaction.model';
import { Form3XService } from '../../../../shared/services/form-3x.service';

@Component({
  selector: 'app-select-report-dialog',
  templateUrl: './select-report-dialog.component.html',
  styleUrls: ['./select-report-dialog.component.scss'],
})
export class SelectReportDialogComponent implements OnInit {
  availableReports: Report[] = [];
  selectedReport?: Report;

  transaction?: Transaction;
  type?: ReattRedesTypes;
  @ViewChild('selectReportDialog') selectReportDialog?: ElementRef<HTMLDialogElement>;

  constructor(
    public router: Router,
    private service: Form3XService,
  ) {}

  get reattRedes(): string {
    return ReattRedesUtils.isReattribute(this.type) ? 'reattribute' : 'redesignate';
  }

  get reattRedesignation(): string {
    return ReattRedesUtils.isReattribute(this.type) ? 'reattribution' : 'redesignation';
  }

  ngOnInit() {
    ReattRedesUtils.selectReportDialogSubject.subscribe((data) => {
      this.transaction = data[0];
      this.type = data[1];
      this.selectReportDialog?.nativeElement.show();

      const coverage_through_date = this.transaction?.getForm3X()?.coverage_through_date;
      if (!coverage_through_date) return;
      this.service
        .getFutureReports(coverage_through_date.toString())
        .subscribe((reports) => (this.availableReports = reports));
    });
  }

  async createReattribution() {
    if (!this.transaction) throw new Error('No base transaction');
    await this.router.navigateByUrl(
      `/reports/transactions/report/${this.selectedReport?.id}/create/${this.transaction.transaction_type_identifier}?${this.reattRedesignation}=${this.transaction.id}`,
    );
  }

  cancel() {
    this.transaction = undefined;
    this.selectReportDialog?.nativeElement.close();
  }

  get electContrib(): string {
    return ReattRedesUtils.isReattribute(this.type) ? 'contributor' : 'election';
  }
}
