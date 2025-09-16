/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, input, viewChild, output, computed, forwardRef } from '@angular/core';
import { Select, SelectModule, SelectStyle } from 'primeng/select';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { effectOnceIf } from 'ngxtension/effect-once-if';
import { PrimeOptions } from 'app/shared/utils/label.utils';

@Component({
  selector: 'app-searchable-select',
  templateUrl: './searchable-select.component.html',
  imports: [SelectModule, ReactiveFormsModule],
  providers: [
    SelectStyle,
    Select,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Select),
      multi: true,
    },
  ],
})
export class SearchableSelectComponent {
  readonly pSelectInstance = viewChild(Select);

  readonly options = input.required<PrimeOptions>();
  readonly inputId = input.required<string>();
  readonly formControlName = input.required<string>();
  readonly form = input.required<FormGroup>();
  readonly autoDisplayFirst = input(true);
  readonly readonly = input(false);
  readonly styleClass = input('');

  readonly changeOut = output<any>();
  readonly focusOut = output<any>();
  readonly blurOut = output<any>();
  readonly showOut = output<any>();
  readonly hideOut = output<any>();

  private lastCycleSearchChar: string = '';
  private currentCycleIndex: number = -1;

  readonly control = computed(() => this.form().get(this.formControlName()) as FormControl);

  constructor() {
    effectOnceIf(
      () => this.pSelectInstance(),
      () => {
        const select = this.pSelectInstance();
        select!.searchOptions = (event: KeyboardEvent, char: string) => this.customSearch(event, char);
      },
    );
  }

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
    }, 500);
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
