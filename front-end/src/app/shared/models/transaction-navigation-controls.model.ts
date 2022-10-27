import { hasContact as hasNoContact, isNewTransaction } from '../interfaces/transaction-type.interface';
import { Transaction } from '../interfaces/transaction.interface';
import { BaseModel } from './base.model';

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

export class NavigationControl extends BaseModel {
  navigationAction: NavigationAction = NavigationAction.CANCEL;
  navigationDestination: NavigationDestination = NavigationDestination.LIST;
  label = 'Cancel';
  icon?: string;
  ngClass?: string;
  visibleCondition: (transaction?: Transaction) => boolean = () => true;
  disabledCondition: (transaction?: Transaction) => boolean = () => true;

  constructor(
    navigationAction: NavigationAction,
    navigationDestination: NavigationDestination,
    label: string,
    ngClass?: string,
    disabledCondition?: (transaction?: Transaction) => boolean,
    visibleCondition?: (transaction?: Transaction) => boolean,
    icon?: string
  ) {
    super();
    this.navigationAction = navigationAction;
    this.navigationDestination = navigationDestination;
    this.label = label;
    this.ngClass = ngClass;
    this.visibleCondition = visibleCondition || (() => true);
    this.disabledCondition = disabledCondition || (() => true);
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

export class TransactionNavigationControls extends BaseModel {
  inlineControls?: NavigationControl[];
  cancelControls?: NavigationControl[];
  continueControls?: NavigationControl[];

  constructor(
    inlineControls?: NavigationControl[],
    cancelControls?: NavigationControl[],
    continueControls?: NavigationControl[]
  ) {
    super();
    this.inlineControls = inlineControls;
    this.cancelControls = cancelControls;
    this.continueControls = continueControls;
  }
}
