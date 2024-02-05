import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { CommitteeAccountService } from 'app/shared/services/committee-account.service';
import { FecApiService } from 'app/shared/services/fec-api.service';
import { setCommitteeAccountDetailsAction } from 'app/store/committee-account.actions';
import { concatAll, concatMap, forkJoin, from, mergeMap, of, reduce, switchMap } from 'rxjs';

@Component({
  selector: 'app-select-committee',
  templateUrl: './select-committee.component.html',
  styleUrls: ['./select-committee.component.scss'],
})
export class SelectCommitteeComponent extends DestroyerComponent implements OnInit {
  committees: CommitteeAccount[] = [];
  constructor(
    protected committeeAccountService: CommitteeAccountService,
    protected fecApiService: FecApiService,
    protected store: Store
  ) {
    super();
  }

  ngOnInit(): void {
    this.committeeAccountService
      .getCommittees()
      .pipe(
        concatMap(
          (committees: CommitteeAccount[]) => forkJoin(committees.map((committee) => of(committee))) //this.fecApiService.getCommitteeDetails(committee.committee_id || '')))
        )
      )
      .subscribe((committees) => (this.committees = committees));
  }

  activateCommittee(committee: CommitteeAccount): void {
    this.committeeAccountService
      .activateCommittee(committee.id)
      .pipe(switchMap(() => this.committeeAccountService.getActiveCommittee()))
      .subscribe((committee) => this.store.dispatch(setCommitteeAccountDetailsAction({ payload: committee })));
  }
}
