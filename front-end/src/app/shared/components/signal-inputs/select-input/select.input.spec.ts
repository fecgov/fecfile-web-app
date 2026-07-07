import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PrimeOptions } from 'app/shared/utils/label.utils';
import { SelectInput } from './select.input';
import { form, FormField, required } from '@angular/forms/signals';
import { requiredMessage } from 'app/shared/utils/signal-schema.utils';

@Component({
  standalone: true,
  imports: [SelectInput, FormField],
  template: `
    <form novalidate (submit)="$event.preventDefault()">
      <app-select-input [options]="mockOptions" [formField]="testForm.test" label="TEST">
        <ng-template #selectedItem let-selectedOption>
          <span class="custom-selected">SELECTED: {{ selectedOption?.label }}</span>
        </ng-template>

        <ng-template #item let-option>
          <span class="custom-option">OPTION: {{ option?.label }}</span>
        </ng-template>
      </app-select-input>
    </form>
  `,
})
class TestHostComponent {
  mockOptions: PrimeOptions = [
    { label: 'Option A', value: 'A' },
    { label: 'Option B', value: 'B' },
  ];
  testModel = signal<{ test: string }>({
    test: '',
  });
  testForm = form(this.testModel, (schemaPath) => required(schemaPath.test, { message: requiredMessage }));
  component = viewChild.required<SelectInput>('component');
}

describe('SelectInput Component via Host', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, SelectInput],
      providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile the component successfully', () => {
    const wrapperDebugElement = fixture.debugElement.query(By.directive(SelectInput));
    expect(wrapperDebugElement).toBeTruthy();
  });

  it('should correctly project and render the custom selectedItem template', async () => {
    hostComponent.testForm.test().value.set('A');
    await fixture.whenStable();
    const selectedEl = fixture.debugElement.query(By.css('.custom-selected'));
    expect(selectedEl).toBeTruthy();
    expect(selectedEl.nativeElement.textContent).toContain('SELECTED: Option A');
  });

  it('should hide errors initially and display them strictly when touched and invalid are true', () => {
    let errorEl = fixture.debugElement.query(By.css('.p-error'));
    expect(errorEl).toBeFalsy();

    hostComponent.testForm.test().markAsTouched();
    fixture.detectChanges();
    errorEl = fixture.debugElement.query(By.css('.p-error'));
    expect(errorEl).toBeTruthy();
    expect(errorEl.nativeElement.textContent).toContain(requiredMessage);

    hostComponent.testForm.test().value.set('A');
    fixture.detectChanges();
    errorEl = fixture.debugElement.query(By.css('.p-error'));
    expect(errorEl).toBeFalsy();
  });
});
