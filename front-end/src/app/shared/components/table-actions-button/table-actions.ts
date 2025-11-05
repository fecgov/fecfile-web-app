export class TableAction<T> {
  label: string;
  action: (item: T) => void | Promise<void> | Promise<boolean>;

  constructor(
    label: string,
    action: (item: T) => void | Promise<void> | Promise<boolean>,
    isAvailable?: (item: T) => boolean,
    isEnabled?: (item: T) => boolean,
  ) {
    this.label = label;
    this.action = action;
    this.isAvailable = isAvailable || this.isAvailable;
    this.isEnabled = isEnabled || this.isEnabled;
  }

  isAvailable: (item: T) => boolean = () => true;

  isEnabled: (item: T) => boolean = () => true;
}
