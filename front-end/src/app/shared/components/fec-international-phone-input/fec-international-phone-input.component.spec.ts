/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormsModule, NgControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FecInternationalPhoneInputComponent } from './fec-international-phone-input.component';
import { ElementRef } from '@angular/core';

class MockNgControl extends NgControl {
  control = new FormControl<string | undefined>('', Validators.pattern(/^\+\d{1,3} \d{10}$/));

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  viewToModelUpdate(value: any): void {
    // No-op for testing
  }
}

describe('FecInternationalPhoneInputComponent', () => {
  let component: FecInternationalPhoneInputComponent;
  let fixture: ComponentFixture<FecInternationalPhoneInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FecInternationalPhoneInputComponent],
      providers: [{ provide: NgControl, useClass: MockNgControl }],
      imports: [FormsModule, ReactiveFormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FecInternationalPhoneInputComponent);
    component = fixture.componentInstance;
    component.internationalPhoneInputChild = new ElementRef(document.createElement('input'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('writeValue() happy path', () => {
    const setNumberSpy = spyOn<any>(component['intlTelInput'], 'setNumber');
    const onChangeSpy = spyOn<any>(component, 'onChange');
    const testString = 'testString';
    component.writeValue(testString);

    expect(setNumberSpy).toHaveBeenCalledOnceWith(testString);
    expect(onChangeSpy).toHaveBeenCalledOnceWith(testString);
  });

  it('registerOnChange() happy path', () => {
    const testFunction = () => {
      return;
    };
    component.registerOnChange(testFunction);
    const onChangeSpy = spyOn<any>(component, 'onChange');
    const testValue = 'testValue';
    const testTarget = { value: testValue } as HTMLInputElement;
    const testEvent = { target: testTarget } as unknown as KeyboardEvent;
    component.onKey(testEvent);
    expect(onChangeSpy).toHaveBeenCalledOnceWith('+' + component['countryCode'] + ' ' + component['number']);
  });

  it('onKey() happy path', () => {
    const onChangeSpy = spyOn<any>(component, 'onChange');
    const testValue = 'testValue';
    const testTarget = { value: testValue } as HTMLInputElement;
    const testEvent = { target: testTarget } as unknown as KeyboardEvent;
    component.onKey(testEvent);

    expect(component['number']).toEqual(testValue);
    expect(onChangeSpy).toHaveBeenCalledOnceWith('+' + component['countryCode'] + ' ' + component['number']);
  });

  it('afterViewInit() happy path', fakeAsync(() => {
    const testDialCode = '123';
    spyOn<any>(component['intlTelInput'], 'getSelectedCountryData').and.returnValue({ dialCode: testDialCode });
    const onChangeSpy = spyOn<any>(component, 'onChange');

    component.internationalPhoneInputChild?.nativeElement.dispatchEvent(new Event('countrychange'));
    tick();
    expect(component['countryCode']).toEqual(testDialCode);
    expect(onChangeSpy).toHaveBeenCalledOnceWith('+' + testDialCode + ' ' + component['number']);
  }));

  it('should blur properly', () => {
    component.ngControl = new MockNgControl();
    const control = (component.ngControl as MockNgControl).control;

    spyOn(control, 'setValue').and.callThrough();
    spyOn(control, 'markAsTouched').and.callThrough();
    spyOn(control, 'markAsDirty').and.callThrough();
    spyOn(control, 'updateValueAndValidity').and.callThrough();

    let event: FocusEvent = {
      target: { value: '' } as HTMLInputElement,
    } as unknown as FocusEvent;

    component.onBlur(event);
    expect(control.setValue).toHaveBeenCalledWith(undefined, { emitEvent: false });
    expect(control.markAsTouched).toHaveBeenCalled();
    expect(control.markAsDirty).toHaveBeenCalled();
    expect(control.updateValueAndValidity).toHaveBeenCalled();
    expect(control.valid).toBeTrue();

    event = {
      target: { value: '123' } as HTMLInputElement,
    } as unknown as FocusEvent;

    component.onBlur(event);
    expect(control.setValue).toHaveBeenCalledWith('+1 123', { emitEvent: false });
    expect(control.valid).toBeFalse();
  });
});
