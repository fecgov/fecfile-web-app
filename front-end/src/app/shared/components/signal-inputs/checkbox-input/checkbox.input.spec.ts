import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckboxInput } from './checkbox.input';
import { Component, signal, viewChild } from '@angular/core';
import { FormField, form, required } from '@angular/forms/signals';
import { requiredMessage } from 'app/shared/utils/signal-schema.utils';

@Component({
  standalone: true,
  imports: [CheckboxInput, FormField],
  template: `
    <form novalidate (submit)="$event.preventDefault()">
      <app-checkbox-input label="TEST" [formField]="testForm.testCheck" />
    </form>
  `,
})
class TestHostComponent {
  testModel = signal<{ testCheck: boolean }>({ testCheck: false });
  testForm = form(this.testModel, (schemaPath) => required(schemaPath.testCheck, { message: requiredMessage }));
  readonly component = viewChild.required(CheckboxInput);
}

describe('CheckboxInput', () => {
  let component: CheckboxInput;
  let host: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxInput],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    component = host.component();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
