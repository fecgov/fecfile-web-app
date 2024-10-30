import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { FecFiling } from 'app/shared/models/fec-filing.model';
import { CommitteeAccountService } from 'app/shared/services/committee-account.service';
import { UsersService } from 'app/shared/services/users.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-create-committee',
  templateUrl: './create-committee.component.html',
  styleUrls: ['./create-committee.component.scss'],
})
export class CreateCommitteeComponent extends DestroyerComponent {
  suggestions?: FecFiling[];
  selectedCommittee?: CommitteeAccount;
  explanationVisible = false;
  unableToCreateAccount = false;

  searchBoxFormControl = new FormControl('');

  constructor(
    protected messageService: MessageService,
    protected committeeAccountService: CommitteeAccountService,
    protected confirmationService: ConfirmationService,
    private userService: UsersService,
    private router: Router,
  ) {
    super();
  }

  search(committeeId: string | null) {
    this.selectedCommittee = undefined;
    this.unableToCreateAccount = false;
    if (committeeId) {
      firstValueFrom(this.committeeAccountService.getAvailableCommittee(committeeId)).then(
        this.handleSuccessfulSearch.bind(this),
        this.handleFailedSearch.bind(this),
      );
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
      const user = await this.userService.getCurrentUser();
      await this.router.navigateByUrl(user.security_consent_exp_date ? '' : '/login/security-notice');
    } catch {
      this.handleFailedSearch();
    }
  }

  showExplanation() {
    this.explanationVisible = true;
  }
}
