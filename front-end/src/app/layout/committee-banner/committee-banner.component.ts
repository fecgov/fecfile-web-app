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

  getFilingFrequency(frequency_code: string): string {
    switch (frequency_code) {
      case 'T':
        return 'Terminated';
      case 'A':
        return 'Administratively terminated';
      case 'D':
        return 'Active - Debt';
      case 'W':
        return 'Active - Waived';
      case 'M':
        return 'Active - Monthly filer';
      case 'Q':
        return 'Active - Quarterly filer';
    }
    return '';
  }

  public getCommitteeActive(frequency_code: string): boolean {
    switch (frequency_code) {
      case 'M':
      case 'Q':
      case 'W':
      case 'D':
        return true;
    }
    return false;
  }

  public getCommitteeType(committee_type_code: string): string {
    switch (committee_type_code) {
      case 'C':
        return 'communication cost';
      case 'D':
        return 'delegate';
      case 'E':
        return 'electioneering communication';
      case 'H':
        return 'House';
      case 'I':
        return 'independent expenditure filer (not a committee)';
      case 'N':
        return 'PAC - nonqualified';
      case 'O':
        return 'independent expenditure-only (super PACs)';
      case 'P':
        return 'presidential';
      case 'Q':
        return 'PAC - qualified';
      case 'S':
        return 'Senate';
      case 'U':
        return 'single candidate independent expenditure';
      case 'V':
        return 'PAC with non-contribution account, nonqualified';
      case 'W':
        return 'PAC with non-contribution account, qualified';
      case 'X':
        return 'party, nonqualified';
      case 'Y':
        return 'party, qualified';
      case 'Z':
        return 'national party non-federal account';
    }
    return '';
  }

  ngOnInit(): void {
    this.store.select(selectCommitteeAccount).subscribe((committeeAccount) => {
      this.committeeName = committeeAccount.name;
      this.committeeID = committeeAccount.committee_id;

      const frequency_code = committeeAccount.filing_frequency;
      if (frequency_code) {
        this.committeeFrequency = this.getFilingFrequency(frequency_code);
        this.committeeStatus = this.getCommitteeActive(frequency_code) ? 'Active' : 'Inactive';
      }

      const committee_type_code = committeeAccount.committee_type;
      if (committee_type_code) {
        this.committeeType = this.getCommitteeType(committee_type_code);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
