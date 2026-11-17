import { Component, computed, input } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-preview-header-details',
  imports: [CardModule],
  templateUrl: './preview-header-details.component.html',
  styleUrl: './preview-header-details.component.scss',
})
export class PreviewHeaderDetailsComponent {
  readonly header = input.required<Record<string, string>>();

  private text(field: string): string {
    const value = this.header()[field];
    return value === null || value === undefined ? '' : String(value);
  }

  readonly details = computed(() => [
    { label: 'Record type', value: this.text('record_type') },
    { label: 'Electronic filing type', value: this.text('ef_type') },
    { label: 'FEC version', value: this.text('fec_version') },
    { label: 'Software name', value: this.text('soft_name') },
    { label: 'Software version', value: this.text('soft_ver') },
    { label: 'Report ID', value: this.text('rpt_id') },
    { label: 'Report number', value: this.text('rpt_number') },
    { label: 'Header comment', value: this.text('hdrcomment') },
  ]);
}
