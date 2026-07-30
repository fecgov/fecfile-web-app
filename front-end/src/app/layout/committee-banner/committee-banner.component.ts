import { Component, computed, inject } from '@angular/core';
import { CommitteeStore } from 'app/committee/committee.store';

const committeeStatusCodes: { [key: string]: string } = {
  T: 'Terminated (T)',
  A: 'Administratively Terminated (A)',
  D: 'Debt (D)',
  W: 'Waived (W)',
  M: 'Monthly (M)',
  Q: 'Quarterly (Q)',
};

const activeStatusCodes = new Set(['M', 'Q', 'W', 'D']);

@Component({
  selector: 'app-committee-banner',
  templateUrl: './committee-banner.component.html',
  styleUrls: ['./committee-banner.component.scss'],
})
export class CommitteeBannerComponent {
  private readonly committeeStore = inject(CommitteeStore);
  readonly committeeName = computed(() => this.committeeStore.committee()?.name);
  readonly committeeTypeLabel = computed(() => this.committeeStore.committee()?.committee_type_label ?? '');
  readonly committeeID = computed(() => this.committeeStore.committee()?.committee_id);
  private readonly frequencyCode = computed(() => this.committeeStore.committee()?.filing_frequency ?? '');
  readonly committeeFrequency = computed(() => committeeStatusCodes[this.frequencyCode()] ?? '');
  readonly committeeStatus = computed(() => (activeStatusCodes.has(this.frequencyCode()) ? 'Active' : 'Inactive'));
  readonly frequencyColor = computed(() => (this.committeeStatus() === 'Active' ? '#4AA564' : '#AEB0B5'));
}
