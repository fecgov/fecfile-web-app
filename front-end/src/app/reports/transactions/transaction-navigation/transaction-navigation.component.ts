import { Component, input } from '@angular/core';
import { Transaction } from 'app/shared/models/transaction.model';
import {
  GO_BACK_CONTROL,
  NavigationControl,
  TransactionNavigationControls,
} from 'app/shared/models/transaction-navigation-controls.model';

import { NavigationControlComponent } from '../../../shared/components/navigation-control/navigation-control.component';
import { NavigationControlBarComponent } from '../../../shared/components/navigation-control-bar/navigation-control-bar.component';

@Component({
  selector: 'app-transaction-navigation',
  templateUrl: './transaction-navigation.component.html',
  imports: [NavigationControlComponent, NavigationControlBarComponent],
})
export class TransactionNavigationComponent {
  isEditable = input(true);
  transaction = input<Transaction>();

  getNavigationControls(): TransactionNavigationControls {
    const transaction = this.transaction();
    if (!this.isEditable() || !transaction) return new TransactionNavigationControls([], [GO_BACK_CONTROL], []);
    return (
      transaction.transactionType?.getNavigationControls(transaction) ?? new TransactionNavigationControls([], [], [])
    );
  }

  getInlineControls(): NavigationControl[] {
    return this.getNavigationControls().getNavigationControls('inline', this.transaction());
  }
}
