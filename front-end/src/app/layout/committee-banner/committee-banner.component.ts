import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-committee-banner',
  templateUrl: './committee-banner.component.html',
  styleUrls: ['./committee-banner.component.scss'],
})
export class CommitteeBannerComponent implements OnInit, OnDestroy {
  committeeName?: string;
  committeeStatus?: string;
  committeeFrequency?: string;
  committeeType?: string;
  committeeID?: string;
  private destroy$ = new Subject<boolean>();

  constructor(private store: Store) {}

  public committee_statuses = {
    T: 'Terminated',
    A: 'Administratively terminated',
    D: 'Active - Debt',
    W: 'Active - Waived',
    M: 'Active - Monthly filer',
    Q: 'Active - Quarterly filer',
  };

  public committee_types = {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getArbitraryValueFromObject(code: string, object: any): string {
    return object[code as keyof typeof object] || '';
  }

  public active_committees = ['M', 'Q', 'W', 'D'];

  ngOnInit(): void {
    this.store.select(selectCommitteeAccount).subscribe((committeeAccount) => {
      this.committeeName = committeeAccount.name;
      this.committeeID = committeeAccount.committee_id;

      const frequency_code = committeeAccount.filing_frequency;
      if (frequency_code) {
        this.committeeFrequency = this.getArbitraryValueFromObject(frequency_code, this.committee_statuses);
        this.committeeStatus = frequency_code in this.active_committees ? 'Active' : 'Inactive';
      }

      const committee_type_code = committeeAccount.committee_type;
      if (committee_type_code) {
        this.committeeType = this.getArbitraryValueFromObject(committee_type_code, this.committee_types);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
