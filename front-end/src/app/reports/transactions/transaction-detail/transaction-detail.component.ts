import { Component, OnChanges } from '@angular/core';
import { TransactionTypeBaseComponent } from 'app/shared/components/transaction-type-base/transaction-type-base.component';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['../transaction.scss'],
})
export class TransactionDetailComponent extends TransactionTypeBaseComponent implements OnChanges {
  override formProperties: string[] = [];
  hasEmployerInput = false;
  hasCommitteeFecIdInput = false;
  hasElectionInformationInput = false;
  hasCandidateInformationInput = false;
  hasCandidateCommitteeInput = false;
  hasCandidateOfficeInput = true;

  ngOnChanges(): void {
    if (this.transaction?.transactionType?.templateMap) {
      const transactionType = this.transaction.transactionType;

      //this.contactTypeOptions = transactionGroup.getContactTypeOptions();
      this.contactTypeOptions = transactionType.formProperties.getContactTypeOptions();
      //this.formProperties = transactionGroup.getFormProperties(transactionType.templateMap, transactionType.scheduleId);
      this.formProperties = transactionType.formProperties.getFormControlNames(transactionType.templateMap);
      this.hasCommitteeFecIdInput = transactionType.formProperties.hasCommitteeFecId();
      //this.hasElectionInformationInput = transactionGroup.hasElectionInformationInput();
      this.hasElectionInformationInput = transactionType.formProperties.hasElectionInformation();
      //this.hasCandidateInformationInput = transactionGroup.hasCandidateInformationInput();
      this.hasCandidateInformationInput = transactionType.formProperties.hasCandidateInformation();
      // this.hasCandidateCommitteeInput = transactionGroup.hasCandidateCommitteeInput();
      this.hasCandidateCommitteeInput = transactionType.formProperties.hasCandidateCommittee();
      this.hasEmployerInput = transactionType.formProperties.hasEmployeeFields();

      super.ngOnInit();
    } else {
      throw new Error('Fecfile: Template map not found for transaction component');
    }
  }
}
