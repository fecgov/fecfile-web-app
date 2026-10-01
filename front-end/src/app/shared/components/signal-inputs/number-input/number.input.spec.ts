import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NumberInput, validateYear, integer } from './number.input';
import { Component, signal, viewChild } from '@angular/core';
import { disabled, form, FormField, hidden, required } from '@angular/forms/signals';
import { requiredMessage } from 'app/shared/utils/signal-schema.utils';

interface TestFormModel {
  testNum: number | null;
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
        [minValue]="minValue()"
        [minlength]="minlength()"
        [maxlength]="maxlength()"
      />
    </form>
  `,
})
class TestHostComponent {
  testModel = signal<TestFormModel>({
    testNum: 0,
    isDisabled: false,
    isHidden: false,
  });

  testForm = form(this.testModel, (schema) => {
    required(schema.testNum, { message: requiredMessage });
    disabled(schema.testNum, ({ valueOf }) => valueOf(schema.isDisabled));
    hidden(schema.testNum, ({ valueOf }) => valueOf(schema.isHidden));
  });

  minValue = signal<number | undefined>(undefined);
  minlength = signal<number | null>(null);
  maxlength = signal<number | null>(null);

  readonly component = viewChild.required(NumberInput);
}

describe('NumberInput', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let component: NumberInput;
  let innerInputEl: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, NumberInput],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();

    component = host.component();
    innerInputEl = fixture.nativeElement.querySelector('input.p-inputtext');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component State & Template Bindings', () => {
    it('should update touched state on PrimeNG onBlur', () => {
      expect(component.touched()).toBe(false);

      innerInputEl.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(component.touched()).toBe(true);
    });

    it('should update component value when model updates', async () => {
      host.testModel.update((m) => ({ ...m, testNum: 999 }));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.value()).toBe(999);
    });

    it('should apply disabled state derived from schema rule', async () => {
      host.testModel.update((model) => ({ ...model, isDisabled: true }));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.disabled()).toBe(true);
      expect(innerInputEl.disabled).toBe(true);
    });

    it('should apply hidden state derived from schema rule', () => {
      host.testModel.update((model) => ({ ...model, isHidden: true }));
      fixture.detectChanges();

      expect(component.hidden()).toBe(true);
      const renderedInput = fixture.nativeElement.querySelector('p-inputnumber');
      expect(renderedInput).toBeNull();
    });

    it('should display error message when touched and invalid', async () => {
      host.testModel.update((model) => ({ ...model, testNum: null }));
      fixture.detectChanges();

      innerInputEl.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      await fixture.whenStable();

      const errorMessage = fixture.nativeElement.querySelector('small.p-error');
      expect(errorMessage).not.toBeNull();
      expect(errorMessage.textContent).toContain(requiredMessage);
    });

    it('should pass minlength, maxlength, and minValue inputs to p-inputnumber', async () => {
      host.minlength.set(2);
      host.maxlength.set(4);
      host.minValue.set(10);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.minlength()).toBe(2);
      expect(component.maxlength()).toBe(4);
      expect(component.minValue()).toBe(10);
    });
  });

  const yearFormatMessage = 'This field requires a 4-digit year (YYYY).';
  describe('Schema Validation Helpers', () => {
    it('validateYear should enforce 4-digit bounds', () => {
      TestBed.runInInjectionContext(() => {
        const model = signal<TestFormModel>({
          testNum: 2026,
          isDisabled: false,
          isHidden: false,
        });
        const testForm = form(model, (schema) => {
          validateYear(schema.testNum);
        });

        expect(testForm.testNum().errors()).toEqual([]);

        testForm.testNum().value.set(999);
        expect(testForm.testNum().errors()[0]?.message).toBe(yearFormatMessage);

        testForm.testNum().value.set(10000);
        expect(testForm.testNum().errors()[0]?.message).toBe(yearFormatMessage);
      });
    });

    it('integer should validate whole numbers', () => {
      TestBed.runInInjectionContext(() => {
        const model = signal<TestFormModel>({
          testNum: 10,
          isDisabled: false,
          isHidden: false,
        });
        const testForm = form(model, (schema) => {
          integer(schema.testNum);
        });

        expect(testForm.testNum().errors()).toEqual([]);

        testForm.testNum().value.set(10.5);

        expect(testForm.testNum().errors()[0]).toEqual(
          expect.objectContaining({
            kind: 'integer',
            message: 'Value must be a whole number',
          }),
        );

        testForm.testNum().value.set(null);
        expect(testForm.testNum().errors()).toEqual([]);
      });
    });
  });
});
