import { Component, OnInit } from '@angular/core';
import { TransactionTypeBaseComponent } from 'app/shared/components/transaction-type-base/transaction-type-base.component';
import { ContactTypes } from 'app/shared/models/contact.model';
import { TransactionGroup } from 'app/shared/models/transaction-groups/transaction-group.interface';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['../transaction.scss'],
})
export class TransactionDetailComponent extends TransactionTypeBaseComponent implements OnInit {
  override formProperties: string[] = [];
  hasEmployerInput = false;
  hasCommitteeFecIdInput = false;
  hasElectionInformationInput = false;
  amountInputTitle = '';

  override ngOnInit(): void {
    if (this.transaction?.transactionType?.templateMap) {
      const transactionType = this.transaction.transactionType;
      const transactionGroup =
        transactionType.transactionGroup as TransactionGroup;

      this.form.get('entity_type')?.valueChanges.pipe(
        takeUntil(this.destroy$)
      ).subscribe((entityType: ContactTypes) => {
        this.hasEmployerInput = transactionGroup.hasEmployerInput(
          entityType, transactionType.scheduleId);
      });

      this.contactTypeOptions = transactionGroup.getContactTypeOptions();
      this.formProperties = transactionGroup.getFormProperties(
        transactionType.templateMap, transactionType.scheduleId);
      this.hasCommitteeFecIdInput = transactionGroup.hasCommitteeFecIdInput();
      this.hasElectionInformationInput =
        transactionGroup.hasElectionInformationInput();
      this.amountInputTitle = transactionGroup.getAmountInputTitle();
      super.ngOnInit();
    } else {
      throw new Error('Fecfile: Template map not found for transaction component');
    }
  }

}