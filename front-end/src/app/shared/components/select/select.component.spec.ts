import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectComponent } from './select.component';
import { Component, viewChild } from '@angular/core';
import { PrimeOptions } from 'app/shared/utils/label.utils';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { FormGroup, NgControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [SelectComponent, ReactiveFormsModule],
  standalone: true,
  template: `<div [formGroup]="form">
    <app-select label="test" inputId="test" [options]="options" [form]="form" formControlName="testControl" />
  </div>`,
})
class TestHostComponent {
  options: PrimeOptions = [{ label: 'test', value: 'test' }];
  form = new FormGroup({ testControl: new SubscriptionFormControl() });

  component = viewChild.required(SelectComponent);
}

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectComponent],
      providers: [NgControl],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    component = host.component();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should blur on change', async () => {
    const selectEl = fixture.nativeElement.querySelector('select');
    const blurSpy = vi.spyOn(selectEl, 'blur');

    selectEl.dispatchEvent(new Event('change'));

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(blurSpy).toHaveBeenCalled();
  });
});
