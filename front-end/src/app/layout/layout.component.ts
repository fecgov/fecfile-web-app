import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCommitteeAccount } from '../store/committee-account.selectors';
import { CommitteeAccount, CommitteeTypeLabels } from 'app/shared/models/committee-account.model';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  public committeeAccount$: Observable<CommitteeAccount> = this.store.select(selectCommitteeAccount);
  public committeeTypeLabels: string[][] = CommitteeTypeLabels;

  constructor(private store: Store) {}
}
