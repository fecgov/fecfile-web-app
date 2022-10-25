import { Transaction } from '../interfaces/transaction.interface';
import { BaseModel } from './base.model';

export enum NavigationTypes {
  CANCEL_LIST,
  SAVE_LIST,
  SAVE_ADD_ANOTHER,
  SAVE_ADD_CHILD,
}

export class NavigationControl extends BaseModel {
  navigationType: NavigationTypes = NavigationTypes.CANCEL_LIST;
  label: string = 'Cancel';
  icon?: string;
  ngClass?: string;
  condition?(transaction?: Transaction): boolean;

  constructor(
    navigationType: NavigationTypes,
    label: string,
    ngClass?: string,
    condition?: (transaction?: Transaction) => boolean,
    icon?: string
  ) {
    super();
    this.navigationType = navigationType;
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
