import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Transaction, TransactionTypes } from 'app/shared/models/transaction.model';
import {
  NavigationAction,
  NavigationControl,
  NavigationDestination,
  NavigationEvent,
} from 'app/shared/models/transaction-navigation-controls.model';
import { SubTransactionGroup, TransactionType } from 'app/shared/models/transaction-type.model';
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
  styleUrls: ['./navigation-control.component.scss'],
})
export class NavigationControlComponent implements OnInit {
  @Input() navigationControl?: NavigationControl;
  @Input() transaction?: Transaction;
  @Output() navigate: EventEmitter<NavigationEvent> = new EventEmitter<NavigationEvent>();
  public controlType: 'button' | 'dropdown' = 'button';
  public dropdownOptions?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  public isGroupedDropdown = false;
  dropdownControl = new FormControl('');

  ngOnInit(): void {
    if (
      NavigationDestination.CHILD == this.navigationControl?.navigationDestination ||
      NavigationDestination.ANOTHER_CHILD == this.navigationControl?.navigationDestination
    ) {
      this.controlType = 'dropdown';
      this.dropdownOptions = this.getOptions(
        this.transaction?.transactionType,
        this.transaction?.parent_transaction?.transactionType
      );
    } else {
      this.controlType = 'button';
    }
    this.isGroupedDropdown = !this.dropdownOptions?.find((option: Record<string, unknown>) =>
      Object.prototype.hasOwnProperty.call(option, 'value')
    );
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getOptionFromConfig = (config: SubTransactionGroup | TransactionTypes, isParentConfig = false): any => {
    if ((config as SubTransactionGroup).subTransactionTypes) {
      const group = config as SubTransactionGroup;
      return {
        label: group.groupName,
        items: group.subTransactionTypes.map((type) => this.getOptionFromConfig(type, isParentConfig)),
      };
    }
    const typeId = config as TransactionTypes;
    if (!getTransactionTypeClass(typeId)) {
      return { label: LabelUtils.get(UnimplementedTypeEntityCategories, typeId) };
    }
    const type = TransactionTypeUtils.factory(typeId);
    return {
      label:
        type.shortName ||
        LabelUtils.get(ScheduleATransactionTypeLabels, typeId) ||
        LabelUtils.get(ScheduleBTransactionTypeLabels, typeId),
      value: new NavigationEvent(
        NavigationAction.SAVE,
        isParentConfig ? NavigationDestination.ANOTHER_CHILD : NavigationDestination.CHILD,
        this.transaction,
        typeId
      ),
    };
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getOptions(transactionType?: TransactionType, parentTransactionType?: TransactionType): any {
    const config = transactionType?.subTransactionConfig;
    const parentConfig = parentTransactionType?.subTransactionConfig;
    const options = [];
    if (Array.isArray(parentConfig)) {
      options.push(...parentConfig.map((type) => this.getOptionFromConfig(type, true)));
    } else if (parentConfig) {
      options.push(this.getOptionFromConfig(parentConfig, true));
    }
    if (Array.isArray(config)) {
      options.push(...config.map((type) => this.getOptionFromConfig(type)));
    } else if (config) {
      options.push(this.getOptionFromConfig(config));
    }
    return options;
  }
}
