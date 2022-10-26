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
  label: string = 'Cancel';
  icon?: string;
  ngClass?: string;
  condition?(transaction?: Transaction): boolean;

  constructor(
    navigationAction: NavigationAction,
    navigationDestination: NavigationDestination,
    label: string,
    ngClass?: string,
    condition?: (transaction?: Transaction) => boolean,
    icon?: string
  ) {
    super();
    this.navigationAction = navigationAction;
    this.navigationDestination = navigationDestination;
    this.label = label;
    this.ngClass = ngClass;
    this.condition = condition;
    this.icon = icon;
  }
}

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
