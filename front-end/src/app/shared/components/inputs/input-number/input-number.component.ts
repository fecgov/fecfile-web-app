import { DOCUMENT } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Injector,
  Input,
  numberAttribute,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import { InputNumberInputEvent } from 'primeng/inputnumber';
import { Nullable } from 'primeng/ts-helpers';

export const INPUTNUMBER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputNumberComponent),
  multi: true,
};

type onModelChangeFunction = (text: textNumber) => void;
type onModelTouchedFunction = () => void;
type textNumber = string | number | null;

@Component({
  selector: 'app-input-number',
  templateUrl: './input-number.component.html',
  styleUrl: './input-number.component.scss',
  providers: [INPUTNUMBER_VALUE_ACCESSOR],
})
export class InputNumberComponent implements OnInit, ControlValueAccessor {
  locale = 'en-US';
  options: Intl.NumberFormatOptions = {
    localeMatcher: 'best fit',
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'symbol',
    useGrouping: true,
  };

  /**
   * Identifier of the focus input to match a label defined for the component.
   * @group Props
   */
  @Input() inputId?: string;
  /**
   * Style class of the component.
   * @group Props
   */
  @Input() styleClass: string = '';
  /**
   * Inline style of the component.
   * @group Props
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: { [klass: string]: any } | null;
  /**
   * Advisory information to display on input.
   * @group Props
   */
  @Input() placeholder?: string;
  /**
   * Size of the input field.
   * @group Props
   */
  @Input({ transform: numberAttribute }) size?: number;

  /**
   * Specifies tab order of the element.
   * @group Props
   */
  @Input({ transform: numberAttribute }) tabindex?: number;
  /**
   * Title text of the input text.
   * @group Props
   */
  @Input() title?: string;
  /**
   * Specifies one or more IDs in the DOM that labels the input field.
   * @group Props
   */
  @Input() ariaLabelledBy?: string;
  /**
   * Used to define a string that labels the input element.
   * @group Props
   */
  @Input() ariaLabel?: string;
  /**
   * Used to indicate that user input is required on an element before a form can be submitted.
   * @group Props
   */
  @Input({ transform: booleanAttribute }) ariaRequired?: boolean;
  /**
   * Name of the input field.
   * @group Props
   */
  @Input() name?: string;
  /**
   * Indicates that whether the input field is required.
   * @group Props
   */
  @Input({ transform: booleanAttribute }) required?: boolean;
  /**
   * Mininum boundary value.
   * @group Props
   */
  @Input({ transform: numberAttribute }) min?: number;
  /**
   * Maximum boundary value.
   * @group Props
   */
  @Input({ transform: numberAttribute }) max?: number;

  /**
   * When present, it specifies that an input field is read-only.
   * @group Props
   */
  @Input({ transform: booleanAttribute }) readonly = false;

  /**
   * Determines whether the input field is empty.
   * @group Props
   */
  @Input({ transform: booleanAttribute }) allowEmpty = true;
  /**
   * Inline style of the input field.
   * @group Props
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() inputStyle: any;
  /**
   * Style class of the input field.
   * @group Props
   */
  @Input() inputStyleClass = '';

  /**
   * When present, it specifies that the component should automatically get focus on load.
   * @group Props
   */
  @Input({ transform: booleanAttribute }) autofocus?: boolean;
  /**
   * When present, it specifies that the element should be disabled.
   * @group Props
   */
  @Input() get disabled(): boolean | undefined {
    return this._disabled;
  }
  set disabled(disabled: boolean | undefined) {
    if (disabled) this.focused = false;

    this._disabled = disabled;
  }
  /**
   * Callback to invoke on input.
   * @param {InputNumberInputEvent} event - Custom input event.
   * @group Emits
   */
  @Output() inputEvent: EventEmitter<InputNumberInputEvent> = new EventEmitter<InputNumberInputEvent>();
  /**
   * Callback to invoke when the component receives focus.
   * @param {Event} event - Browser event.
   * @group Emits
   */
  @Output() focusEvent: EventEmitter<Event> = new EventEmitter<Event>();
  /**
   * Callback to invoke when the component loses focus.
   * @param {Event} event - Browser event.
   * @group Emits
   */
  @Output() blurEvent: EventEmitter<Event> = new EventEmitter<Event>();
  /**
   * Callback to invoke on input key press.
   * @param {KeyboardEvent} event - Keyboard event.
   * @group Emits
   */
  @Output() keyDown: EventEmitter<KeyboardEvent> = new EventEmitter<KeyboardEvent>();

  @ViewChild('input') input!: ElementRef<HTMLInputElement>;

  value: Nullable<number>;

  onModelChange?: onModelChangeFunction;

  onModelTouched = () => {};

  focused: Nullable<boolean>;

  initialized: Nullable<boolean>;

  prefixChar = '$';

  isSpecialChar: Nullable<boolean>;

  lastValue: Nullable<string>;

  _numeral: RegExp;

  numberFormat = new Intl.NumberFormat(this.locale, this.options);

  _decimalChar = '.';
  _decimal = new RegExp(`[${this._decimalChar}]`, 'g');

  groupChar = ',';
  _group = new RegExp(`[${this.groupChar}]`, 'g');

  _minusSign: RegExp;

  _currency: RegExp;

  _prefix: RegExp;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _index: number | any;

  _disabled: boolean | undefined;

  private ngControl: NgControl | null = null;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    public el: ElementRef,
    public cd: ChangeDetectorRef,
    private readonly injector: Injector,
    public config: PrimeNGConfig,
  ) {
    const numerals = [...new Intl.NumberFormat(this.locale, { useGrouping: false }).format(9876543210)].reverse();
    const index = new Map(numerals.map((d, i) => [d, i]));
    this._numeral = new RegExp(`[${numerals.join('')}]`, 'g');
    this._minusSign = this.getMinusSignExpression();
    this._currency = this.getCurrencyExpression();
    this._prefix = this.getPrefixExpression();
    this._index = (d: string) => index.get(d);
  }

  ngOnInit() {
    this.ngControl = this.injector.get(NgControl, null, { optional: true });

    this.initialized = true;
  }

  escapeRegExp(text: string): string {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }

  getMinusSignExpression(): RegExp {
    const formatter = new Intl.NumberFormat(this.locale, { useGrouping: false });
    return new RegExp(`[${formatter.format(-1).trim().replace(this._numeral, '')}]`, 'g');
  }

  getCurrencyExpression(): RegExp {
    const formatter = new Intl.NumberFormat(this.locale, {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'symbol',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return new RegExp(
      `[${formatter.format(1).replace(/\s/g, '').replace(this._numeral, '').replace(this._group, '')}]`,
      'g',
    );
  }

  getPrefixExpression(): RegExp {
    return new RegExp(`${this.escapeRegExp(this.prefixChar || '')}`, 'g');
  }

  get isBlurUpdateOnMode() {
    return this.ngControl?.control?.updateOn === 'blur';
  }

  formatValue(value: Nullable<string | number>) {
    if (value != null) {
      if (value === '-') {
        // Minus sign
        return value;
      }

      const formatter = new Intl.NumberFormat(this.locale, this.options);
      const formattedValue = formatter.format(Number(value));

      return formattedValue;
    }

    return '';
  }

  parseValue(text: string): textNumber {
    const prefixRegex = new RegExp(this._prefix ?? '', '');
    const currencyRegex = new RegExp(this._currency ?? '', '');

    const filteredText = text
      .replace(prefixRegex, '')
      .trim()
      .replace(/\s/g, '')
      .replace(currencyRegex, '')
      .replace(this._group, '')
      .replace(this._minusSign, '-')
      .replace(this._decimal, '.')
      .replace(this._numeral, this._index);

    if (filteredText) {
      if (filteredText === '-')
        // Minus sign
        return filteredText;

      const parsedValue = +filteredText;
      return isNaN(parsedValue) ? null : parsedValue;
    }

    return null;
  }

  spin(event: Event, dir: number) {
    const step = dir;
    const currentValue = this.parseValue(this.input?.nativeElement.value) || 0;
    const newValue = this.validateValue((currentValue as number) + step);

    this.updateInput(newValue, null, 'spin', null);
    this.updateModel(newValue);

    this.handleOnInput(event, currentValue, newValue);
  }

  onUserInput(event: Event) {
    if (this.readonly) {
      return;
    }

    if (this.isSpecialChar) {
      (event.target as HTMLInputElement).value = this.lastValue as string;
    }
    this.isSpecialChar = false;
  }

  onInputKeyDown(event: KeyboardEvent) {
    if (this.readonly) {
      return;
    }

    this.lastValue = (event.target as HTMLInputElement).value;
    if (event.shiftKey || event.altKey) {
      this.isSpecialChar = true;
      return;
    }

    const selectionStart = (event.target as HTMLInputElement).selectionStart as number;
    const selectionEnd = (event.target as HTMLInputElement).selectionEnd as number;
    const inputValue = (event.target as HTMLInputElement).value as string;
    let newValueStr: string | null = null;

    switch (event.key) {
      case 'ArrowUp':
        this.spin(event, 1);
        event.preventDefault();
        break;

      case 'ArrowDown':
        this.spin(event, -1);
        event.preventDefault();
        break;

      case 'ArrowLeft':
        for (let index = selectionStart; index <= inputValue.length; index++) {
          const previousCharIndex = index === 0 ? 0 : index - 1;
          if (this.isNumeralChar(inputValue.charAt(previousCharIndex))) {
            this.input.nativeElement.setSelectionRange(index, index);
            break;
          }
        }
        break;

      case 'ArrowRight':
        for (let index = selectionEnd; index >= 0; index--) {
          if (this.isNumeralChar(inputValue.charAt(index))) {
            this.input.nativeElement.setSelectionRange(index, index);
            break;
          }
        }
        break;

      case 'Tab':
      case 'Enter':
        newValueStr = this.validateValue(this.parseValue(this.input.nativeElement.value)) as string;
        this.input.nativeElement.value = this.formatValue(newValueStr);
        this.input.nativeElement.setAttribute('aria-valuenow', newValueStr ?? '');
        this.updateModel(newValueStr);
        break;

      case 'Backspace': {
        event.preventDefault();

        if (selectionStart === selectionEnd) {
          const deleteChar = inputValue.charAt(selectionStart - 1);
          const { decimalCharIndex, decimalCharIndexWithoutPrefix } = this.getDecimalCharIndexes(inputValue);

          if (this.isNumeralChar(deleteChar)) {
            const decimalLength = this.getDecimalLength(inputValue);

            if (this._group.test(deleteChar)) {
              this._group.lastIndex = 0;
              newValueStr = inputValue.slice(0, selectionStart - 2) + inputValue.slice(selectionStart - 1);
            } else if (this._decimal.test(deleteChar)) {
              this._decimal.lastIndex = 0;

              if (decimalLength) {
                this.input?.nativeElement.setSelectionRange(selectionStart - 1, selectionStart - 1);
              } else {
                newValueStr = inputValue.slice(0, selectionStart - 1) + inputValue.slice(selectionStart);
              }
            } else if (decimalCharIndex > 0 && selectionStart > decimalCharIndex) {
              newValueStr = inputValue.slice(0, selectionStart - 1) + 0 + inputValue.slice(selectionStart);
            } else if (decimalCharIndexWithoutPrefix === 1) {
              newValueStr = inputValue.slice(0, selectionStart - 1) + '0' + inputValue.slice(selectionStart);
              newValueStr = (this.parseValue(newValueStr) as number) > 0 ? newValueStr : '';
            } else {
              newValueStr = inputValue.slice(0, selectionStart - 1) + inputValue.slice(selectionStart);
            }
          } else if (deleteChar.search(this._currency ?? '') != -1) {
            newValueStr = inputValue.slice(1);
          }

          this.updateValue(event, newValueStr, null, 'delete-single');
        } else {
          newValueStr = this.deleteRange(inputValue, selectionStart, selectionEnd);
          this.updateValue(event, newValueStr, null, 'delete-range');
        }

        break;
      }

      case 'Delete':
        event.preventDefault();

        if (selectionStart === selectionEnd) {
          const deleteChar = inputValue.charAt(selectionStart);
          const { decimalCharIndex, decimalCharIndexWithoutPrefix } = this.getDecimalCharIndexes(inputValue);

          if (this.isNumeralChar(deleteChar)) {
            const decimalLength = this.getDecimalLength(inputValue);

            if (this._group.test(deleteChar)) {
              this._group.lastIndex = 0;
              newValueStr = inputValue.slice(0, selectionStart) + inputValue.slice(selectionStart + 2);
            } else if (this._decimal.test(deleteChar)) {
              this._decimal.lastIndex = 0;

              if (decimalLength) {
                this.input?.nativeElement.setSelectionRange(selectionStart + 1, selectionStart + 1);
              } else {
                newValueStr = inputValue.slice(0, selectionStart) + inputValue.slice(selectionStart + 1);
              }
            } else if (decimalCharIndex > 0 && selectionStart > decimalCharIndex) {
              newValueStr = inputValue.slice(0, selectionStart) + inputValue.slice(selectionStart + 1);
            } else if (decimalCharIndexWithoutPrefix === 1) {
              newValueStr = inputValue.slice(0, selectionStart) + '0' + inputValue.slice(selectionStart + 1);
              newValueStr = (this.parseValue(newValueStr) as number) > 0 ? newValueStr : '';
            } else {
              newValueStr = inputValue.slice(0, selectionStart) + inputValue.slice(selectionStart + 1);
            }
          }

          this.updateValue(event, newValueStr as string, null, 'delete-back-single');
        } else {
          newValueStr = this.deleteRange(inputValue, selectionStart, selectionEnd);
          this.updateValue(event, newValueStr, null, 'delete-range');
        }
        break;

      case 'Home':
        if (this.min) {
          this.updateModel(this.min);
          event.preventDefault();
        }
        break;

      case 'End':
        if (this.max) {
          this.updateModel(this.max);
          event.preventDefault();
        }
        break;

      default:
        break;
    }

    this.keyDown.emit(event);
  }

  onInputKeyPress(event: KeyboardEvent) {
    if (this.readonly) {
      return;
    }

    let code = event.which || event.keyCode;
    let char = String.fromCharCode(code);
    let isDecimalSign = this.isDecimalSign(char);
    const isMinusSign = this.isMinusSign(char);

    if (code != 13) {
      event.preventDefault();
    }
    if (!isDecimalSign && event.code === 'NumpadDecimal') {
      isDecimalSign = true;
      char = this._decimalChar;
      code = char.charCodeAt(0);
    }

    if ((48 <= code && code <= 57) || isMinusSign || isDecimalSign) {
      this.insert(event, char, { isDecimalSign, isMinusSign });
    }
  }

  private getSelectedText() {
    return (
      window
        ?.getSelection()
        ?.toString()
        .replaceAll(/[^0-9']/g, '') || ''
    );
  }

  onPaste(event: ClipboardEvent) {
    if (!this.disabled && !this.readonly) {
      event.preventDefault();
      if (!event.clipboardData) return;
      const data = event.clipboardData.getData('Text');
      const filteredData = this.parseValue(data);
      if (filteredData != null) {
        this.insert(event, filteredData.toString());
      }
    }
  }

  allowMinusSign() {
    return this.min == null || this.min < 0;
  }

  isMinusSign(char: string) {
    if (this._minusSign.test(char) || char === '-') {
      this._minusSign.lastIndex = 0;
      return true;
    }

    return false;
  }

  isDecimalSign(char: string) {
    if (this._decimal.test(char)) {
      this._decimal.lastIndex = 0;
      return true;
    }

    return false;
  }

  getDecimalCharIndexes(val: string) {
    const decimalCharIndex = val.search(this._decimal);
    this._decimal.lastIndex = 0;

    const filteredVal = val.replace(this._prefix, '').trim().replace(/\s/g, '').replace(this._currency, '');
    const decimalCharIndexWithoutPrefix = filteredVal.search(this._decimal);
    this._decimal.lastIndex = 0;

    return { decimalCharIndex, decimalCharIndexWithoutPrefix };
  }

  getCharIndexes(val: string) {
    const decimalCharIndex = val.search(this._decimal);
    this._decimal.lastIndex = 0;
    const minusCharIndex = val.search(this._minusSign);
    this._minusSign.lastIndex = 0;
    const currencyCharIndex = val.search(this._currency);
    this._currency.lastIndex = 0;

    return { decimalCharIndex, minusCharIndex, currencyCharIndex };
  }

  insert(event: Event, text: string, sign = { isDecimalSign: false, isMinusSign: false }) {
    const minusCharIndexOnText = text.search(this._minusSign);
    this._minusSign.lastIndex = 0;
    if (!this.allowMinusSign() && minusCharIndexOnText !== -1) {
      return;
    }

    const selectionStart = this.input?.nativeElement.selectionStart ?? 0;
    const selectionEnd = this.input?.nativeElement.selectionEnd ?? 0;
    const inputValue = this.input?.nativeElement.value.trim();
    const { decimalCharIndex, minusCharIndex, currencyCharIndex } = this.getCharIndexes(inputValue);
    let newValueStr;

    if (sign.isMinusSign) {
      if (selectionStart === 0) {
        newValueStr = inputValue;
        if (minusCharIndex === -1 || selectionEnd !== 0) {
          newValueStr = this.insertText(inputValue, text, 0, selectionEnd);
        }

        this.updateValue(event, newValueStr, text, 'insert');
      }
    } else if (sign.isDecimalSign) {
      if (decimalCharIndex > 0 && selectionStart === decimalCharIndex) {
        this.updateValue(event, inputValue, text, 'insert');
      } else if (decimalCharIndex > selectionStart && decimalCharIndex < selectionEnd) {
        newValueStr = this.insertText(inputValue, text, selectionStart, selectionEnd);
        this.updateValue(event, newValueStr, text, 'insert');
      }
    } else {
      const maxFractionDigits = this.numberFormat.resolvedOptions().maximumFractionDigits;
      const operation = selectionStart !== selectionEnd ? 'range-insert' : 'insert';

      if (decimalCharIndex > 0 && selectionStart > decimalCharIndex) {
        if (selectionStart + text.length - (decimalCharIndex + 1) <= maxFractionDigits!) {
          const charIndex = currencyCharIndex >= selectionStart ? currencyCharIndex - 1 : inputValue.length;

          newValueStr =
            inputValue.slice(0, selectionStart) +
            text +
            inputValue.slice(selectionStart + text.length, charIndex) +
            inputValue.slice(charIndex);
          this.updateValue(event, newValueStr, text, operation);
        }
      } else {
        newValueStr = this.insertText(inputValue, text, selectionStart, selectionEnd);
        this.updateValue(event, newValueStr, text, operation);
      }
    }
  }

  insertText(value: string, text: string, start: number, end: number) {
    const textSplit = text === '.' ? text : text.split('.');

    if (textSplit.length === 2) {
      const decimalCharIndex = value.slice(start, end).search(this._decimal);
      this._decimal.lastIndex = 0;
      return decimalCharIndex > 0
        ? value.slice(0, start) + this.formatValue(text) + value.slice(end)
        : value || this.formatValue(text);
    } else if (end - start === value.length) {
      return this.formatValue(text);
    } else if (start === 0) {
      return text + value.slice(end);
    } else if (end === value.length) {
      return value.slice(0, start) + text;
    } else {
      return value.slice(0, start) + text + value.slice(end);
    }
  }

  deleteRange(value: string, start: number, end: number) {
    let newValueStr;

    if (end - start === value.length) newValueStr = '';
    else if (start === 0) newValueStr = value.slice(end);
    else if (end === value.length) newValueStr = value.slice(0, start);
    else newValueStr = value.slice(0, start) + value.slice(end);

    return newValueStr;
  }

  initCursor(): number {
    let selectionStart = this.input?.nativeElement.selectionStart ?? 0;
    const selectionEnd = this.input?.nativeElement.selectionEnd ?? 0;
    let inputValue = this.input?.nativeElement.value;
    const valueLength = inputValue.length;
    let index = null;

    // remove prefix
    const prefixLength = (this.prefixChar || '').length;
    inputValue = inputValue.replace(this._prefix ?? '', '');

    // Will allow selecting whole prefix. But not a part of it.
    // Negative values will trigger clauses after this to fix the cursor position.
    if (selectionStart === selectionEnd || selectionStart !== 0 || selectionEnd < prefixLength) {
      selectionStart -= prefixLength;
    }

    let char = inputValue.charAt(selectionStart);
    if (this.isNumeralChar(char)) {
      return selectionStart + prefixLength;
    }

    //left
    let i = selectionStart - 1;
    while (i >= 0) {
      char = inputValue.charAt(i);
      if (this.isNumeralChar(char)) {
        index = i + prefixLength;
        break;
      } else {
        i--;
      }
    }

    if (index !== null) {
      this.input?.nativeElement.setSelectionRange(index + 1, index + 1);
    } else {
      i = selectionStart;
      while (i < valueLength) {
        char = inputValue.charAt(i);
        if (this.isNumeralChar(char)) {
          index = i + prefixLength;
          break;
        } else {
          i++;
        }
      }

      if (index !== null) {
        this.input?.nativeElement.setSelectionRange(index, index);
      }
    }

    return index || 0;
  }

  onInputClick() {
    const currentValue = this.input?.nativeElement.value;

    if (!this.readonly && currentValue !== DomHandler.getSelection()) {
      this.initCursor();
    }
  }

  isNumeralChar(char: string) {
    if (
      char.length === 1 &&
      (this._numeral.test(char) || this._decimal.test(char) || this._group.test(char) || this._minusSign.test(char))
    ) {
      this.resetRegex();
      return true;
    }

    return false;
  }

  resetRegex() {
    this._numeral.lastIndex = 0;
    this._decimal.lastIndex = 0;
    this._group.lastIndex = 0;
    this._minusSign.lastIndex = 0;
  }

  updateValue(
    event: Event,
    valueStr: Nullable<string>,
    insertedValueStr: Nullable<string>,
    operation: Nullable<string>,
  ) {
    const currentValue = this.input?.nativeElement.value;
    if (valueStr != null) {
      let newValue = this.parseValue(valueStr);
      newValue = !newValue && !this.allowEmpty ? 0 : newValue;
      this.updateInput(newValue, insertedValueStr, operation, valueStr);

      this.handleOnInput(event, currentValue, newValue);
    }
  }

  handleOnInput(event: Event, currentValue: string | number, newValue: textNumber) {
    if (this.isValueChanged(currentValue, newValue)) {
      (this.input as ElementRef).nativeElement.value = this.formatValue(newValue);
      this.input?.nativeElement.setAttribute('aria-valuenow', newValue?.toString() ?? '');
      !this.isBlurUpdateOnMode && this.updateModel(newValue);
      this.inputEvent.emit({
        originalEvent: event,
        value: newValue?.toString() ?? '',
        formattedValue: currentValue.toString(),
      });
    }
  }

  isValueChanged(currentValue: Nullable<string | number>, newValue: textNumber | undefined) {
    if (newValue === null && currentValue !== null) {
      return true;
    }

    if (newValue != null) {
      const parsedCurrentValue = typeof currentValue === 'string' ? this.parseValue(currentValue) : currentValue;
      return newValue !== parsedCurrentValue;
    }

    return false;
  }

  validateValue(value: textNumber): textNumber {
    if (value === '-' || value == null) {
      return null;
    }

    if (this.min != null && (value as number) < this.min) {
      return this.min;
    }

    if (this.max != null && (value as number) > this.max) {
      return this.max;
    }

    return value;
  }

  updateInput(
    value: textNumber,
    insertedValueStr: Nullable<string>,
    operation: Nullable<string>,
    valueStr: Nullable<string>,
  ) {
    insertedValueStr = insertedValueStr || '';

    const inputValue = this.input?.nativeElement.value;
    let newValue = this.formatValue(value);
    const currentLength = inputValue.length;

    if (newValue !== valueStr) {
      newValue = this.concatValues(newValue, valueStr as string);
    }

    if (currentLength === 0) {
      this.input.nativeElement.value = newValue;
      this.input.nativeElement.setSelectionRange(0, 0);
      const index = this.initCursor();
      const selectionEnd = index + insertedValueStr.length;
      this.input.nativeElement.setSelectionRange(selectionEnd, selectionEnd);
    } else {
      const selectionStart = this.input.nativeElement.selectionStart ?? 0;
      let selectionEnd = this.input.nativeElement.selectionEnd ?? 0;

      this.input.nativeElement.value = newValue;
      const newLength = newValue.length;

      if (operation === 'range-insert') {
        const startValue = this.parseValue((inputValue || '').slice(0, selectionStart));
        const startValueStr = startValue ? startValue.toString() : '';
        const startExpr = startValueStr.split('').join(`(${this.groupChar})?`);
        const sRegex = new RegExp(startExpr, 'g');
        sRegex.test(newValue);

        const tExpr = insertedValueStr.split('').join(`(${this.groupChar})?`);
        const tRegex = new RegExp(tExpr, 'g');
        tRegex.test(newValue.slice(sRegex.lastIndex));

        selectionEnd = sRegex.lastIndex + tRegex.lastIndex;
        this.input.nativeElement.setSelectionRange(selectionEnd, selectionEnd);
      } else if (newLength === currentLength) {
        if (operation === 'insert' || operation === 'delete-back-single')
          this.input.nativeElement.setSelectionRange(selectionEnd + 1, selectionEnd + 1);
        else if (operation === 'delete-single')
          this.input.nativeElement.setSelectionRange(selectionEnd - 1, selectionEnd - 1);
        else if (operation === 'delete-range' || operation === 'spin')
          this.input.nativeElement.setSelectionRange(selectionEnd, selectionEnd);
      } else if (operation === 'delete-back-single') {
        const prevChar = inputValue.charAt(selectionEnd - 1);
        const nextChar = inputValue.charAt(selectionEnd);
        const diff = currentLength - newLength;
        const isGroupChar = this._group.test(nextChar);

        if (isGroupChar && diff === 1) {
          selectionEnd += 1;
        } else if (!isGroupChar && this.isNumeralChar(prevChar)) {
          selectionEnd += -1 * diff + 1;
        }

        this._group.lastIndex = 0;
        this.input.nativeElement.setSelectionRange(selectionEnd, selectionEnd);
      } else if (inputValue === '-' && operation === 'insert') {
        this.input.nativeElement.setSelectionRange(0, 0);
        const index = this.initCursor();
        const selectionEnd = index + insertedValueStr.length + 1;
        this.input.nativeElement.setSelectionRange(selectionEnd, selectionEnd);
      } else {
        selectionEnd = selectionEnd + (newLength - currentLength);
        this.input.nativeElement.setSelectionRange(selectionEnd, selectionEnd);
      }
    }

    this.input.nativeElement.setAttribute('aria-valuenow', value !== null ? value.toString() : '');
  }

  concatValues(val1: string, val2: string) {
    if (val1 && val2) {
      const decimalCharIndex = val2.search(this._decimal);
      this._decimal.lastIndex = 0;

      return decimalCharIndex !== -1 ? val1.split(this._decimal)[0] + val2.slice(decimalCharIndex) : val1;
    }
    return val1;
  }

  getDecimalLength(value: string) {
    if (value) {
      const valueSplit = value.split(this._decimal);

      if (valueSplit.length === 2) {
        return valueSplit[1].trim().replace(/\s/g, '').replace(this._currency, '').length;
      }
    }

    return 0;
  }

  onInputFocus(event: Event) {
    this.focused = true;
    this.focusEvent.emit(event);
  }

  onInputBlur(event: Event) {
    this.focused = false;

    const newValueNumber = this.validateValue(this.parseValue(this.input.nativeElement.value));
    const newValueString = newValueNumber?.toString();
    this.input.nativeElement.value = this.formatValue(newValueString ?? '');
    this.input.nativeElement.setAttribute('aria-valuenow', newValueString ?? '');
    this.updateModel(newValueNumber);
    this.blurEvent.emit(event);
  }

  formattedValue() {
    const val = !this.value && !this.allowEmpty ? 0 : this.value;
    return this.formatValue(val);
  }

  updateModel(value: number | string | null) {
    if (this.value !== value) {
      this.value = value ? Number(value) : null;
      if (this.onModelChange && (!(this.isBlurUpdateOnMode && this.focused) || this.isBlurUpdateOnMode)) {
        this.onModelChange(value);
      }
    }
    this.onModelTouched();
  }

  writeValue(value: number | null): void {
    this.value = value;
    this.cd.markForCheck();
  }

  registerOnChange(fn: onModelChangeFunction): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: onModelTouchedFunction): void {
    this.onModelTouched = fn;
  }

  setDisabledState(val: boolean): void {
    this.disabled = val;
    this.cd.markForCheck();
  }
}
