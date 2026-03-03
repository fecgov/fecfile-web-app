import { Component, computed, input } from '@angular/core';
import type { Transaction } from 'app/shared/models/transaction.model';
import {
  GO_BACK_CONTROL,
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
  readonly isEditable = input(true);
  readonly transaction = input<Transaction | undefined>(undefined);
  readonly navigationControls = computed(() => {
    const isEditable = this.isEditable();
    const transaction = this.transaction();
    if (!isEditable) return new TransactionNavigationControls([], [GO_BACK_CONTROL], []);
    if (!transaction) return new TransactionNavigationControls([], [], []);
    return (
      transaction.transactionType.getNavigationControls(transaction) ?? new TransactionNavigationControls([], [], [])
    );
  });

  readonly inlineControls = computed(() =>
    this.navigationControls().getNavigationControls('inline', this.transaction()),
  );
}
