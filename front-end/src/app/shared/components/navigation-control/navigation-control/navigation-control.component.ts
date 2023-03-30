import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Transaction } from 'app/shared/models/transaction.model';
import {
  NavigationAction,
  NavigationControl,
  NavigationDestination,
  NavigationEvent,
} from 'app/shared/models/transaction-navigation-controls.model';
import { TransactionType } from 'app/shared/models/transaction-type.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { ScheduleATransactionTypeLabels } from 'app/shared/models/scha-transaction.model';
import { ScheduleBTransactionTypeLabels } from 'app/shared/models/schb-transaction.model';

@Component({
  selector: 'app-navigation-control',
  templateUrl: './navigation-control.component.html',
})
export class NavigationControlComponent implements OnInit {
  @Input() navigationControl?: NavigationControl;
  @Input() transaction?: Transaction;
  @Output() navigate: EventEmitter<NavigationEvent> = new EventEmitter<NavigationEvent>();
  public controlType: 'button' | 'dropdown' = 'button';
  public dropdownOptions?: any;

  ngOnInit(): void {
    if (NavigationDestination.CHILD == this.navigationControl?.navigationDestination) {
      this.controlType = 'dropdown';
      this.dropdownOptions = this.getOptions(this.transaction?.transactionType);
    } else {
      this.controlType = 'button';
    }
  }
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

  onDropdownChange(event: { value: NavigationEvent }): void {
    if (event.value.action) {
      this.navigate.emit(event.value);
    }
  }

  getOptions(transactionType?: TransactionType): any {
    const config = transactionType?.subTransactionConfig;
    if (config) {
      return [
        {
          label: config.groupName,
          items: config.subTransactionTypes.map((type) => {
            return {
              label:
                LabelUtils.get(ScheduleATransactionTypeLabels, type) ||
                LabelUtils.get(ScheduleBTransactionTypeLabels, type),
              value: new NavigationEvent(NavigationAction.SAVE, NavigationDestination.CHILD, this.transaction, type),
            };
          }),
        },
      ];
    }
    return;
  }
}
