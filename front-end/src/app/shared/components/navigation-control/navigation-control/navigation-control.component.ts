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
import {
  ScheduleATransactionTypeLabels,
  UnimplementedTypeEntityCategories,
} from 'app/shared/models/scha-transaction.model';
import { ScheduleBTransactionTypeLabels } from 'app/shared/models/schb-transaction.model';
import { getTransactionTypeClass, TransactionTypeUtils } from 'app/shared/utils/transaction-type.utils';
import { FormControl } from '@angular/forms';

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
  dropdownControl = new FormControl('');

  ngOnInit(): void {
    if (NavigationDestination.CHILD == this.navigationControl?.navigationDestination) {
      this.controlType = 'dropdown';
      this.dropdownOptions = this.getOptions(this.transaction?.transactionType);
    } else if (NavigationDestination.ANOTHER_CHILD == this.navigationControl?.navigationDestination) {
      this.controlType = 'dropdown';
      this.dropdownOptions = this.getOptions(this.transaction?.parent_transaction?.transactionType);
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
    this.dropdownControl.reset(); // If the save fails, this clears the dropdown
  }

  getOptions(transactionType?: TransactionType): any {
    const config = transactionType?.subTransactionConfig;
    if (config) {
      return [
        {
          label: config.groupName,
          items: config.subTransactionTypes.map((typeId) => {
            if (!getTransactionTypeClass(typeId)) {
              return {
                label: LabelUtils.get(UnimplementedTypeEntityCategories, typeId),
              };
            }
            const type = TransactionTypeUtils.factory(typeId);
            return {
              label:
                type.entityCategoryName ||
                LabelUtils.get(ScheduleATransactionTypeLabels, typeId) ||
                LabelUtils.get(ScheduleBTransactionTypeLabels, typeId),
              value: new NavigationEvent(
                NavigationAction.SAVE,
                this.navigationControl?.navigationDestination,
                this.transaction,
                typeId
              ),
            };
          }),
        },
      ];
    }
    return;
  }
}
