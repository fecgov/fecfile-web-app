import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';

@Component({
  selector: 'app-committee-banner',
  templateUrl: './committee-banner.component.html',
  styleUrls: ['./committee-banner.component.scss'],
})
export class CommitteeBannerComponent extends DestroyerComponent implements OnInit {
  committeeName?: string;
  committeeStatus?: string;
  committeeFrequency?: string;
  committeeType?: string;
  committeeID?: string;

  constructor(private store: Store) {
    super();
  }

  public committee_statuses: { [key: string]: string } = {
    T: 'Terminated',
    A: 'Administratively terminated',
    D: 'Active - Debt',
    W: 'Active - Waived',
    M: 'Active - Monthly',
    Q: 'Active - Quarterly',
  };

  public committee_types: { [key: string]: string } = {
    C: 'communication cost',
    D: 'delegate',
    E: 'electioneering communication',
    H: 'House',
    I: 'independent expenditure filer (not a committee)',
    N: 'PAC - nonqualified',
    O: 'independent expenditure-only (super PACs)',
    P: 'presidential',
    Q: 'PAC - qualified',
    S: 'Senate',
    U: 'single candidate independent expenditure',
    V: 'PAC with non-contribution account, nonqualified',
    W: 'PAC with non-contribution account, qualified',
    X: 'party, nonqualified',
    Y: 'party, qualified',
    Z: 'national party non-federal account',
  };

  public activeCommittees = ['M', 'Q', 'W', 'D'];

  ngOnInit(): void {
    this.store
      .select(selectCommitteeAccount)
      .pipe(takeUntil(this.destroy$))
      .subscribe((committeeAccount) => {
        this.committeeName = committeeAccount.name;
        this.committeeID = committeeAccount.committee_id;

        const frequencyCode = committeeAccount.filing_frequency;
        if (frequencyCode) {
          this.committeeFrequency = this.committee_statuses[frequencyCode] ?? '';
          this.committeeStatus = this.activeCommittees.includes(frequencyCode) ? 'Active' : 'Inactive';
        }

        const committeeTypeCode = committeeAccount.committee_type;
        if (committeeTypeCode) {
          this.committeeType = this.committee_types[committeeTypeCode] ?? '';
        }
      });
  }
}
