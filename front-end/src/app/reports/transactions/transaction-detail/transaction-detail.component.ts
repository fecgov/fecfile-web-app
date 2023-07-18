import { Component, OnChanges } from '@angular/core';
import { TransactionTypeBaseComponent } from 'app/shared/components/transaction-type-base/transaction-type-base.component';
import { LabelConfig } from 'app/shared/utils/transaction-type-labels.utils';
import { TransactionTypeFormProperties } from 'app/shared/utils/transaction-type-properties';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['../transaction.scss'],
})
export class TransactionDetailComponent extends TransactionTypeBaseComponent implements OnChanges {
  override formProperties: string[] = [];
  formFieldsConfig?: TransactionTypeFormProperties;
  labelConfig?: LabelConfig;

  override ngOnInit(): void {
    if (this.transaction?.transactionType?.templateMap) {
      super.ngOnInit();
    } else {
      throw new Error('Fecfile: Template map not found for transaction component');
    }
  }

  ngOnChanges(): void {
    if (this.transaction?.transactionType?.templateMap) {
      const transactionType = this.transaction.transactionType;
      this.labelConfig = transactionType.labelConfig;
      this.formFieldsConfig = transactionType.formFieldsConfig;
      // SHOULD BE IN BASE
      this.formProperties = this.formFieldsConfig.getFormControlNames(transactionType.templateMap);
      this.contactTypeOptions = transactionType.formFieldsConfig.getContactTypeOptions();

      super.ngOnInit();
    } else {
      throw new Error('Fecfile: Template map not found for transaction component');
    }
  }
}
