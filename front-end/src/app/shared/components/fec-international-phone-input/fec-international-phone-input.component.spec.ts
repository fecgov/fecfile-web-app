/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, NgControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FecInternationalPhoneInputComponent } from './fec-international-phone-input.component';
import { Component, viewChild } from '@angular/core';
import { Country } from 'intl-tel-input/data';

class MockNgControl extends NgControl {
  control = new FormControl<string | undefined>('', Validators.pattern(/^\+\d{1,3} \d{10}$/));

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  viewToModelUpdate(value: any): void {
    // No-op for testing
  }
}

@Component({
  imports: [FecInternationalPhoneInputComponent],
  standalone: true,
  template: `<app-fec-international-phone-input />`,
})
class TestHostComponent {
  component = viewChild.required(FecInternationalPhoneInputComponent);
}

describe('FecInternationalPhoneInputComponent', () => {
  let component: FecInternationalPhoneInputComponent;
  let host: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: NgControl, useClass: MockNgControl }],
      imports: [FormsModule, ReactiveFormsModule, FecInternationalPhoneInputComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    component = host.component();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('writeValue() happy path', () => {
    const setNumberSpy = vi.spyOn(component['intlTelInput']!, 'setNumber');
    const onChangeSpy = vi.spyOn(component, 'onChange');
    const testString = 'testString';
    component.writeValue(testString);

    expect(setNumberSpy).toHaveBeenCalledTimes(1);

    expect(setNumberSpy).toHaveBeenCalledWith(testString);
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenCalledWith(testString);
  });

  it('registerOnChange() happy path', () => {
    const testFunction = () => {
      return;
    };
    component.registerOnChange(testFunction);
    const onChangeSpy = vi.spyOn(component, 'onChange');
    const testValue = 'testValue';
    const testTarget = { value: testValue } as HTMLInputElement;
    const testEvent = { target: testTarget } as unknown as KeyboardEvent;
    component.onKey(testEvent);
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenCalledWith('+' + component['countryCode'] + ' ' + component['number']);
  });

  it('onKey() happy path', () => {
    const onChangeSpy = vi.spyOn(component, 'onChange');
    const testValue = 'testValue';
    const testTarget = { value: testValue } as HTMLInputElement;
    const testEvent = { target: testTarget } as unknown as KeyboardEvent;
    component.onKey(testEvent);
    fixture.detectChanges();

    expect(component['number']).toEqual(testValue);
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenCalledWith('+' + component['countryCode'] + ' ' + component['number']);
  });

  it('afterViewInit() happy path', () => {
    const testDialCode = '123';
    vi.spyOn(component['intlTelInput']!, 'getSelectedCountryData').mockReturnValue({
      dialCode: testDialCode,
    } as Country);
    const onChangeSpy = vi.spyOn(component, 'onChange');

    component.internationalPhoneInputChild()?.nativeElement.dispatchEvent(new Event('countrychange'));
    fixture.detectChanges();
    expect(component['countryCode']).toEqual(testDialCode);
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenCalledWith('+' + testDialCode + ' ' + component['number']);
  });

  it('should blur properly', () => {
    const control = (component.ngControl as MockNgControl).control;

    vi.spyOn(control, 'setValue');
    vi.spyOn(control, 'markAsTouched');
    vi.spyOn(control, 'markAsDirty');
    vi.spyOn(control, 'updateValueAndValidity');

    let event: FocusEvent = {
      target: { value: '' } as HTMLInputElement,
    } as unknown as FocusEvent;

    component.onBlur(event);
    expect(control.setValue).toHaveBeenCalledWith(null, { emitEvent: false });
    expect(control.markAsTouched).toHaveBeenCalled();
    expect(control.markAsDirty).toHaveBeenCalled();
    expect(control.updateValueAndValidity).toHaveBeenCalled();
    expect(control.valid).toBe(true);

    event = {
      target: { value: '123' } as HTMLInputElement,
    } as unknown as FocusEvent;

    component.onBlur(event);
    expect(control.setValue).toHaveBeenCalledWith('+1 123', { emitEvent: false });
    expect(control.valid).toBe(false);
  });
});
