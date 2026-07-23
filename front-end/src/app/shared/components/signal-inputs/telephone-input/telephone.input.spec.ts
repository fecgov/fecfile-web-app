import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TelephoneInput, validateTelephone } from './telephone.input';
import { Component, signal, viewChild } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';

@Component({
  standalone: true,
  imports: [TelephoneInput, FormField],
  template: `
    <form novalidate (submit)="$event.preventDefault()">
      <app-telephone-input label="TEST" [formField]="form.telephone" />
    </form>
  `,
})
class TestHostComponent {
  model = signal<{ telephone: string }>({ telephone: '' });
  form = form(this.model, (schemaPath) => validateTelephone(schemaPath.telephone));
  readonly component = viewChild.required(TelephoneInput);
}

describe('TelephoneInput', () => {
  let host: TestHostComponent;
  let component: TelephoneInput;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelephoneInput],
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
