import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { Report } from '../../../../shared/models/report.model';
import { ReattRedesTypes, ReattRedesUtils } from '../../../../shared/utils/reatt-redes/reatt-redes.utils';
import { Router } from '@angular/router';
import { Transaction } from '../../../../shared/models/transaction.model';
import { Form3XService } from '../../../../shared/services/form-3x.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';

@Component({
  selector: 'app-select-report-dialog',
  templateUrl: './select-report-dialog.component.html',
  styleUrls: ['./select-report-dialog.component.scss'],
  imports: [ReactiveFormsModule, FormsModule, ButtonDirective, Ripple],
})
export class SelectReportDialogComponent implements OnInit {
  public readonly router = inject(Router);
  private readonly service = inject(Form3XService);
  availableReports: Report[] = [];
  selectedReport?: Report;

  transaction?: Transaction;
  type?: ReattRedesTypes;
  @ViewChild('selectReportDialog') selectReportDialog?: ElementRef<HTMLDialogElement>;

  ngOnInit() {
    ReattRedesUtils.selectReportDialogSubject.subscribe((data) => {
      this.transaction = data[0];
      this.type = data[1];
      this.selectReportDialog?.nativeElement.show();

      const coverage_through_date = this.transaction?.getForm3X()?.coverage_through_date;
      if (!coverage_through_date) return;
      this.service
        .getFutureReports(coverage_through_date.toString())
        .then((reports) => (this.availableReports = reports));
    });
  }

  async createReattribution() {
    if (!this.transaction) throw new Error('No base transaction');
    await this.router.navigateByUrl(
      `/reports/transactions/report/${this.selectedReport?.id}/create/${this.transaction.transaction_type_identifier}?${this.urlParameter}=${this.transaction.id}`,
    );
  }

  cancel() {
    this.transaction = undefined;
    this.selectReportDialog?.nativeElement.close();
  }

  // Label for action the user is trying to perform
  get actionLabel(): string {
    return ReattRedesUtils.isReattribute(this.type) ? 'reattribute' : 'redesignate';
  }

  // URL parameter to set the action type
  get urlParameter(): string {
    return ReattRedesUtils.isReattribute(this.type) ? 'reattribution' : 'redesignation';
  }

  // Label for the target of the action
  get actionTargetLabel(): string {
    return ReattRedesUtils.isReattribute(this.type) ? 'contributor' : 'election';
  }
}
