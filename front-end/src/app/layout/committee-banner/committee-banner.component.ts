import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-committee-banner',
  templateUrl: './committee-banner.component.html',
  styleUrls: ['./committee-banner.component.scss']
})
export class CommitteeBannerComponent implements OnInit, OnDestroy {
  committeeName: string | undefined;
  subBannerItems: (string | undefined)[] = [];
  private destroy$ = new Subject<boolean>();

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.select(selectCommitteeAccount).subscribe(committeeAccount => {
      this.subBannerItems = [];
      this.committeeName = committeeAccount.name;
      if (committeeAccount.committee_type_full) {
        this.subBannerItems.push(committeeAccount.committee_type_full);
      }
      if (committeeAccount.committee_id) {
        this.subBannerItems.push('ID: ' + committeeAccount.committee_id);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
