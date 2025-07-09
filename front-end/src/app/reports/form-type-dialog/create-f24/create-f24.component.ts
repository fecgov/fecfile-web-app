import { Component, computed, effect, inject, resource, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { Form24 } from 'app/shared/models';
import { Form24Service } from 'app/shared/services/form-24.service';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { InputText } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-f24',
  imports: [InputText, FormsModule, SelectButtonModule],
  templateUrl: './create-f24.component.html',
  styleUrl: './create-f24.component.scss',
})
export class CreateF24Component {
  readonly router = inject(Router);
  private readonly form24Service = inject(Form24Service);
  private readonly store = inject(Store);
  readonly committeeAccount = this.store.selectSignal(selectCommitteeAccount);
  readonly form24Names = resource({
    loader: async () => {
      const reports = await this.form24Service.getAllReports();
      return reports.map((report) => (report as Form24).name ?? '') ?? [];
    },
  });

  readonly form24Options = [
    { label: '24 Hour ', value: '24' },
    { label: '48 Hour', value: '48' },
  ];

  readonly selectedForm24Type = signal<'24' | '48' | null>(null);
  readonly selectedForm24TypeValid = computed(() => this.selectedForm24Type() !== null);

  readonly form24Name = signal('');
  readonly form24NameErrors = computed(() => {
    const name = this.form24Name();
    if (name === '') return 'Name is required';
    const names = this.form24Names.value();
    if (names?.includes(name)) return 'This name is already in use. Please choose a different name.';
    return undefined;
  });
  readonly form24NameValid = computed(() => !!this.form24NameErrors());

  readonly form24Valid = computed(() => this.selectedForm24TypeValid() && this.form24NameValid());

  readonly isSubmitDisabled = computed(() => !this.selectedForm24Type());

  constructor() {
    effect(() => {
      const type = this.selectedForm24Type();
      this.form24Name.set(type == null ? '' : `${this.selectedForm24Type()}-HOUR: Report of Independent Expenditure`);
    });
  }

  async createF24(): Promise<void> {
    const form24 = Form24.fromJSON({
      name: this.form24Name(),
      report_type_24_48: this.selectedForm24Type(),
      street_1: this.committeeAccount().street_1,
      street_2: this.committeeAccount().street_2,
      city: this.committeeAccount().city,
      state: this.committeeAccount().state,
      zip: this.committeeAccount().zip,
      filer_committee_id_number: this.committeeAccount().committee_id,
      committee_name: this.committeeAccount().name,
    });
    const report = await this.form24Service.create(form24, ['report_type_24_48']);

    this.form24Names.reload();
    this.router.navigateByUrl(`/reports/transactions/report/${report.id}/list`);
  }
}
