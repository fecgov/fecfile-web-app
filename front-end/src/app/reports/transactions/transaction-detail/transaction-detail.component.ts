import { Component, OnChanges } from '@angular/core';
import { TransactionTypeBaseComponent } from 'app/shared/components/transaction-type-base/transaction-type-base.component';
import { ContactTypes } from 'app/shared/models/contact.model';
import { TransactionGroup } from 'app/shared/models/transaction-groups/transaction-group.model';
import { takeUntil } from 'rxjs';

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
      const transactionGroup = transactionType.transactionGroup as TransactionGroup;

      //this.contactTypeOptions = transactionGroup.getContactTypeOptions();
      this.contactTypeOptions = transactionType.formProperties.getContactTypeOptions();
      //this.formProperties = transactionGroup.getFormProperties(transactionType.templateMap, transactionType.scheduleId);
      this.formProperties = transactionType.formProperties.getFormControlNames(transactionType.templateMap);
      this.hasCommitteeFecIdInput = transactionGroup.hasCommitteeFecIdInput();
      //this.hasElectionInformationInput = transactionGroup.hasElectionInformationInput();
      this.hasElectionInformationInput = transactionType.formProperties.hasElectionInformation();
      //this.hasCandidateInformationInput = transactionGroup.hasCandidateInformationInput();
      this.hasCandidateInformationInput = transactionType.formProperties.hasCandidateInformation();
      this.hasCandidateCommitteeInput = transactionType.hasCandidateComittee;
      this.hasCandidateOfficeInput = transactionGroup.hasCandidateOfficeInput();

      super.ngOnInit();

      this.hasEmployerInput = transactionGroup.hasEmployerInput(
        this.form.get('entity_type')?.value,
        transactionType.scheduleId
      );
      this.form
        .get('entity_type')
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((entityType: ContactTypes) => {
          this.hasEmployerInput = transactionGroup.hasEmployerInput(entityType, transactionType.scheduleId);
        });
    } else {
      throw new Error('Fecfile: Template map not found for transaction component');
    }
  }
}
