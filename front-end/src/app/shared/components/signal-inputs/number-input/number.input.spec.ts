import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NumberInput } from './number.input';
import { Component, signal, viewChild } from '@angular/core';
import { disabled, form, FormField, hidden, required } from '@angular/forms/signals';
import { requiredMessage } from 'app/shared/utils/signal-schema.utils';
import { describe, beforeEach, it, expect, vi } from 'vitest';

interface TestFormModel {
  testNum: string;
  isDisabled: boolean;
  isHidden: boolean;
}

@Component({
  standalone: true,
  imports: [NumberInput, FormField],
  template: `
    <form novalidate (submit)="$event.preventDefault()">
      <app-number-input
        label="TEST"
        [formField]="testForm.testNum"
        [integerOnly]="integerOnly()"
        [positiveOnly]="positiveOnly()"
      />
    </form>
  `,
})
class TestHostComponent {
  testModel = signal<TestFormModel>({
    testNum: '',
    isDisabled: false,
    isHidden: false,
  });

  testForm = form(this.testModel, (schema) => {
    required(schema.testNum, { message: requiredMessage });

    // Schema rules driving control state
    disabled(schema.testNum, ({ valueOf }) => valueOf(schema.isDisabled));
    hidden(schema.testNum, ({ valueOf }) => valueOf(schema.isHidden));
  });

  integerOnly = signal<boolean>(true);
  positiveOnly = signal<boolean>(true);

  readonly component = viewChild.required(NumberInput);
}

describe('NumberInput', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let component: NumberInput;
  let inputEl: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, NumberInput],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();

    component = host.component();
    inputEl = fixture.nativeElement.querySelector('input');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Validation Regex Configurations', () => {
    it('should compute regex for positive integers (default)', () => {
      host.integerOnly.set(true);
      host.positiveOnly.set(true);
      fixture.detectChanges();

      const regex = component.fullValidationRegex();
      expect(regex.test('123')).toBe(true);
      expect(regex.test('-123')).toBe(false);
      expect(regex.test('12.3')).toBe(false);
      expect(regex.test('abc')).toBe(false);
    });

    it('should compute regex for negative and positive integers', () => {
      host.integerOnly.set(true);
      host.positiveOnly.set(false);
      fixture.detectChanges();

      const regex = component.fullValidationRegex();
      expect(regex.test('123')).toBe(true);
      expect(regex.test('-123')).toBe(true);
      expect(regex.test('12.3')).toBe(false);
      expect(regex.test('-12.3')).toBe(false);
    });

    it('should compute regex for positive decimals', () => {
      host.integerOnly.set(false);
      host.positiveOnly.set(true);
      fixture.detectChanges();

      const regex = component.fullValidationRegex();

      expect(regex.test('123')).toBe(true);
      expect(regex.test('123.45')).toBe(true);
      expect(regex.test('-123.45')).toBe(false);
    });

    it('should compute regex for negative and positive decimals', () => {
      host.integerOnly.set(false);
      host.positiveOnly.set(false);
      fixture.detectChanges();

      const regex = component.fullValidationRegex();
      expect(regex.test('-123.45')).toBe(true);
      expect(regex.test('123.45')).toBe(true);
      expect(regex.test('-')).toBe(true);
    });
  });

  describe('Keyboard Events (handleKeyDown)', () => {
    it('should allow navigation keys', () => {
      const navKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter', 'Delete', 'Home', 'End'];

      navKeys.forEach((key) => {
        const event = new KeyboardEvent('keypress', { key, cancelable: true });
        const spy = vi.spyOn(event, 'preventDefault');
        inputEl.dispatchEvent(event);

        expect(spy).not.toHaveBeenCalled();
      });
    });

    it('should allow modifier key shortcuts (Ctrl/Cmd)', () => {
      const ctrlEvent = new KeyboardEvent('keypress', { key: 'a', ctrlKey: true, cancelable: true });
      const metaEvent = new KeyboardEvent('keypress', { key: 'v', metaKey: true, cancelable: true });

      const ctrlSpy = vi.spyOn(ctrlEvent, 'preventDefault');
      const metaSpy = vi.spyOn(metaEvent, 'preventDefault');

      inputEl.dispatchEvent(ctrlEvent);
      inputEl.dispatchEvent(metaEvent);

      expect(ctrlSpy).not.toHaveBeenCalled();
      expect(metaSpy).not.toHaveBeenCalled();
    });

    it('should allow valid numeric keypresses', () => {
      const event = new KeyboardEvent('keypress', { key: '5', cancelable: true });
      const spy = vi.spyOn(event, 'preventDefault');

      inputEl.dispatchEvent(event);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should prevent non-numeric keypresses', () => {
      const event = new KeyboardEvent('keypress', { key: 'e', cancelable: true });
      const spy = vi.spyOn(event, 'preventDefault');

      inputEl.dispatchEvent(event);
      expect(spy).toHaveBeenCalled();
    });

    it('should prevent decimal point when integerOnly is true', () => {
      host.integerOnly.set(true);
      fixture.detectChanges();

      const event = new KeyboardEvent('keypress', { key: '.', cancelable: true });
      const spy = vi.spyOn(event, 'preventDefault');

      inputEl.dispatchEvent(event);
      expect(spy).toHaveBeenCalled();
    });

    it('should allow a single decimal point when integerOnly is false', () => {
      host.integerOnly.set(false);
      fixture.detectChanges();

      const event = new KeyboardEvent('keypress', { key: '.', cancelable: true });
      const spy = vi.spyOn(event, 'preventDefault');

      inputEl.dispatchEvent(event);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should prevent a second decimal point when integerOnly is false', () => {
      host.integerOnly.set(false);
      fixture.detectChanges();

      inputEl.value = '12.3';
      inputEl.setSelectionRange(4, 4);

      const event = new KeyboardEvent('keypress', { key: '.', cancelable: true });
      Object.defineProperty(event, 'target', { value: inputEl, enumerable: true });
      const spy = vi.spyOn(event, 'preventDefault');

      component.handleKeyDown(event);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Paste Events (handlePaste)', () => {
    it('should allow valid pasted text', () => {
      const clipboardData = new DataTransfer();
      clipboardData.setData('text', '456');

      const pasteEvent = new ClipboardEvent('paste', { clipboardData, cancelable: true });
      const spy = vi.spyOn(pasteEvent, 'preventDefault');

      inputEl.dispatchEvent(pasteEvent);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should prevent invalid pasted text (letters)', () => {
      const clipboardData = new DataTransfer();
      clipboardData.setData('text', '12a3');

      const pasteEvent = new ClipboardEvent('paste', { clipboardData, cancelable: true });
      const spy = vi.spyOn(pasteEvent, 'preventDefault');

      inputEl.dispatchEvent(pasteEvent);
      expect(spy).toHaveBeenCalled();
    });

    it('should prevent pasting negative numbers when positiveOnly is true', () => {
      host.positiveOnly.set(true);
      fixture.detectChanges();

      const clipboardData = new DataTransfer();
      clipboardData.setData('text', '-100');

      const pasteEvent = new ClipboardEvent('paste', { clipboardData, cancelable: true });
      const spy = vi.spyOn(pasteEvent, 'preventDefault');

      inputEl.dispatchEvent(pasteEvent);
      expect(spy).toHaveBeenCalled();
    });

    it('should handle empty clipboard data gracefully', () => {
      const pasteEvent = new ClipboardEvent('paste', { clipboardData: null, cancelable: true });
      const spy = vi.spyOn(pasteEvent, 'preventDefault');

      inputEl.dispatchEvent(pasteEvent);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('Component State & Template Bindings', () => {
    it('should update touched state on blur', () => {
      expect(component.touched()).toBe(false);

      inputEl.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(component.touched()).toBe(true);
    });

    it('should update component value on input event', () => {
      inputEl.value = '999';
      inputEl.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.value()).toBe('999');
    });

    it('should apply disabled state derived from schema rule', () => {
      host.testModel.update((model) => ({ ...model, isDisabled: true }));
      fixture.detectChanges();

      expect(component.disabled()).toBe(true);
      expect(inputEl.disabled).toBe(true);
      expect(inputEl.classList.contains('p-disabled')).toBe(true);
    });

    it('should apply hidden state derived from schema rule', () => {
      host.testModel.update((model) => ({ ...model, isHidden: true }));
      fixture.detectChanges();

      expect(component.hidden()).toBe(true);
      const hiddenInput = fixture.nativeElement.querySelector('input');
      expect(hiddenInput).toBeNull();
    });

    it('should display error message when touched and invalid', () => {
      inputEl.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      const errorMessage = fixture.nativeElement.querySelector('small.p-error');
      expect(errorMessage).not.toBeNull();
      expect(errorMessage.textContent).toContain(requiredMessage);
      expect(inputEl.classList.contains('p-invalid')).toBe(true);
    });
  });
});
