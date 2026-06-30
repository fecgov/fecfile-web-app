import { Component, input, model, viewChild } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { PrimeOptions } from 'app/shared/utils/label.utils';
import { effectOnceIf } from 'ngxtension/effect-once-if';
import { Select, SelectModule, SelectPassThrough } from 'primeng/select';

@Component({
  selector: 'app-searchable-select-input',
  imports: [SelectModule],
  templateUrl: './searchable-select-input.component.html',
  styleUrl: './searchable-select-input.component.scss',
})
export class SearchableSelectInputComponent implements FormValueControl<string> {
  readonly value = model.required<string>();
  readonly options = input.required<PrimeOptions>();
  readonly id = input.required<string>();
  readonly readonly = input(false);
  readonly disabled = input(false);
  readonly pt = input<SelectPassThrough>();
  readonly pSelectInstance = viewChild.required(Select);

  private lastCycleSearchChar: string = '';
  private currentCycleIndex: number = -1;
  private searchValue = '';

  constructor() {
    effectOnceIf(
      () => this.pSelectInstance(),
      (select) => {
        select.searchOptions = (event: KeyboardEvent, char: string) => this.customSearch(event, char);
      },
    );
  }

  private customSearch(event: KeyboardEvent, char: string): boolean {
    char = char.toLowerCase();
    const isCycleTrigger = this.searchValue === '' || char === this.searchValue.slice(-1);
    const pSelectInstace = this.pSelectInstance();
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
    const pSelectInstace = this.pSelectInstance();

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
    const pSelectInstance = this.pSelectInstance();
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
    return (
      pSelectInstance.isValidOption(option) &&
      pSelectInstance.getOptionLabel(option).toString().toLowerCase().startsWith(this.searchValue.toLowerCase())
    );
  }
}
