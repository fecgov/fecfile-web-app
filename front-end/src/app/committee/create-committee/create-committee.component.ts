import { Component } from '@angular/core';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { FecFiling } from 'app/shared/models/fec-filing.model';
import { CommitteeAccountService } from 'app/shared/services/committee-account.service';
import { FecApiService } from 'app/shared/services/fec-api.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-create-committee',
  templateUrl: './create-committee.component.html',
  styleUrls: ['./create-committee.component.scss'],
})
export class CreateCommitteeComponent extends DestroyerComponent {
  query?: string;
  suggestions?: FecFiling[];
  selectedCommittee?: CommitteeAccount;
  explanationVisible = false;
  unableToCreateAccount = false;

  constructor(
    protected fecApiService: FecApiService,
    protected messageService: MessageService,
    protected committeeAccountService: CommitteeAccountService,
    protected confirmationService: ConfirmationService,
  ) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  search(event: any) {
    this.query = event.query;
    this.fecApiService.queryFilings(this.query ?? '', 'F1').then((filings) => {
      this.suggestions = filings;
    });
  }
  select(committee: FecFiling) {
    this.query = undefined;
    this.selectedCommittee = new CommitteeAccount();
    this.selectedCommittee.name = committee.committee_name;
    this.selectedCommittee.committee_id = committee.committee_id;
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
        this.unableToCreateAccount = true;
        this.selectedCommittee = undefined;
      },
    );
  }
  showExplanation() {
    this.explanationVisible = true;
  }
}
