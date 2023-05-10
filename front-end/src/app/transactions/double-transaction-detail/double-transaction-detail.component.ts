import { Component, OnInit } from '@angular/core';
import { DoubleTransactionTypeBaseComponent } from 'app/shared/components/transaction-type-base/double-transaction-type-base.component';
import { DoubleTransactionGroup } from 'app/shared/models/transaction-groups/double-transaction-group.model';

@Component({
  selector: 'app-double-transaction-detail',
  templateUrl: './double-transaction-detail.component.html',
  styleUrls: ['../transaction.scss'],
})
export class DoubleTransactionDetailComponent extends DoubleTransactionTypeBaseComponent implements OnInit {
  override formProperties: string[] = [];
  override childFormProperties: string[] = [];
  hasEmployerInput = false;
  childTransactionTitle = '';

  override ngOnInit(): void {
    if (this.transaction?.transactionType?.templateMap) {
      const childTransaction = this.transaction?.children ? this.transaction?.children[0] : undefined;
      if (childTransaction?.transactionType?.templateMap) {
        const transactionType = this.transaction.transactionType;
        const childTransactionType = childTransaction.transactionType;
        const doubleTransactionGroup = transactionType.transactionGroup as DoubleTransactionGroup;

        this.formProperties = doubleTransactionGroup.getFormProperties(transactionType.templateMap);
        this.childFormProperties = doubleTransactionGroup.getChildFormProperties(childTransactionType.templateMap);

        this.contactTypeOptions = doubleTransactionGroup.getContactTypeOptions();
        this.childContactTypeOptions = doubleTransactionGroup.getChildContactTypeOptions();

        this.hasEmployerInput = doubleTransactionGroup.hasEmployerInput();
        this.childTransactionTitle = doubleTransactionGroup.getChildTransactionTitle();
        super.ngOnInit();
      } else {
        throw new Error('Fecfile: child template map not found');
      }
    } else {
      throw new Error('Fecfile: parent template map not found');
    }
  }
}
