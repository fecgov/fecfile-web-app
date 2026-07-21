import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal, viewChild } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { TextAreaInput } from './text-area.input';
import { requiredMessage } from 'app/shared/utils/signal-validator.utils';

@Component({
  standalone: true,
  imports: [TextAreaInput, FormField],
  template: `
    <form novalidate (submit)="$event.preventDefault()">
      <app-text-area-input label="TEST" [formField]="testForm.testText" />
    </form>
  `,
})
class TestHostComponent {
  testModel = signal<{ testText: string }>({ testText: '' });
  testForm = form(this.testModel, (schemaPath) => required(schemaPath.testText, { message: requiredMessage }));
  readonly component = viewChild.required(TextAreaInput);
}

describe('TextAreaInput', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let component: TextAreaInput;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextAreaInput],
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
