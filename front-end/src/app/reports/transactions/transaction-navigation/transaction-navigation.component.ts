import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Transaction } from 'app/shared/models/transaction.model';
import {
  NavigationControl,
  NavigationEvent,
  TransactionNavigationControls,
  GO_BACK_CONTROL,
} from 'app/shared/models/transaction-navigation-controls.model';

@Component({
  selector: 'app-transaction-navigation',
  templateUrl: './transaction-navigation.component.html',
})
export class TransactionNavigationComponent {
  @Input() isEditable = true;
  @Input() transaction?: Transaction;
  @Output() navigate: EventEmitter<NavigationEvent> = new EventEmitter<NavigationEvent>();

  handleNavigate($event: NavigationEvent) {
    this.navigate.emit($event);
  }

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
