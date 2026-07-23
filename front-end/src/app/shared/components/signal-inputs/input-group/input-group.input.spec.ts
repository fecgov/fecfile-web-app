import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { InputGroupInput } from './input-group.input';
import { form, FormField, metadata, required } from '@angular/forms/signals';
import { requiredMessage, PLACEHOLDER } from 'app/shared/utils/signal-schema.utils';
import { describe, it, expect, beforeEach } from 'vitest';

const placeholderText = 'Enter name...';

@Component({
  standalone: true,
  imports: [InputGroupInput, FormField],
  template: `
    <form novalidate (submit)="$event.preventDefault()">
      <app-input-group
        [formField]="testForm.reportName"
        [pretext]="pretext()"
        id="reportInput"
        label="TEST"
        [labelStyleClass]="customLabelClass()"
      />
    </form>
  `,
})
class TestHostComponent {
  testModel = signal<{ reportName: string }>({ reportName: '' });

  testForm = form(this.testModel, (schemaPath) => {
    required(schemaPath.reportName, { message: requiredMessage });
    metadata(schemaPath.reportName, PLACEHOLDER, () => placeholderText);
  });

  pretext = signal<string | null>('REP-');
  customLabelClass = signal<string>('bold-label');
}

describe('InputGroupInput Component via Host', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, InputGroupInput],
      providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;

    await fixture.whenStable();
  });

  it('should compile successfully', () => {
    const directiveEl = fixture.debugElement.query(By.directive(InputGroupInput));
    expect(directiveEl).toBeTruthy();
  });

  it('should extract placeholder values dynamically from form field metadata configurations', () => {
    const inputEl = fixture.debugElement.query(By.css('input'));
    expect(inputEl.nativeElement.getAttribute('placeholder')).toBe(placeholderText);
  });

  it('should show the pretext string only when the pretext is not null', async () => {
    let pretextEl = fixture.debugElement.query(By.css('span'));
    expect(pretextEl).toBeTruthy();
    expect(pretextEl.nativeElement.textContent).toBe('REP-');

    hostComponent.pretext.set(null);
    await fixture.whenStable();

    pretextEl = fixture.debugElement.query(By.css('span'));
    expect(pretextEl).toBeFalsy();
  });

  it('should trigger the component dirty model state on blur event cycles', async () => {
    const inputDebugEl = fixture.debugElement.query(By.css('input'));
    const controlInstance = fixture.debugElement.query(By.directive(InputGroupInput))
      .componentInstance as InputGroupInput;

    expect(controlInstance.dirty()).toBe(false);

    inputDebugEl.nativeElement.dispatchEvent(new Event('blur'));
    await fixture.whenStable();

    expect(controlInstance.dirty()).toBe(true);
  });

  it('should visually present error validation states conditionally on dirty state or active values', async () => {
    let errorEl = fixture.debugElement.query(By.css('.p-error'));
    expect(errorEl).toBeFalsy();

    const inputDebugEl = fixture.debugElement.query(By.css('input'));
    inputDebugEl.nativeElement.dispatchEvent(new Event('blur'));
    await fixture.whenStable();

    errorEl = fixture.debugElement.query(By.css('.p-error'));
    expect(errorEl).toBeTruthy();
    expect(errorEl.nativeElement.textContent).toContain(requiredMessage);
  });
});
