import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import {
  GO_BACK_CONTROL,
  NavigationControl,
  NavigationEvent,
  TransactionNavigationControls,
} from 'app/shared/models/transaction-navigation-controls.model';
import { Transaction } from 'app/shared/models/transaction.model';

@Component({
  selector: 'app-transaction-navigation',
  templateUrl: './transaction-navigation.component.html',
})
export class TransactionNavigationComponent implements OnChanges {
  @Input() isEditable = true;
  @Input() transaction?: Transaction;
  @Output() navigate: EventEmitter<NavigationEvent> = new EventEmitter<NavigationEvent>();

  navigationControls = new TransactionNavigationControls([], [], []);
  inlineControls: NavigationControl[] = [];

  ngOnChanges(): void {
    this.navigationControls = this.getNavigationControls();
    this.inlineControls = this.getInlineControls();
  }

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
