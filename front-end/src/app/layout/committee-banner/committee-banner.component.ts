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
  private readonly selectCommitteeAccount = this.store.selectSignal(selectCommitteeAccount);
  readonly committeeName = computed(() => this.selectCommitteeAccount().name);
  readonly committeeStatus = computed(() => {
    const frequencyCode = this.selectCommitteeAccount().filing_frequency;
    if (!frequencyCode) return '';
    return activeStatusCodes.includes(frequencyCode) ? 'Active' : 'Inactive';
  });
  readonly committeeFrequency = computed(() => {
    const frequencyCode = this.selectCommitteeAccount().filing_frequency;
    if (!frequencyCode) return '';
    return committeeStatusCodes[frequencyCode] ?? '';
  });
  readonly committeeTypeLabel = computed(() => this.selectCommitteeAccount().committee_type_label ?? '');
  readonly committeeID = computed(() => this.selectCommitteeAccount().committee_id);
}
