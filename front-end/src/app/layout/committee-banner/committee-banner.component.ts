import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';

const committeeStatusCodes: { [key: string]: string } = {
  T: 'Terminated',
  A: 'Administratively terminated',
  D: 'Active - Debt',
  W: 'Active - Waived',
  M: 'Active - Monthly',
  Q: 'Active - Quarterly',
};

const activeStatusCodes = ['M', 'Q', 'W', 'D'];

@Component({
  selector: 'app-committee-banner',
  templateUrl: './committee-banner.component.html',
  styleUrls: ['./committee-banner.component.scss'],
})
export class CommitteeBannerComponent extends DestroyerComponent implements OnInit {
  private readonly store = inject(Store);
  committeeName?: string;
  committeeStatus?: string;
  committeeFrequency?: string;
  committeeTypeLabel?: string;
  committeeID?: string;

  ngOnInit(): void {
    this.store
      .select(selectCommitteeAccount)
      .pipe(takeUntil(this.destroy$))
      .subscribe((committeeAccount) => {
        this.committeeName = committeeAccount.name;
        this.committeeID = committeeAccount.committee_id;

        const frequencyCode = committeeAccount.filing_frequency;
        if (frequencyCode) {
          this.committeeFrequency = committeeStatusCodes[frequencyCode] ?? '';
          this.committeeStatus = activeStatusCodes.includes(frequencyCode) ? 'Active' : 'Inactive';
        }

        this.committeeTypeLabel = committeeAccount.committee_type_label ?? '';
      });
  }
}
