import { Component, computed, input } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-preview-report-details',
  imports: [CardModule],
  templateUrl: './preview-report-details.component.html',
  styleUrl: './preview-report-details.component.scss',
})
export class PreviewReportDetailsComponent {
  readonly report = input.required<Record<string, string>>();

  private text(field: string): string {
    const value = this.report()[field];
    return value === null || value === undefined ? '' : String(value);
  }

  readonly details = computed(() => [
    { label: 'Form type', value: this.text('form_type') },
    { label: 'Report code', value: this.text('report_code') },
    { label: 'Committee ID', value: this.text('filer_committee_id_number') },
    { label: 'Committee name', value: this.text('committee_name') },
    { label: 'Coverage from', value: this.text('coverage_from_date') },
    { label: 'Coverage through', value: this.text('coverage_through_date') },
    { label: 'Election code', value: this.text('election_code') },
    { label: 'Election date', value: this.text('date_of_election') },
    { label: 'Date signed', value: this.text('date_signed') },
    {
      label: 'Treasurer',
      value: [
        this.text('treasurer_prefix'),
        this.text('treasurer_first_name'),
        this.text('treasurer_middle_name'),
        this.text('treasurer_last_name'),
        this.text('treasurer_suffix'),
      ]
        .filter(Boolean)
        .join(' '),
    },
  ]);

  readonly addressLines = computed(() =>
    [
      this.text('street_1'),
      this.text('street_2'),
      [this.text('city'), [this.text('state'), this.text('zip')].filter(Boolean).join(' ')].filter(Boolean).join(', '),
    ].filter(Boolean),
  );
}
