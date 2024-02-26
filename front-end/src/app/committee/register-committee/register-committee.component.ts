import { Component, OnInit } from '@angular/core';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { FecFiling } from 'app/shared/models/fec-filing.model';
import { CommitteeAccountService } from 'app/shared/services/committee-account.service';
import { FecApiService } from 'app/shared/services/fec-api.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-register-committee',
  templateUrl: './register-committee.component.html',
  styleUrls: ['./register-committee.component.scss'],
})
export class RegisterCommitteeComponent extends DestroyerComponent implements OnInit {
  query?: string;
  suggestions?: FecFiling[];
  selectedCommittee?: CommitteeAccount;
  explanationVisible = false;

  constructor(
    protected fecApiService: FecApiService,
    protected messageService: MessageService,
    protected committeeAccountService: CommitteeAccountService,
    protected confirmationService: ConfirmationService,
  ) {
    super();
  }
  ngOnInit(): void {}

  search(event: any) {
    this.query = event.query;
    this.fecApiService.queryFilings(this.query ?? '', 'F1').then((filings) => {
      this.suggestions = filings;
    });
  }
  select(committee: FecFiling) {
    this.selectedCommittee = new CommitteeAccount();
    this.selectedCommittee.name = committee.committee_name;
    this.selectedCommittee.committee_id = committee.committee_id;
  }
  createAccount() {
    this.committeeAccountService
      .registerCommitteeAccount(this.selectedCommittee?.committee_id ?? '')
      .then((committeeAccount) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: `Committee Account ${committeeAccount.committee_id} Created`,
          life: 3000,
        });
      });
  }
  showExplanation() {
    this.explanationVisible = true;
  }
}
