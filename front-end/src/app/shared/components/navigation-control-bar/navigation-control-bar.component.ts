import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import {
  NavigationControl,
  NavigationEvent,
  TransactionNavigationControls,
} from 'app/shared/models/transaction-navigation-controls.model';
import { Transaction } from 'app/shared/models/transaction.model';

@Component({
  selector: 'app-navigation-control-bar',
  templateUrl: './navigation-control-bar.component.html',
  styleUrls: ['./navigation-control-bar.component.scss'],
})
export class NavigationControlBarComponent implements OnChanges {
  @Input() navigationControls: TransactionNavigationControls = new TransactionNavigationControls();
  @Input() transaction?: Transaction;
  @Output() navigate: EventEmitter<NavigationEvent> = new EventEmitter<NavigationEvent>();

  cancelNavigationControls: NavigationControl[] = [];
  continueNavigationControls: NavigationControl[] = [];

  ngOnChanges(): void {
    this.cancelNavigationControls = this.getNavigationControls('cancel');
    this.continueNavigationControls = this.getNavigationControls('continue');
  }

  getNavigationControls(section: 'inline' | 'cancel' | 'continue'): NavigationControl[] {
    return this.navigationControls.getNavigationControls(section, this.transaction);
  }

  handleNavigate(navigationEvent: NavigationEvent): void {
    this.navigate.emit(navigationEvent);
  }
}
