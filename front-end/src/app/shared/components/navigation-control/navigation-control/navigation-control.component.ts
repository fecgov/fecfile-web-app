import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Transaction } from 'app/shared/models/transaction.model';
import { NavigationControl, NavigationEvent } from 'app/shared/models/transaction-navigation-controls.model';

@Component({
  selector: 'app-navigation-control',
  templateUrl: './navigation-control.component.html',
})
export class NavigationControlComponent {
  @Input() navigationControl?: NavigationControl;
  @Input() transaction?: Transaction;
  @Output() navigate: EventEmitter<NavigationEvent> = new EventEmitter<NavigationEvent>();

  isVisible = true;

  isDisabled(): boolean {
    return !!this.navigationControl?.disabledCondition(this.transaction);
  }

  click(): void {
    const navigationEvent = new NavigationEvent(
      this.navigationControl?.navigationAction,
      this.navigationControl?.navigationDestination,
      this.transaction
    );
    this.navigate.emit(navigationEvent);
  }
}
