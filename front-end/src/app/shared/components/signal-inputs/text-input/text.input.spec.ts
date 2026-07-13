import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal, viewChild } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { requiredMessage } from 'app/shared/utils/signal-schema.utils';
import { TextInput } from './text.input';

@Component({
  standalone: true,
  imports: [TextInput, FormField],
  template: `
    <form novalidate (submit)="$event.preventDefault()">
      <app-text-input label="TEST" [formField]="testForm.testText" />
    </form>
  `,
})
class TestHostComponent {
  testModel = signal<{ testText: string }>({ testText: '' });
  testForm = form(this.testModel, (schemaPath) => required(schemaPath.testText, { message: requiredMessage }));
  readonly component = viewChild.required(TextInput);
}

describe('TextInput', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let component: TextInput;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextInput],
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
