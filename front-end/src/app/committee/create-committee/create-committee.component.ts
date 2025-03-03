import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { FecFiling } from 'app/shared/models/fec-filing.model';
import { CommitteeAccountService } from 'app/shared/services/committee-account.service';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { setCommitteeAccountDetailsAction } from 'app/store/committee-account.actions';
import { ConfirmationService, MessageService, PrimeTemplate } from 'primeng/api';
import { InputGroup } from 'primeng/inputgroup';
import { ReactiveFormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-create-committee',
  templateUrl: './create-committee.component.html',
  styleUrls: ['./create-committee.component.scss'],
  imports: [RouterLink, InputGroup, ReactiveFormsModule, PrimeTemplate, Dialog, CheckboxModule, ButtonModule],
})
export class CreateCommitteeComponent extends DestroyerComponent {
  private readonly router = inject(Router);
  protected readonly store = inject(Store);
  suggestions?: FecFiling[];
  selectedCommittee?: CommitteeAccount;
  explanationVisible = false;
  unableToCreateAccount = false;

  searchBoxFormControl = new SubscriptionFormControl('');

  protected readonly committeeAccountService = inject(CommitteeAccountService);
  protected readonly messageService = inject(MessageService);
  protected readonly confirmationService = inject(ConfirmationService);

  search(committeeId: string | null) {
    this.selectedCommittee = undefined;
    this.unableToCreateAccount = false;
    if (committeeId) {
      this.committeeAccountService
        .getAvailableCommittee(committeeId)
        .then(this.handleSuccessfulSearch.bind(this), this.handleFailedSearch.bind(this));
    }
  }

  handleSuccessfulSearch(committee: CommitteeAccount) {
    this.selectedCommittee = committee;
  }

  handleFailedSearch() {
    this.unableToCreateAccount = true;
    this.selectedCommittee = undefined;
  }

  async createAccount() {
    this.unableToCreateAccount = false;
    try {
      const committeeAccount = await this.committeeAccountService.createCommitteeAccount(
        this.selectedCommittee?.committee_id ?? '',
      );
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: `Committee Account ${committeeAccount.committee_id} Created`,
        life: 3000,
      });
      await this.committeeAccountService.activateCommittee(committeeAccount.id);
      this.store.dispatch(setCommitteeAccountDetailsAction({ payload: committeeAccount }));
      await this.router.navigateByUrl(``);
    } catch {
      this.handleFailedSearch();
    }
  }

  showExplanation() {
    this.explanationVisible = true;
  }
}
