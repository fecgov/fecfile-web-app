import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss'],
})
export class AccountInfoComponent implements OnInit {
  committeeAccount$: Observable<CommitteeAccount> | null = null;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.committeeAccount$ = this.store.select(selectCommitteeAccount);
  }

  /**
   * This sends the user to their F3X on fec.gov.
   */
  viewF3X(): void {
    return;
  }

  /**
   * This sends the user to their F3X on fec.gov.
   */
  updateForm1(): void {
    window.open('https://webforms.fec.gov/webforms/form1/index.htm', '_blank');
  }
}
