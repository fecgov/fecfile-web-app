import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  committeeAccount$: Observable<CommitteeAccount> | null = null;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.committeeAccount$ = this.store.select(selectCommitteeAccount);
  }

  /**
 * This sends the user to their F3X on fec.gov.
 */
  viewF3X(): void {

  }

  /**
 * This sends the user to their F3X on fec.gov.
 */
  updateForm1(): void {
    
  }
}
