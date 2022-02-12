export class FieldEntryModel {
  value!: string;
  selected!: boolean;
  disabled!: boolean;
  originallyEmpty!: boolean;

  public constructor() {
    this.value = '';
    this.selected = false;
    this.disabled = false;
    this.originallyEmpty = false;
  }
}
