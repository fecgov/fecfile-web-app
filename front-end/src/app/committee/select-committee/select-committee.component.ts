import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { CommitteeAccountService } from 'app/shared/services/committee-account.service';
import { FecApiService } from 'app/shared/services/fec-api.service';
import { setCommitteeAccountDetailsAction } from 'app/store/committee-account.actions';
import { concatMap, forkJoin, map } from 'rxjs';

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
    protected store: Store,
    protected router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.committeeAccountService
      .getCommittees()
      .pipe(
        concatMap((committees: CommitteeAccount[]) => {
          const augmented = committees.map((committee) => {
            return this.fecApiService.getCommitteeDetails(committee.committee_id || '').pipe(
              map((fecCommittee: CommitteeAccount) => {
                return { ...committee, ...fecCommittee } as CommitteeAccount;
              })
            );
          });
          return forkJoin(augmented);
        })
      )
      .subscribe((committees) => (this.committees = committees));
  }

  activateCommittee(committee: CommitteeAccount): void {
    this.committeeAccountService.activateCommittee(committee.id).subscribe(() => {
      this.store.dispatch(setCommitteeAccountDetailsAction({ payload: committee }));
      this.router.navigateByUrl(``);
    });
  }
}
