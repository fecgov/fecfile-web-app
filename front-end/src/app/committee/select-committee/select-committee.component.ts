import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { CommitteeAccountService } from 'app/shared/services/committee-account.service';
import { UsersService } from 'app/shared/services/users.service';
import { setCommitteeAccountDetailsAction } from 'app/store/committee-account.actions';
import { userLoginDataRetrievedAction } from 'app/store/user-login-data.actions';

@Component({
  selector: 'app-select-committee',
  templateUrl: './select-committee.component.html',
  styleUrls: ['./select-committee.component.scss'],
  imports: [RouterLink],
})
export class SelectCommitteeComponent extends DestroyerComponent implements OnInit {
  protected readonly committeeAccountService = inject(CommitteeAccountService);
  protected readonly store = inject(Store);
  protected readonly router = inject(Router);
  private readonly userService = inject(UsersService);
  committees?: CommitteeAccount[];

  ngOnInit(): void {
    this.committeeAccountService.getCommittees().then((committees) => (this.committees = committees));
  }

  async activateCommittee(committee: CommitteeAccount): Promise<void> {
    await this.committeeAccountService.activateCommittee(committee.id);
    this.store.dispatch(setCommitteeAccountDetailsAction({ payload: committee }));
    this.userService.getCurrentUser().then((userLoginData) => {
      this.store.dispatch(userLoginDataRetrievedAction({ payload: userLoginData }));
    });
    await this.router.navigateByUrl(``);
  }
}
