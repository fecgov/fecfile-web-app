import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { FecFiling } from 'app/shared/models/fec-filing.model';
import { CommitteeAccountService } from 'app/shared/services/committee-account.service';
import { committeeIdValidator } from 'app/shared/utils/validators.utils';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register-committee',
  templateUrl: './register-committee.component.html',
  styleUrls: ['./register-committee.component.scss'],
})
export class RegisterCommitteeComponent extends DestroyerComponent {
  query?: string;
  suggestions?: FecFiling[];
  selectedCommittee?: CommitteeAccount;
  explanationVisible = false;
  unableToCreateAccount = false;
  form: FormGroup = new FormGroup({ 'committee-id': new FormControl('', committeeIdValidator) }, { updateOn: 'blur' });

  constructor(
    protected messageService: MessageService,
    protected committeeAccountService: CommitteeAccountService,
    protected router: Router,
  ) {
    super();
  }

  select(committee: FecFiling) {
    this.query = undefined;
    this.selectedCommittee = new CommitteeAccount();
    this.selectedCommittee.name = committee.committee_name;
    this.selectedCommittee.committee_id = committee.committee_id;
  }

  createAccount() {
    this.unableToCreateAccount = false;
    this.committeeAccountService.registerCommitteeAccount(this.selectedCommittee?.committee_id ?? '').then(
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

  registerMembership() {
    const committeeIdField = this.form.get('committee-id') as AbstractControl;
    committeeIdField.updateValueAndValidity();

    const committeeId = committeeIdField.value;
    this.unableToCreateAccount = false;

    if (this.form.get('committee-id')?.valid) {
      this.committeeAccountService.registerCommitteeAccount(committeeId).then(
        (committeeAccount) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: `Committee Account ${committeeAccount.committee_id} Created`,
            life: 3000,
          });
          this.router.navigateByUrl('/select-committee');
        },
        () => {
          this.unableToCreateAccount = true;
          this.selectedCommittee = undefined;
        },
      );
    }
  }
  showExplanation() {
    this.explanationVisible = true;
  }
}
