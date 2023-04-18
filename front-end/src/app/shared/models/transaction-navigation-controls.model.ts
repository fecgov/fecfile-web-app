import { hasNoContact, isNewTransaction, Transaction } from './transaction.model';
import { TransactionTypes } from 'app/shared/models/transaction.model';

export enum NavigationAction {
  CANCEL,
  SAVE,
}

export enum NavigationDestination {
  LIST,
  PARENT,
  ANOTHER,
  ANOTHER_CHILD,
  CHILD,
}

export class NavigationEvent {
  action: NavigationAction;
  destination: NavigationDestination;
  transaction?: Transaction;
  destinationTransactionType?: TransactionTypes;

  constructor(
    action?: NavigationAction,
    destination?: NavigationDestination,
    transaction?: Transaction,
    destinationTransactionType?: TransactionTypes
  ) {
    this.action = action || NavigationAction.CANCEL;
    this.destination = destination || NavigationDestination.LIST;
    this.transaction = transaction;
    this.destinationTransactionType = destinationTransactionType;
  }
}

export class NavigationControl {
  navigationAction: NavigationAction = NavigationAction.CANCEL;
  navigationDestination: NavigationDestination = NavigationDestination.LIST;
  label = 'Cancel';
  icon?: string;
  ngClass?: string;
  visibleCondition: (transaction?: Transaction) => boolean = () => true;
  disabledCondition: (transaction?: Transaction) => boolean = () => false;

  constructor(
    navigationAction: NavigationAction,
    navigationDestination: NavigationDestination,
    label: string,
    ngClass?: string,
    disabledCondition?: (transaction?: Transaction) => boolean,
    visibleCondition?: (transaction?: Transaction) => boolean,
    icon?: string
  ) {
    this.navigationAction = navigationAction;
    this.navigationDestination = navigationDestination;
    this.label = label;
    this.ngClass = ngClass;
    this.visibleCondition = visibleCondition || (() => true);
    this.disabledCondition = disabledCondition || (() => false);
    this.icon = icon;
  }
}

export const CANCEL_CONTROL = new NavigationControl(
  NavigationAction.CANCEL,
  NavigationDestination.LIST,
  'Cancel',
  'p-button-secondary'
);

export const SAVE_LIST_CONTROL = new NavigationControl(
  NavigationAction.SAVE,
  NavigationDestination.LIST,
  'Save',
  'p-button-primary',
  hasNoContact
);

export const SAVE_ANOTHER_CONTROL = new NavigationControl(
  NavigationAction.SAVE,
  NavigationDestination.ANOTHER,
  'Save & add another',
  'p-button-info',
  hasNoContact,
  isNewTransaction
);

export const SAVE_CHILD_CONTROL = new NavigationControl(
  NavigationAction.SAVE,
  NavigationDestination.CHILD,
  'Save & add memo',
  'p-button-warning',
  hasNoContact,
  () => true,
  'pi pi-plus'
);

export class TransactionNavigationControls {
  inlineControls?: NavigationControl[];
  cancelControls?: NavigationControl[];
  continueControls?: NavigationControl[];

  constructor(
    inlineControls?: NavigationControl[],
    cancelControls?: NavigationControl[],
    continueControls?: NavigationControl[]
  ) {
    this.inlineControls = inlineControls;
    this.cancelControls = cancelControls;
    this.continueControls = continueControls;
  }

  getNavigationControls(section: 'inline' | 'cancel' | 'continue', transaction?: Transaction): NavigationControl[] {
    let controls: NavigationControl[] = [];
    if (section === 'inline') {
      controls = this.inlineControls || [];
    } else if (section === 'cancel') {
      controls = this.cancelControls || [];
    } else if (section === 'continue') {
      controls = this.continueControls || [];
    }
    return controls.filter((control: NavigationControl) => {
      return !control.visibleCondition || control.visibleCondition(transaction);
    });
  }
}

/**
 * Standard set of form buttons used across non-child transaction types.
 */
export const STANDARD_CONTROLS = new TransactionNavigationControls([], [CANCEL_CONTROL], [SAVE_LIST_CONTROL]);

/**
 * Standard set of form buttons used across tier 1 transactions with subtransactions.
 */
export const STANDARD_PARENT_CONTROLS = new TransactionNavigationControls(
  [SAVE_CHILD_CONTROL],
  [CANCEL_CONTROL],
  [SAVE_LIST_CONTROL]
);

/**
 * Standard set of form buttons used across all child JF Transfer Memo transaction type screens.
 */
export function getChildNavigationControls(): TransactionNavigationControls {
  return new TransactionNavigationControls(
    [
      new NavigationControl(
        NavigationAction.SAVE,
        NavigationDestination.ANOTHER_CHILD,
        'Save & add memo',
        '',
        hasNoContact,
        () => true,
        'pi pi-plus'
      ),
    ],
    [CANCEL_CONTROL],
    [SAVE_LIST_CONTROL]
  );
}
