import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputNumberComponent } from './input-number.component';
import { InputTextModule } from 'primeng/inputtext';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ElementRef } from '@angular/core';

describe('InputNumberComponent', () => {
  function createInput(value: string, event?: Event, selection?: [number, number]) {
    const inputElement = document.createElement('input');
    inputElement.value = value;
    if (selection) {
      inputElement.setSelectionRange(...selection);
    }
    component.input = new ElementRef(inputElement);

    if (event) {
      Object.defineProperty(event, 'target', { value: inputElement });
    }

    return inputElement;
  }

  let component: InputNumberComponent;
  let fixture: ComponentFixture<InputNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, InputTextModule, ReactiveFormsModule, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(InputNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should parse value correctly', () => {
    expect(component.parseValue('$1,234.56')).toBe(1234.56);
    expect(component.parseValue('-$1,234.56')).toBe(-1234.56);
    expect(component.parseValue('$-')).toBe('-');
  });

  it('should spin value correctly', () => {
    spyOn(component, 'parseValue').and.returnValue(10);
    spyOn(component, 'validateValue').and.returnValue(11);
    spyOn(component, 'updateInput');
    spyOn(component, 'updateModel');
    spyOn(component, 'handleOnInput');

    const event = new Event('spin');
    const inputElement = document.createElement('input');
    Object.defineProperty(event, 'target', { value: inputElement });
    component.spin(event, 1);

    expect(component.updateInput).toHaveBeenCalledWith(11, null, 'spin', null);
    expect(component.updateModel).toHaveBeenCalledWith(11);
    expect(component.handleOnInput).toHaveBeenCalledWith(event, 10, 11);
  });

  it('should handle user input correctly', () => {
    component.readonly = true;
    const event = new Event('input');
    const inputElement = document.createElement('input');
    Object.defineProperty(event, 'target', { value: inputElement });
    component.onUserInput(event);
    expect((event.target as HTMLInputElement).value).toBe('');

    component.readonly = false;
    component.isSpecialChar = true;
    component.lastValue = '123';
    component.onUserInput(event);
    expect((event.target as HTMLInputElement).value).toBe('123');
    expect(component.isSpecialChar).toBeFalse();
  });

  describe('onInputKeydown', () => {
    it('should do nothing on readonly', () => {
      component.readonly = true;
      component.lastValue = '';

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      createInput('$1,234.56', event);
      component.onInputKeyDown(event);
      expect(component.lastValue).toBe('');
    });

    it('should set isSpecialChar if Alt or Shift key used', () => {
      component.isSpecialChar = false;
      const event = new KeyboardEvent('keydown', { altKey: true });
      createInput('$1,234.56', event);
      component.onInputKeyDown(event);
      expect(component.isSpecialChar).toBeTrue();
    });

    it('should spin up if Arrow up', () => {
      spyOn(component, 'spin');
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      createInput('$1,234.56', event);
      const defaultSpy = spyOn(event, 'preventDefault');
      component.onInputKeyDown(event);
      expect(component.spin).toHaveBeenCalledWith(event, 1);
      expect(defaultSpy).toHaveBeenCalled();
    });

    it('should spin down if Arrow down', () => {
      spyOn(component, 'spin');
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      createInput('$1,234.56', event);
      const defaultSpy = spyOn(event, 'preventDefault');
      component.onInputKeyDown(event);
      expect(component.spin).toHaveBeenCalledWith(event, -1);
      expect(defaultSpy).toHaveBeenCalled();
    });

    it('should move left if ArrowLeft', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      createInput('$1,234.56', event);
      const selectionSpy = spyOn(component.input.nativeElement, 'setSelectionRange');
      component.onInputKeyDown(event);
      expect(selectionSpy).toHaveBeenCalledWith(9, 9);
    });

    it('should move right if ArrowRight', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      createInput('$1,234.56', event);
      const selectionSpy = spyOn(component.input.nativeElement, 'setSelectionRange');
      component.onInputKeyDown(event);
      expect(selectionSpy).toHaveBeenCalledWith(8, 8);
    });

    it('should update if Tab or Enter', () => {
      const parseSpy = spyOn(component, 'parseValue').and.returnValue(1234);
      const formatSpy = spyOn(component, 'formatValue').and.returnValue('1234');
      const updateSpy = spyOn(component, 'updateModel');
      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      createInput('$1,234.56', event);
      component.onInputKeyDown(event);
      expect(parseSpy).toHaveBeenCalledWith('$1,234.56');
      expect(formatSpy).toHaveBeenCalledWith(1234);
      expect(updateSpy).toHaveBeenCalledWith(1234);
    });

    it('should delete previous char when backspace', () => {
      const groupTestSpy = spyOn(component._group, 'test');
      const isNumeralSpy = spyOn(component, 'isNumeralChar').and.returnValue(true);
      const updateSpy = spyOn(component, 'updateValue');
      const event = new KeyboardEvent('keydown', { key: 'Backspace' });

      createInput('$1,234.56', event, [9, 9]);
      const defaultSpy = spyOn(event, 'preventDefault');

      component.onInputKeyDown(event);
      expect(defaultSpy).toHaveBeenCalled();
      expect(isNumeralSpy).toHaveBeenCalledWith('6');
      expect(groupTestSpy).toHaveBeenCalledWith('6');
      expect(updateSpy).toHaveBeenCalledWith(event, '$1,234.50', null, 'delete-single');
    });

    it('should delete selection when backspace', () => {
      const event = new KeyboardEvent('keydown', { key: 'Backspace' });
      createInput('$1,234.56', event, [3, 6]);

      const defaultSpy = spyOn(event, 'preventDefault');
      const deleteSpy = spyOn(component, 'deleteRange').and.returnValue('$1,.56');
      const updateSpy = spyOn(component, 'updateValue');

      component.onInputKeyDown(event);
      expect(defaultSpy).toHaveBeenCalled();
      expect(deleteSpy).toHaveBeenCalledWith('$1,234.56', 3, 6);
      expect(updateSpy).toHaveBeenCalledWith(event, '$1,.56', null, 'delete-range');
    });

    it('should delete selection when delete', () => {
      const event = new KeyboardEvent('keydown', { key: 'Delete' });
      createInput('$1,234.56', event, [3, 6]);

      const defaultSpy = spyOn(event, 'preventDefault');
      const deleteSpy = spyOn(component, 'deleteRange').and.returnValue('$1,.56');
      const updateSpy = spyOn(component, 'updateValue');

      component.onInputKeyDown(event);
      expect(defaultSpy).toHaveBeenCalled();
      expect(deleteSpy).toHaveBeenCalledWith('$1,234.56', 3, 6);
      expect(updateSpy).toHaveBeenCalledWith(event, '$1,.56', null, 'delete-range');
    });

    it('should delete next char when backspace', () => {
      const groupTestSpy = spyOn(component._group, 'test');
      const isNumeralSpy = spyOn(component, 'isNumeralChar').and.returnValue(true);
      const updateSpy = spyOn(component, 'updateValue');
      const event = new KeyboardEvent('keydown', { key: 'Delete' });
      createInput('$1,234.56', event, [7, 7]);
      const defaultSpy = spyOn(event, 'preventDefault');

      component.onInputKeyDown(event);
      expect(defaultSpy).toHaveBeenCalled();
      expect(isNumeralSpy).toHaveBeenCalledWith('5');
      expect(groupTestSpy).toHaveBeenCalledWith('5');
      expect(updateSpy).toHaveBeenCalledWith(event, '$1,234.6', null, 'delete-back-single');
    });

    it('should update model to min if Home and has min', () => {
      const event = new KeyboardEvent('keydown', { key: 'Home' });
      createInput('$1,234.56', event);
      component.min = undefined;
      const updateSpy = spyOn(component, 'updateModel');
      component.onInputKeyDown(event);
      expect(updateSpy).toHaveBeenCalledTimes(0);

      component.min = 1;
      component.onInputKeyDown(event);
      expect(updateSpy).toHaveBeenCalledWith(1);
    });

    it('should update model to max if End and has max', () => {
      const event = new KeyboardEvent('keydown', { key: 'End' });
      createInput('$1,234.56', event);
      component.max = undefined;
      const updateSpy = spyOn(component, 'updateModel');
      component.onInputKeyDown(event);
      expect(updateSpy).toHaveBeenCalledTimes(0);

      component.max = 100;
      component.onInputKeyDown(event);
      expect(updateSpy).toHaveBeenCalledWith(100);
    });

    it('should emit keydown', () => {
      const keydownSpy = spyOn(component.keyDown, 'emit');
      const event = new KeyboardEvent('keydown', { key: 'End' });
      createInput('$1,234.56', event);
      component.onInputKeyDown(event);
      expect(keydownSpy).toHaveBeenCalledWith(event);
    });
  });

  describe('onInputKeyPress', () => {
    it('should prevent input if readonly is true', () => {
      component.readonly = true;
      const event = new KeyboardEvent('keypress', { key: '1' });
      const defaultSpy = spyOn(event, 'preventDefault');
      component.onInputKeyPress(event);
      expect(defaultSpy).not.toHaveBeenCalled();
    });

    it('should allow numeric input', () => {
      component.readonly = false;
      const event = new KeyboardEvent('keypress', { key: '1' });
      const defaultSpy = spyOn(event, 'preventDefault');
      component.onInputKeyPress(event);
      expect(defaultSpy).toHaveBeenCalled();
    });

    it('should prevent non-numeric input', () => {
      component.readonly = false;
      const event = new KeyboardEvent('keypress', { key: 'a' });
      const defaultSpy = spyOn(event, 'preventDefault');
      component.onInputKeyPress(event);
      expect(defaultSpy).toHaveBeenCalled();
    });
  });

  it('should handle paste event', () => {
    component.readonly = false;
    const dt = new DataTransfer();
    dt.setData('Text', '123');
    const event = new ClipboardEvent('paste', {
      clipboardData: dt,
    });
    const defaultSpy = spyOn(event, 'preventDefault');
    const parseSpy = spyOn(component, 'parseValue').and.callThrough();
    const insertSpy = spyOn(component, 'insert');
    component.onPaste(event);
    expect(defaultSpy).toHaveBeenCalled();
    expect(parseSpy).toHaveBeenCalledWith('123');
    expect(insertSpy).toHaveBeenCalledWith(event, '123');
  });

  describe('minus sign', () => {
    it('should allow minus sign if min is less than 0', () => {
      component.min = -1;
      expect(component.allowMinusSign()).toBeTrue();
    });

    it('should not allow minus sign if min is greater than or equal to 0', () => {
      component.min = 0;
      expect(component.allowMinusSign()).toBeFalse();
    });

    it('should recognize minus sign', () => {
      expect(component.isMinusSign('-')).toBeTrue();
    });
  });

  it('should recognize decimal sign', () => {
    expect(component.isDecimalSign('.')).toBeTrue();
  });

  it('should get decimal character indexes', () => {
    const val = '123.45';
    const result = component.getDecimalCharIndexes(val);
    expect(result.decimalCharIndex).toBe(3);
    expect(result.decimalCharIndexWithoutPrefix).toBe(3);
  });

  it('should get character indexes', () => {
    const val = '-$123.45';
    const result = component.getCharIndexes(val);
    expect(result.decimalCharIndex).toBe(5);
    expect(result.minusCharIndex).toBe(0);
    expect(result.currencyCharIndex).toBe(1);
  });

  describe('insert', () => {
    it('should insert text correctly', () => {
      const event = new Event('input');
      const text = '5';
      spyOn(component, 'updateValue');
      component.insert(event, text);
      expect(component.updateValue).toHaveBeenCalled();
    });

    it('should handle minus sign', () => {
      const event = new Event('input');
      createInput('', event, [0, 0]);

      const text = '5';
      spyOn(component, 'updateValue');
      component.insert(event, text, { isMinusSign: true, isDecimalSign: false });
      expect(component.updateValue).toHaveBeenCalled();
    });

    it('should ignore minus sign when not at start', () => {
      const event = new Event('input');
      createInput('$1,234.56', event, [2, 2]);

      const text = '5';
      spyOn(component, 'updateValue');
      component.insert(event, text, { isMinusSign: true, isDecimalSign: false });
      expect(component.updateValue).not.toHaveBeenCalled();
    });

    it('should handle decimal sign', () => {
      const event = new Event('input');
      createInput('$1,234.56', event, [6, 6]);

      const text = '5';
      spyOn(component, 'updateValue');
      component.insert(event, text, { isMinusSign: false, isDecimalSign: true });
      expect(component.updateValue).toHaveBeenCalled();
    });

    it('should ignore decimal sign when not at decimal', () => {
      const event = new Event('input');
      createInput('$1,234.56', event, [0, 0]);

      const text = '5';
      spyOn(component, 'updateValue');
      component.insert(event, text, { isMinusSign: false, isDecimalSign: true });
      expect(component.updateValue).not.toHaveBeenCalled();
    });
  });

  it('should insert text at the correct position', () => {
    const value = '123';
    const text = '4';
    const result = component.insertText(value, text, 1, 2);
    expect(result).toBe('143');
  });

  it('should delete range correctly', () => {
    const value = '12345';
    const result = component.deleteRange(value, 1, 3);
    expect(result).toBe('145');
  });

  describe('initCursor', () => {
    it('should initialize cursor correctly', () => {
      createInput('$1,234.56', undefined, [1, 1]);
      const isNumeralSpy = spyOn(component, 'isNumeralChar').and.returnValue(true);
      const result = component.initCursor();
      expect(result).toBe(1);
      expect(isNumeralSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle input click correctly', () => {
      createInput('$1,234.56');
      spyOn(component, 'initCursor');
      component.readonly = false;
      component.onInputClick();
      expect(component.initCursor).toHaveBeenCalled();
    });
  });

  it('should recognize numeral characters', () => {
    createInput('$1,234.56');
    expect(component.isNumeralChar('1')).toBeTrue();
    expect(component.isNumeralChar('.')).toBeTrue();
    expect(component.isNumeralChar('-')).toBeTrue();
    expect(component.isNumeralChar(',')).toBeTrue();
    expect(component.isNumeralChar('a')).toBeFalse();
  });

  it('should update value correctly', () => {
    const event = new Event('input');
    createInput('$1,234.56', event);
    spyOn(component, 'parseValue').and.returnValue(123);
    spyOn(component, 'updateInput');
    spyOn(component, 'handleOnInput');

    component.updateValue(event, '123', '1', 'insert');
    expect(component.parseValue).toHaveBeenCalledWith('123');
    expect(component.updateInput).toHaveBeenCalled();
    expect(component.handleOnInput).toHaveBeenCalled();
  });

  it('should handle on input correctly', () => {
    const event = new Event('input');
    createInput('$1,234.56', event);
    spyOn(component, 'isValueChanged').and.returnValue(true);
    spyOn(component, 'formatValue').and.returnValue('123');
    spyOn(component, 'updateModel');

    const setAttributeSpy = spyOn(component.input.nativeElement, 'setAttribute');
    component.handleOnInput(event, '12345', 123);
    expect(component.isValueChanged).toHaveBeenCalledWith('12345', 123);
    expect(component.input.nativeElement.value).toBe('123');
    expect(setAttributeSpy).toHaveBeenCalledWith('aria-valuenow', '123');
    expect(component.updateModel).toHaveBeenCalled();
  });

  it('should check if value is changed correctly', () => {
    spyOn(component, 'parseValue').and.returnValue(123);
    expect(component.isValueChanged('123', 123)).toBeFalse();
    expect(component.isValueChanged('123', 124)).toBeTrue();
    expect(component.isValueChanged(null, 123)).toBeTrue();
  });

  it('should validate value correctly', () => {
    component.min = 0;
    component.max = 100;
    expect(component.validateValue('-')).toBeNull();
    expect(component.validateValue(null)).toBeNull();
    expect(component.validateValue(-1)).toBe(0);
    expect(component.validateValue(101)).toBe(100);
    expect(component.validateValue(50)).toBe(50);
  });

  describe('updateInput', () => {
    it('should update input value when current length is 0', () => {
      const inputElement = createInput('');

      component.updateInput('1', '1', 'insert', '$1.00');
      expect(inputElement.value).toBe('$1.00');
      expect(inputElement.selectionStart).toBe(2);
      expect(inputElement.selectionEnd).toBe(2);
    });

    it('should handle range-insert operation', () => {
      const inputElement = createInput('');
      spyOn(component, 'parseValue').and.returnValue(12);
      component.updateInput('123', '4', 'range-insert', '12');
      expect(inputElement.value).toBe('$123.00');
    });

    it('should handle delete-back-single operation', () => {
      const inputElement = createInput('$123.00', undefined, [2, 2]);
      component.updateInput('12', '', 'delete-back-single', '123');
      expect(inputElement.value).toBe('$12.00');
      expect(inputElement.selectionStart).toBe(2);
      expect(inputElement.selectionEnd).toBe(2);
    });

    it('should handle insert operation', () => {
      const inputElement = createInput('$12.00', undefined, [2, 2]);
      component.updateInput('123', '3', 'insert', '12');
      expect(inputElement.value).toBe('$123.00');
      expect(inputElement.selectionStart).toBe(3);
      expect(inputElement.selectionEnd).toBe(3);
    });

    it('should handle delete-single operation', () => {
      const inputElement = createInput('$123.00', undefined, [2, 2]);
      component.updateInput('13', '', 'delete-single', '123');
      expect(inputElement.value).toBe('$13.00');
      expect(inputElement.selectionStart).toBe(1);
      expect(inputElement.selectionEnd).toBe(1);
    });

    it('should handle delete-range operation', () => {
      const inputElement = createInput('$12,345.00', undefined, [1, 4]);
      component.updateInput('15', '', 'delete-range', '12345');
      expect(inputElement.value).toBe('$15.00');
      expect(inputElement.selectionStart).toBe(0);
      expect(inputElement.selectionEnd).toBe(0);
    });

    it('should handle spin operation', () => {
      const inputElement = createInput('$123.00', undefined, [2, 2]);
      component.updateInput('124', '4', 'spin', '123');
      expect(inputElement.value).toBe('$124.00');
      expect(inputElement.selectionStart).toBe(2);
      expect(inputElement.selectionEnd).toBe(2);
    });

    // it('should handle input value "-" and insert operation', () => {
    //   const inputElement = createInput('-');
    //   spyOn(component, 'initCursor').and.returnValue(0);
    //   component.updateInput('123', '4', 'insert', '-');
    //   expect(inputElement.value).toBe('$1,234.00');
    //   expect(inputElement.selectionStart).toBe(1);
    //   expect(inputElement.selectionEnd).toBe(1);
    // });
  });

  it('should handle input focus event', () => {
    spyOn(component.focusEvent, 'emit');
    const event = new Event('focus');
    component.onInputFocus(event);
    expect(component.focused).toBeTrue();
    expect(component.focusEvent.emit).toHaveBeenCalledWith(event);
  });

  it('should handle input blur event', () => {
    spyOn(component.blurEvent, 'emit');
    const inputElement = document.createElement('input');
    inputElement.value = '$1,234.56';
    component.input = new ElementRef(inputElement);
    const event = new Event('blur');
    component.onInputBlur(event);
    expect(component.focused).toBeFalse();
    expect(component.blurEvent.emit).toHaveBeenCalledWith(event);
    expect(inputElement.value).toBe('$1,234.56');
  });

  it('should update model correctly', () => {
    component.onModelChange = jasmine.createSpy('onModelChange');
    component.updateModel(123);
    expect(component.value).toBe(123);
    expect(component.onModelChange).toHaveBeenCalledWith(123);
  });

  describe('', () => {
    it('should write value and mark for check', () => {
      const markSpy = spyOn(component.cd, 'markForCheck');
      component.writeValue(123);
      expect(component.value).toBe(123);
      expect(markSpy).toHaveBeenCalled();
    });

    it('should handle null value', () => {
      const markSpy = spyOn(component.cd, 'markForCheck');
      component.writeValue(null);
      expect(component.value).toBeNull();
      expect(markSpy).toHaveBeenCalled();
    });
  });
});
