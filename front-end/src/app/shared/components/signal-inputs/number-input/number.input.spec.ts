import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NumberInput } from './number.input';
import { Component, signal, viewChild } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';

@Component({
  standalone: true,
  imports: [NumberInput, FormField],
  template: `
    <form novalidate (submit)="$event.preventDefault()">
      <app-number-input label="TEST" [formField]="testForm.testNum" />
    </form>
  `,
})
class TestHostComponent {
  testModel = signal<{ testNum: string }>({ testNum: '' });
  testForm = form(this.testModel, (schemaPath) => required(schemaPath.testNum));
  readonly component = viewChild.required(NumberInput);
}

describe('NumberInput', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let component: NumberInput;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumberInput],
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
