import { computed, inject, Injectable, resource } from '@angular/core';
import { CommitteeStore } from 'app/committee/committee.store';
import { ReportTypes } from 'app/shared/models/reports/report.model';
import { Form3Service } from 'app/shared/services/form-3.service';

@Injectable()
export class ElectionCycleStore {
  private readonly form3Service = inject(Form3Service);
  private readonly committeeStore = inject(CommitteeStore);
  readonly isForm3Committee = computed(() => this.committeeStore.eligibleReportTypes().has(ReportTypes.F3));
  readonly hasForm3Resource = resource({ loader: () => this.hasForm3Reports(), defaultValue: false });

  readonly showElectionCycles = computed(() => {
    if (this.isForm3Committee()) return true;
    return this.hasForm3Resource.value();
  });

  async hasForm3Reports() {
    const response = await this.form3Service.getTableData(1, '', { page_size: 1 });
    return response.count > 0;
  }
}
