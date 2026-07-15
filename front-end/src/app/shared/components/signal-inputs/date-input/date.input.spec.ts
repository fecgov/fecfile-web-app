import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal, viewChild } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { requiredMessage } from 'app/shared/utils/signal-schema.utils';
import { DateInput, StringDate, validateDate } from './date.input';

@Component({
  standalone: true,
  imports: [DateInput, FormField],
  template: `
    <form novalidate (submit)="$event.preventDefault()">
      <app-date-input label="TEST" [formField]="testForm.testDate" />
    </form>
  `,
})
class TestHostComponent {
  testModel = signal<{ testDate: StringDate }>({ testDate: null });
  testForm = form(this.testModel, (schemaPath) => {
    required(schemaPath.testDate, { message: requiredMessage });
    validateDate(schemaPath.testDate);
  });
  readonly component = viewChild.required(DateInput);
}

describe('DateInput', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let component: DateInput;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateInput],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    component = hostComponent.component();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
