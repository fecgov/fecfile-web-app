import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Transaction } from 'app/shared/models/transaction.model';
import {
  NavigationControl,
  NavigationEvent,
  TransactionNavigationControls,
} from 'app/shared/models/transaction-navigation-controls.model';

@Component({
  selector: 'app-navigation-control-bar',
  templateUrl: './navigation-control-bar.component.html',
  styleUrls: ['./navigation-control-bar.component.scss'],
})
export class NavigationControlBarComponent {
  @Input() navigationControls: TransactionNavigationControls = new TransactionNavigationControls();
  @Input() transaction?: Transaction;
  @Output() navigate: EventEmitter<NavigationEvent> = new EventEmitter<NavigationEvent>();

  getNavigationControls(section: 'inline' | 'cancel' | 'continue'): NavigationControl[] {
    let controls: NavigationControl[] = [];
    if (section === 'inline') {
      controls = this.navigationControls.inlineControls || [];
    } else if (section === 'cancel') {
      controls = this.navigationControls.cancelControls || [];
    } else if (section === 'continue') {
      controls = this.navigationControls.continueControls || [];
    }
    return controls.filter((control: NavigationControl) => {
      return !control.visibleCondition || control.visibleCondition(this.transaction);
    });
  }

  handleNavigate(navigationEvent: NavigationEvent): void {
    this.navigate.emit(navigationEvent);
  }
}
