import { Component, Input } from '@angular/core';
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
  @Input() isEditable = true;
  @Input() transaction?: Transaction;

  getNavigationControls(): TransactionNavigationControls {
    if (!this.isEditable) return new TransactionNavigationControls([], [GO_BACK_CONTROL], []);
    return (
      this.transaction?.transactionType?.getNavigationControls(this.transaction) ??
      new TransactionNavigationControls([], [], [])
    );
  }

  getInlineControls(): NavigationControl[] {
    return this.getNavigationControls().getNavigationControls('inline', this.transaction);
  }
}
