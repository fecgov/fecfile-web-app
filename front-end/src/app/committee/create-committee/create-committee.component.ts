import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { FecFiling } from 'app/shared/models/fec-filing.model';
import { CommitteeAccountService } from 'app/shared/services/committee-account.service';
import { FecApiService } from 'app/shared/services/fec-api.service';
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
    protected fecApiService: FecApiService,
    protected messageService: MessageService,
    protected committeeAccountService: CommitteeAccountService,
    protected confirmationService: ConfirmationService,
  ) {
    super();
  }

  search(committeeId: string | null) {
    this.selectedCommittee = undefined;
    this.unableToCreateAccount = false;
    if (committeeId) {
      firstValueFrom(this.fecApiService.getCommitteeDetails(committeeId, true)).then(
        (filing) => {
          if (filing) {
            this.handleSuccessfulSearch(filing);
          } else {
            this.handleFailedSearch();
          }
        },
        () => {
          this.handleFailedSearch();
        },
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

  createAccount() {
    this.unableToCreateAccount = false;
    this.committeeAccountService.createCommitteeAccount(this.selectedCommittee?.committee_id ?? '').then(
      (committeeAccount) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: `Committee Account ${committeeAccount.committee_id} Created`,
          life: 3000,
        });
      },
      () => {
        this.handleFailedSearch();
      },
    );
  }
  showExplanation() {
    this.explanationVisible = true;
  }
}
