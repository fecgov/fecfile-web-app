import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TransactionTypeBaseComponent } from 'app/shared/components/transaction-type-base/transaction-type-base.component';
import { ContactTypeLabels, ContactTypes } from 'app/shared/models/contact.model';
import { TransactionGroup } from 'app/shared/models/transaction-groups/transaction-group.model';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
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

  ngOnChanges(changes: SimpleChanges): void {
    if (this.transaction?.transactionType?.templateMap) {
      const transactionType = this.transaction.transactionType;
      const transactionGroup = transactionType.transactionGroup as TransactionGroup;

      this.contactTypeOptions = transactionGroup.getContactTypeOptions();
      this.formProperties = transactionGroup.getFormProperties(transactionType.templateMap, transactionType.scheduleId);
      this.hasCommitteeFecIdInput = transactionGroup.hasCommitteeFecIdInput();
      this.hasElectionInformationInput = transactionGroup.hasElectionInformationInput();
      this.hasCandidateInformationInput = transactionGroup.hasCandidateInformationInput();

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
