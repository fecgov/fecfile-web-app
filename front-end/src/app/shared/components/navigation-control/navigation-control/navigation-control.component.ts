import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Transaction } from 'app/shared/models/transaction.model';
import { NavigationControl } from 'app/shared/models/transaction-navigation-controls.model';

@Component({
  selector: 'app-navigation-control',
  templateUrl: './navigation-control.component.html',
})
export class NavigationControlComponent {
  @Input() navigationControl?: NavigationControl;
  @Input() transaction?: Transaction;
  @Output() navigate: EventEmitter<NavigationControl> = new EventEmitter<NavigationControl>();

  isVisible = true;

  isDisabled(): boolean {
    return !!this.navigationControl?.disabledCondition(this.transaction);
  }

  click(): void {
    this.navigate.emit(this.navigationControl);
  }
}
