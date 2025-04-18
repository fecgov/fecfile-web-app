import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { CommitteeAccountService } from 'app/shared/services/committee-account.service';
import { UsersService } from 'app/shared/services/users.service';
import { setCommitteeAccountDetailsAction } from 'app/store/committee-account.actions';
import { userLoginDataRetrievedAction } from 'app/store/user-login-data.actions';
import { derivedAsync } from 'ngxtension/derived-async';

@Component({
  selector: 'app-select-committee',
  templateUrl: './select-committee.component.html',
  styleUrls: ['./select-committee.component.scss'],
  imports: [RouterLink],
})
export class SelectCommitteeComponent {
  protected readonly committeeAccountService = inject(CommitteeAccountService);
  protected readonly store = inject(Store);
  protected readonly router = inject(Router);
  private readonly userService = inject(UsersService);
  readonly committees = derivedAsync(() => this.committeeAccountService.getCommittees(), { initialValue: [] });

  async activateCommittee(committee: CommitteeAccount): Promise<void> {
    await this.committeeAccountService.activateCommittee(committee.id);
    this.store.dispatch(setCommitteeAccountDetailsAction({ payload: committee }));
    this.userService.getCurrentUser().then((userLoginData) => {
      this.store.dispatch(userLoginDataRetrievedAction({ payload: userLoginData }));
    });
    await this.router.navigateByUrl(``);
  }
}
