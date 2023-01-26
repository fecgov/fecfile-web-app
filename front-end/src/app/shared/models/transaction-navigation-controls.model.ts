import { hasNoContact, isNewTransaction, Transaction } from './transaction.model';

export enum NavigationAction {
  CANCEL,
  SAVE,
}

export enum NavigationDestination {
  LIST,
  PARENT,
  ANOTHER,
  CHILD,
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
  'Save & view all transactions',
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
}

/**
 * Standard set of form buttons used across non-child transaction types.
 */
export const STANDARD_CONTROLS = new TransactionNavigationControls(
  [],
  [CANCEL_CONTROL],
  [SAVE_LIST_CONTROL, SAVE_ANOTHER_CONTROL]
);

/**
 * Standard set of form buttons used for double-transaction-entry screens.
 */
export const STANDARD_CONTROLS_MINIMAL = new TransactionNavigationControls([], [CANCEL_CONTROL], [SAVE_LIST_CONTROL]);

/**
 * Standard set of form buttons used across all child JF Transfer Memo transaction type screens.
 */
export const JF_TRANSFER_MEMO_CONTROLS = new TransactionNavigationControls(
  [
    new NavigationControl(
      NavigationAction.SAVE,
      NavigationDestination.ANOTHER,
      'Save & add another Memo',
      'p-button-warning',
      hasNoContact,
      isNewTransaction,
      'pi pi-plus'
    ),
  ],
  [
    new NavigationControl(
      NavigationAction.CANCEL,
      NavigationDestination.PARENT,
      'Back to Joint Fundraising Transfer',
      'p-button-secondary'
    ),
  ],
  [SAVE_LIST_CONTROL]
);
