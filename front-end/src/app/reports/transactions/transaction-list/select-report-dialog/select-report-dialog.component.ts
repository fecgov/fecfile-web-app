import { Component, computed, effect, inject } from '@angular/core';
import { Report } from '../../../../shared/models/reports/report.model';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DialogComponent } from 'app/shared/components/dialog/dialog.component';
import { ReattRedesStore } from 'app/shared/utils/reatt-redes/reatt-redes.store';

@Component({
  selector: 'app-select-report-dialog',
  templateUrl: './select-report-dialog.component.html',
  styleUrls: ['./select-report-dialog.component.scss'],
  imports: [ReactiveFormsModule, FormsModule, DialogComponent],
})
export class SelectReportDialogComponent {
  readonly reatRedesStore = inject(ReattRedesStore);
  public readonly router = inject(Router);
  readonly store = inject(Store);
  readonly visible = computed(
    () => this.reatRedesStore.futureReports() !== null && this.reatRedesStore.transaction() !== null,
  );

  selectedReport?: Report;

  constructor() {
    effect(() => {
      if (this.reatRedesStore.transaction() && this.reatRedesStore.futureReports()) {
        this.selectedReport = undefined;
      }
    });
  }

  async createReattribution() {
    const transaction = this.reatRedesStore.transaction();
    if (!transaction) throw new Error('No base transaction');
    await this.router.navigateByUrl(
      `/reports/transactions/report/${this.selectedReport?.id}/create/${transaction.transaction_type_identifier}?${this.reatRedesStore.nounLabel()}=${transaction.id}`,
    );
    this.reatRedesStore.clearTransaction();
  }

  cancel() {
    this.reatRedesStore.clearTransaction();
  }
}
