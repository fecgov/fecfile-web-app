import { Component, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';

const committeeStatusCodes: { [key: string]: string } = {
  T: 'Terminated (T)',
  A: 'Administratively Terminated (A)',
  D: 'Debt (D)',
  W: 'Waived (W)',
  M: 'Monthly (M)',
  Q: 'Quarterly (Q)',
};

const activeStatusCodes = ['M', 'Q', 'W', 'D'];

@Component({
  selector: 'app-committee-banner',
  templateUrl: './committee-banner.component.html',
  styleUrls: ['./committee-banner.component.scss'],
})
export class CommitteeBannerComponent {
  private readonly store = inject(Store);
  readonly committee = this.store.selectSignal(selectCommitteeAccount);
  readonly committeeName = computed(() => this.committee().name);
  readonly committeeTypeLabel = computed(() => this.committee().committee_type_label ?? '');
  readonly committeeID = computed(() => this.committee().committee_id);

  private readonly frequencyCode = computed(() => this.committee().filing_frequency ?? '');
  readonly committeeFrequency = computed(() => committeeStatusCodes[this.frequencyCode()] ?? '');
  readonly committeeStatus = computed(() => (activeStatusCodes.includes(this.frequencyCode()) ? 'Active' : 'Inactive'));
  readonly frequencyColor = computed(() => (this.committeeStatus() === 'Active' ? '#4AA564' : '#AEB0B5'));
}
