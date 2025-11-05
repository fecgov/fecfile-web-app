export class TableAction {
  label: string;
  action: (item?: any) => void | Promise<void> | Promise<boolean>;

  constructor(
    label: string,
    action: (item?: any) => void | Promise<void> | Promise<boolean>,
    isAvailable?: (item?: any) => boolean,
    isEnabled?: (item?: any) => boolean,
  ) {
    this.label = label;
    this.action = action;
    this.isAvailable = isAvailable || this.isAvailable;
    this.isEnabled = isEnabled || this.isEnabled;
  }

  isAvailable: (item?: any) => boolean = () => true;

  isEnabled: (item?: any) => boolean = () => true;
}
