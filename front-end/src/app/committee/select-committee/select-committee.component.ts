import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { CommitteeAccountService } from 'app/shared/services/committee-account.service';
import { setCommitteeAccountDetailsAction } from 'app/store/committee-account.actions';

@Component({
  selector: 'app-select-committee',
  templateUrl: './select-committee.component.html',
  styleUrls: ['./select-committee.component.scss'],
})
export class SelectCommitteeComponent extends DestroyerComponent implements OnInit {
  committees?: CommitteeAccount[];

  constructor(
    protected committeeAccountService: CommitteeAccountService,
    protected store: Store,
    protected router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
    this.committeeAccountService.getCommittees().subscribe((committees) => (this.committees = committees));
  }

  activateCommittee(committee: CommitteeAccount): void {
    this.committeeAccountService.activateCommittee(committee.id).subscribe(async () => {
      this.store.dispatch(setCommitteeAccountDetailsAction({ payload: committee }));
      await this.router.navigateByUrl(``);
    });
  }
}
