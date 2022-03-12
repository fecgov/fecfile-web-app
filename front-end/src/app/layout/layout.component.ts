import { Component, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCommitteeAccount } from '../store/committee-account.selectors';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LayoutComponent {
  public committeeAccount$: Observable<CommitteeAccount> = this.store.select(selectCommitteeAccount);

  constructor(private store: Store) {
    this.store.select(selectCommitteeAccount).subscribe((x) => console.log);
  }
}
