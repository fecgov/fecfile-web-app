import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PrimeOptions } from 'app/shared/utils/label.utils';
import { SelectButtonInput } from './select-button.input';
import { form, FormField, required } from '@angular/forms/signals';
import { requiredMessage } from 'app/shared/utils/signal-schema.utils';
import { describe, it, expect, beforeEach } from 'vitest';

@Component({
  standalone: true,
  imports: [SelectButtonInput, FormField],
  template: `
    <form novalidate (submit)="$event.preventDefault()">
      <app-select-button-input
        [options]="mockOptions"
        labelId="test-btn-label"
        label="Do you agree?"
        [labelStyleClass]="customStyleClass()"
        [formField]="testForm.agree"
      />
    </form>
  `,
})
class TestHostComponent {
  mockOptions: PrimeOptions = [
    { label: 'Yes', value: 'YES' },
    { label: 'No', value: 'NO' },
  ];
  testModel = signal<{ agree: string | null }>({ agree: null });
  testForm = form(this.testModel, (schemaPath) => required(schemaPath.agree, { message: requiredMessage }));
  customStyleClass = signal<string | undefined>(undefined);
}

describe('SelectButtonInput Component via Host', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, SelectButtonInput],
      providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should compile successfully', () => {
    const inputDirective = fixture.debugElement.query(By.directive(SelectButtonInput));
    expect(inputDirective).toBeTruthy();
  });

  it('should display the correct label text', () => {
    const labelEl = fixture.debugElement.query(By.css('span'));
    expect(labelEl.nativeElement.textContent).toBe('Do you agree?');
  });

  it('should apply the fallback label class when labelStyleClass is not provided', () => {
    const labelEl = fixture.debugElement.query(By.css('span'));
    expect(labelEl.nativeElement.classList.contains('span-label')).toBe(true);
  });

  it('should apply a custom label class when labelStyleClass is provided', async () => {
    hostComponent.customStyleClass.set('custom-bold-label');
    await fixture.whenStable();

    const labelEl = fixture.debugElement.query(By.css('span'));
    expect(labelEl.nativeElement.classList.contains('custom-bold-label')).toBe(true);
    expect(labelEl.nativeElement.classList.contains('span-label')).toBe(false);
  });

  it('should forward structural options down to PrimeNG p-selectbutton', () => {
    const pSelectBtnEl = fixture.debugElement.query(By.css('p-selectbutton'));
    expect(pSelectBtnEl).toBeTruthy();
    expect(pSelectBtnEl.componentInstance.options).toEqual(hostComponent.mockOptions);
  });

  it('should allow bidirectional updates via the formField signal value', async () => {
    hostComponent.testForm.agree().value.set('YES');
    await fixture.whenStable();

    const pSelectBtnEl = fixture.debugElement.query(By.css('p-selectbutton'));
    expect(pSelectBtnEl.componentInstance.value).toBe('YES');
  });

  it('should visually reveal the validation error string strictly when dirty and invalid are true', async () => {
    let errorEl = fixture.debugElement.query(By.css('.p-error'));
    expect(errorEl).toBeFalsy();

    hostComponent.testForm.agree().markAsDirty();
    await fixture.whenStable();
    errorEl = fixture.debugElement.query(By.css('.p-error'));
    expect(errorEl).toBeTruthy();
    expect(errorEl.nativeElement.textContent).toContain(requiredMessage);

    hostComponent.testForm.agree().value.set('NO');
    await fixture.whenStable();
    errorEl = fixture.debugElement.query(By.css('.p-error'));
    expect(errorEl).toBeFalsy();
  });
});
