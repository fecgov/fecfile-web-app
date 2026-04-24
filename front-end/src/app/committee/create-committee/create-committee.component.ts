import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { FecFiling } from 'app/shared/models/fec-filing.model';
import { CommitteeAccountService } from 'app/shared/services/committee-account.service';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { setCommitteeAccountDetailsAction } from 'app/store/committee-account.actions';
import { ConfirmationService, MessageService, PrimeTemplate } from 'primeng/api';
import { InputGroup } from 'primeng/inputgroup';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { UsersService } from 'app/shared/services/users.service';
import { userLoginDataRetrievedAction } from 'app/store/user-login-data.actions';
import { DialogComponent } from 'app/shared/components/dialog/dialog.component';

@Component({
  selector: 'app-create-committee',
  templateUrl: './create-committee.component.html',
  styleUrls: ['./create-committee.component.scss'],
  imports: [RouterLink, InputGroup, ReactiveFormsModule, PrimeTemplate, CheckboxModule, ButtonModule, DialogComponent],
})
export class CreateCommitteeComponent {
  private readonly router = inject(Router);
  protected readonly store = inject(Store);
  protected readonly committeeAccountService = inject(CommitteeAccountService);
  protected readonly messageService = inject(MessageService);
  protected readonly confirmationService = inject(ConfirmationService);
  private readonly userService = inject(UsersService);
  suggestions?: FecFiling[];
  readonly explanationVisible = signal(false);

  readonly selectedCommittee = signal<CommitteeAccount | undefined>(undefined);
  readonly unableToCreateAccount = signal(false);
  readonly loading = signal(false);
  readonly showResult = computed(() => !!this.selectedCommittee() || this.unableToCreateAccount() || this.loading());

  searchBoxFormControl = new SubscriptionFormControl('');

  search(committeeId: string | null) {
    this.selectedCommittee.set(undefined);
    this.unableToCreateAccount.set(false);
    if (committeeId) {
      this.loading.set(true);
      this.committeeAccountService
        .getAvailableCommittee(committeeId)
        .then(
          (committee) => this.selectedCommittee.set(committee),
          () => this.unableToCreateAccount.set(true),
        )
        .finally(() => this.loading.set(false));
    }
  }

  async createAccount() {
    this.unableToCreateAccount.set(false);
    try {
      const committeeAccount = await this.committeeAccountService.createCommitteeAccount(
        this.selectedCommittee()?.committee_id ?? '',
      );
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: `Committee Account ${committeeAccount.committee_id} Created`,
        life: 3000,
      });
      await this.committeeAccountService.activateCommittee(committeeAccount.id);
      this.store.dispatch(setCommitteeAccountDetailsAction({ payload: committeeAccount }));
      const userLoginData = await this.userService.getCurrentUser();
      this.store.dispatch(userLoginDataRetrievedAction({ payload: userLoginData }));
      await this.router.navigateByUrl(``);
    } catch {
      this.selectedCommittee.set(undefined);
      this.unableToCreateAccount.set(true);
    }
  }
}
