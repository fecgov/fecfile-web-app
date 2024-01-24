import { Component, OnDestroy, OnInit } from '@angular/core';
import { DoubleTransactionTypeBaseComponent } from './double-transaction-type-base.component';
import { ReattRedesUtils } from '../../utils/reatt-redes/reatt-redes.utils';
import { SchATransaction } from '../../models/scha-transaction.model';
import { SchBTransaction } from '../../models/schb-transaction.model';
import { SelectItem } from 'primeng/api';
import { NavigationEvent } from '../../models/transaction-navigation-controls.model';
import { Transaction } from '../../models/transaction.model';

@Component({
  template: '',
})
export abstract class ReattRedesTransactionTypeBaseComponent
  extends DoubleTransactionTypeBaseComponent
  implements OnInit, OnDestroy
{
  override ngOnInit(): void {
    super.ngOnInit();

    // If the parent is a reattribution/redesignation transaction, initialize
    // its specialized validation rules and form element behavior.
    ReattRedesUtils.overlayForms(
      this.form,
      this.transaction as SchATransaction | SchBTransaction,
      this.childForm,
      this.childTransaction as SchATransaction | SchBTransaction,
    );
    this.childUpdateFormWithPrimaryContact({
      value: this.transaction?.reatt_redes?.contact_1,
    } as SelectItem);
  }

  override processPayload(payload: Transaction, navigationEvent: NavigationEvent) {
    const payloads: (SchATransaction | SchBTransaction)[] = ReattRedesUtils.getPayloads(payload);
    this.transactionService.multisave(payloads).subscribe((response) => {
      navigationEvent.transaction = response[0];
      this.navigateTo(navigationEvent);
    });
  }
}
