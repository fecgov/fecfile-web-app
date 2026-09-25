import { Component, computed, inject } from '@angular/core';
import { CommitteeStore } from 'app/committee/committee.store';

@Component({
  selector: 'app-committee-banner',
  templateUrl: './committee-banner.component.html',
  styleUrls: ['./committee-banner.component.scss'],
})
export class CommitteeBannerComponent {
  readonly committeeStore = inject(CommitteeStore);
  readonly frequencyColor = computed(() =>
    this.committeeStore.committeeStatus() === 'Active' ? '#4AA564' : '#AEB0B5',
  );
}
