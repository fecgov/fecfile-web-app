import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCommitteeAccount } from '../store/committee-account.selectors';
import { CommitteeAccount, CommitteeTypeLabels } from 'app/shared/models/committee-account.model';
import { LabelList } from 'app/shared/utils/label.utils';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  // styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  public committeeAccount$: Observable<CommitteeAccount> | null = null;
  public committeeTypeLabels: LabelList = CommitteeTypeLabels;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.committeeAccount$ = this.store.select(selectCommitteeAccount);
  }
}
