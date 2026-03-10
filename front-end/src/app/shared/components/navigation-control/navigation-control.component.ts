/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, computed, inject, input } from '@angular/core';
import { cloneInstance, Transaction, TransactionTypes } from 'app/shared/models/transaction.model';
import {
  cloneNavigationEvent,
  ControlType,
  NavigationAction,
  NavigationControl,
  NavigationDestination,
  NavigationEvent,
} from 'app/shared/models/transaction-navigation-controls.model';
import { SubTransactionGroup } from 'app/shared/models/transaction-type.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import {
  ScheduleATransactionTypeLabels,
  UnimplementedTypeEntityCategories,
} from 'app/shared/models/scha-transaction.model';
import { ScheduleBTransactionTypeLabels } from 'app/shared/models/schb-transaction.model';
import { getTransactionTypeClass, TransactionTypeUtils } from 'app/shared/utils/transaction-type.utils';
import { ScheduleC2TransactionTypeLabels } from 'app/shared/models/schc2-transaction.model';
import { ScheduleETransactionTypeLabels } from 'app/shared/models/sche-transaction.model';
import { Store } from '@ngrx/store';
import { navigationEventSetAction } from 'app/store/navigation-event.actions';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { SingleClickDirective } from '../../directives/single-click.directive';
import { FormsModule } from '@angular/forms';
import { PopoverModule } from 'primeng/popover';

@Component({
  selector: 'app-navigation-control',
  templateUrl: './navigation-control.component.html',
  styleUrls: ['./navigation-control.component.scss'],
  imports: [ButtonModule, Ripple, SingleClickDirective, PopoverModule, FormsModule, SplitButtonModule],
})
export class NavigationControlComponent {
  private readonly store = inject(Store);
  readonly navigationControl = input.required<NavigationControl>();
  readonly transaction = input<Transaction | undefined>(undefined);

  readonly dropdownOptions = derivedAsync(
    () => {
      const transaction = this.transaction();
      const navigationControl = this.navigationControl();
      if (!transaction || !navigationControl) return [];
      if (navigationControl.controlType == ControlType.DROPDOWN) return this.getOptions(transaction);
      return [];
    },
    { initialValue: [] },
  );

  readonly items: MenuItem[] = [
    {
      label: 'Save and...',
      disabled: true,
    },
    { separator: true },
    {
      label: 'Add another',
      command: () => {
        this.saveAndAddAnother();
      },
    },
  ];

  // This could be a signal but the transaction data is getting updated out of sync
  readonly isDisabled = () => !!this.navigationControl()?.disabledCondition(this.transaction());
  readonly controlType = ControlType;
  readonly type = computed(() => this.navigationControl().controlType);

  saveAndAddAnother() {
    const navControl = this.navigationControl();
    const transaction = this.transaction();
    if (!transaction) return;
    const navigationEvent = new NavigationEvent(
      navControl.navigationAction,
      NavigationDestination.ANOTHER,
      cloneInstance(transaction),
      transaction.transaction_type_identifier as TransactionTypes,
    );
    this.store.dispatch(navigationEventSetAction(navigationEvent));
  }

  buttonDataCy(): string {
    return buildDataCy('transactions-navigation', this.navigationControl?.label || 'control', 'button');
  }

  clickButton(): void {
    /** click handler for button version of control
     * determine destination transaction type based on navigation destination
     * if the navigation destination is CHILD, then the destination transaction
     *    type is the first subTransactionType
     * if the navigation destination is ANOTHER, then the destination transaction type is the
     *    same as the current transaction
     */
    let destinationTransactionType: TransactionTypes | undefined;
    const navControl = this.navigationControl();
    const transaction = this.transaction();
    if (!transaction) return;
    // Handle CHILD case by determining child TransactionType
    if (
      navControl.navigationDestination === NavigationDestination.CHILD &&
      transaction.transactionType.subTransactionConfig
    ) {
      destinationTransactionType = (transaction.transactionType.subTransactionConfig as TransactionTypes[])[0];
    }

    // Handle ANOTHER case by determining child TransactionType
    if (navControl.navigationDestination === NavigationDestination.ANOTHER && transaction.transaction_type_identifier) {
      destinationTransactionType = transaction.transaction_type_identifier as TransactionTypes;
    }

    const navigationEvent = new NavigationEvent(
      navControl.navigationAction,
      navControl.navigationDestination,
      cloneInstance(transaction),
      destinationTransactionType,
    );
    this.store.dispatch(navigationEventSetAction(navigationEvent));
  }

  onDropdownChange(event: { value: NavigationEvent }): void {
    // Handle click event for dropdown version of control
    if (event.value.action) {
      const navigationEvent = cloneNavigationEvent(event.value);
      this.store.dispatch(navigationEventSetAction(navigationEvent));
    }
  }

  getOptionFromConfig = (
    config: SubTransactionGroup | TransactionTypes,
    transaction: Transaction,
    isParentConfig = false,
  ): any => {
    /** Interpret config to return either a group of navigation options or a single navigation option
     * If the config is a group, return a group of options, recursively calling getOptionFromConfig
     * If the config is a single transaction type, return a single navigation option
     * If the transaction type is not implemented, return just a label for the transaction type (unclickable)
     */
    // Return a group of options
    if ((config as SubTransactionGroup).subTransactionTypes) {
      const group = config as SubTransactionGroup;
      return {
        label: group.groupName,
        items: group.subTransactionTypes.map((type) => this.getOptionFromConfig(type, transaction, isParentConfig)),
      };
    }
    const typeId = config as TransactionTypes;

    // Return an unclicable label if the transaction type is not implemented
    if (!getTransactionTypeClass(typeId)) {
      return { label: LabelUtils.get(UnimplementedTypeEntityCategories, typeId) };
    }
    const type = TransactionTypeUtils.factory(typeId);

    // return a single navigation option
    return {
      label:
        type.shortName ||
        LabelUtils.get(ScheduleATransactionTypeLabels, typeId) ||
        LabelUtils.get(ScheduleBTransactionTypeLabels, typeId) ||
        LabelUtils.get(ScheduleC2TransactionTypeLabels, typeId) ||
        LabelUtils.get(ScheduleETransactionTypeLabels, typeId),
      value: new NavigationEvent(
        NavigationAction.SAVE,
        // If this control came from the parent, the desination is ANOTHER
        isParentConfig ? NavigationDestination.ANOTHER : NavigationDestination.CHILD,
        transaction,
        typeId,
      ),
    };
  };

  getOptions(transaction: Transaction): any {
    /** Get options for dropdown based on transactionType and parentTransactionType
     * If parentTransactionType is provided, include options from parentTransactionType
     *    options from parent transaction will have the destionaion of ANOTHER
     * Options from the current transaction type will have the destination of CHILD
     *
     * Sub transaction config can be an array or a single config.
     *    A single config can contain a group of transaction types or just be a single
     *    transaction type
     */
    const config = transaction.transactionType.subTransactionConfig;
    const parentConfig = transaction.parent_transaction?.transactionType.subTransactionConfig;
    const options = [];
    // either flatten an array or add a single config
    if (Array.isArray(parentConfig)) {
      options.push(...parentConfig.map((type) => this.getOptionFromConfig(type, transaction, true)));
    } else if (parentConfig) {
      options.push(this.getOptionFromConfig(parentConfig, transaction, true));
    }
    // either flatten an array or add a single config
    if (Array.isArray(config)) {
      options.push(...config.map((type) => this.getOptionFromConfig(type, transaction)));
    } else if (config) {
      options.push(this.getOptionFromConfig(config, transaction));
    }
    return options;
  }
}
