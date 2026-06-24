/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, input, viewChild, inject } from '@angular/core';
import { Select, SelectModule, SelectPassThrough, SelectStyle } from 'primeng/select';
import { ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';
import { effectOnceIf } from 'ngxtension/effect-once-if';
import { PrimeOptions } from 'app/shared/utils/label.utils';

@Component({
  selector: 'app-searchable-select',
  templateUrl: './searchable-select.component.html',
  imports: [SelectModule, FormsModule],
  providers: [SelectStyle, Select],
})
export class SearchableSelectComponent implements ControlValueAccessor {
  readonly ngControl = inject(NgControl, { self: true, optional: true });
  readonly pSelectInstance = viewChild(Select);

  readonly options = input.required<PrimeOptions>();
  readonly inputId = input.required<string>();
  readonly autoDisplayFirst = input(true);
  readonly readonly = input(false);
  readonly styleClass = input('');
  readonly pt = input<SelectPassThrough>();
  readonly appendTo = input('self');

  protected value: string | null = null;
  protected disabled = false;

  protected onChange: (value: any) => void = () => {};
  protected onTouched: () => void = () => {};

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
    effectOnceIf(
      () => this.pSelectInstance(),
      (select) => {
        select!.searchOptions = (event: KeyboardEvent, char: string) => this.customSearch(event, char);
      },
    );
  }

  /* CVA FUNCTIONALITY */
  writeValue(value: string | null): void {
    this.value = value;
  }
  registerOnChange = (fn: () => void) => (this.onChange = fn);
  registerOnTouched = (fn: () => void) => (this.onTouched = fn);
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  protected change(newValue: string | null): void {
    this.onChange(newValue);
    this.onTouched();
  }

  protected blur(): void {
    this.onTouched();
  }

  /* SEARCH FUNCTIONALITY */
  private lastCycleSearchChar: string = '';
  private currentCycleIndex: number = -1;
  private searchValue = '';
  private customSearch(event: KeyboardEvent, char: string): boolean {
    char = char.toLowerCase();
    const isCycleTrigger = this.searchValue === '' || char === this.searchValue.slice(-1);
    const pSelectInstace = this.pSelectInstance()!;
    if (pSelectInstace.searchTimeout) {
      clearTimeout(pSelectInstace.searchTimeout);
    }

    pSelectInstace.searchTimeout = setTimeout(() => {
      this.searchValue = '';
      pSelectInstace.searchTimeout = null;
    }, 1250);
    if (isCycleTrigger) {
      this.handleCycleSearch(event, char);
      return true;
    } else {
      this.currentCycleIndex = -1;
      this.lastCycleSearchChar = '';
      return this.handleNormalSearch(event, char);
    }
  }

  private handleNormalSearch(event: KeyboardEvent, char: string): boolean {
    this.searchValue = (this.searchValue || '') + char;

    let optionIndex = -1;
    let matched = false;
    const pSelectInstace = this.pSelectInstance()!;

    optionIndex = pSelectInstace.visibleOptions().findIndex((option: PrimeOptions) => this.isOptionMatched(option));

    if (optionIndex !== -1) {
      matched = true;
    }

    if (optionIndex === -1 && pSelectInstace.focusedOptionIndex() === -1) {
      optionIndex = pSelectInstace.findFirstFocusedOptionIndex();
    }

    if (optionIndex !== -1) {
      setTimeout(() => {
        pSelectInstace.changeFocusedOptionIndex(event, optionIndex);
      });
    }

    return matched;
  }

  private handleCycleSearch(event: KeyboardEvent, char: string): void {
    this.searchValue = char;
    if (this.lastCycleSearchChar !== char) {
      this.currentCycleIndex = -1;
      this.lastCycleSearchChar = char;
    }
    const pSelectInstance = this.pSelectInstance()!;
    const options = pSelectInstance.visibleOptions();
    const matchingOptions: { option: PrimeOptions; index: number }[] = options
      .map((opt: PrimeOptions, i: number) => ({ option: opt, index: i }))
      .filter((item: { option: PrimeOptions; inex: number }) =>
        (pSelectInstance.getOptionLabel(item.option) ?? '').toLowerCase().startsWith(char),
      );

    if (matchingOptions.length > 0) {
      this.currentCycleIndex = (this.currentCycleIndex + 1) % matchingOptions.length;
      const { index: nextIndex } = matchingOptions[this.currentCycleIndex];

      setTimeout(() => {
        pSelectInstance.changeFocusedOptionIndex(event, nextIndex);
      });
    }
  }

  private isOptionMatched(option: PrimeOptions) {
    const pSelectInstance = this.pSelectInstance();
    if (!pSelectInstance) return false;
    return (
      pSelectInstance.isValidOption(option) &&
      pSelectInstance.getOptionLabel(option).toString().toLowerCase().startsWith(this.searchValue.toLowerCase())
    );
  }
}
