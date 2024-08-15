/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { FecInternationalPhoneInputComponent } from './fec-international-phone-input.component';
import { By } from '@angular/platform-browser';
import { PhoneNumber } from 'google-libphonenumber';

class MockNgControl extends NgControl {
  control = {
    setErrors: jasmine.createSpy('setErrors'),
    setValue: jasmine.createSpy('setValue'),
    markAsTouched: jasmine.createSpy('markAsTouched'),
    markAsDirty: jasmine.createSpy('markAsDirty'),
  } as any;
  /* eslint-disable @typescript-eslint/no-unused-vars */
  viewToModelUpdate(newValue: any): void {}
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

  it('should validate phone numbers using google validator', () => {
    component.countryCode = '1';
    const phone = new PhoneNumber();
    phone.setCountryCode(1);
    phone.setExtension('1');
    const phoneParseSpy = spyOn(component.phoneNumberUtil, 'parseAndKeepRawInput').and.returnValue(phone);
    const phoneValidSpy = spyOn(component.phoneNumberUtil, 'isValidNumber');
    const testValue = '+1 123';
    component.validatePhoneNumber(testValue);
    expect(phoneParseSpy).toHaveBeenCalledWith(testValue, '1');
    expect(phoneValidSpy).toHaveBeenCalledWith(phone);
  });

  it('should validate phone number correctly', () => {
    const validNumber = '+1 650-253-0000'; // Example valid number
    const invalidNumber = '+1 123-456-7890'; // Example invalid number

    expect(component.validatePhoneNumber(validNumber)).toBeTrue();
    expect(component.validatePhoneNumber(invalidNumber)).toBeFalse();
  });

  it('should handle blur event correctly', () => {
    component.ngControl = new MockNgControl();
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    const event = new FocusEvent('blur');
    inputElement.value = '650-253-0000'; // Example valid number

    spyOn(component, 'validatePhoneNumber').and.returnValue(true);

    inputElement.dispatchEvent(event);
    fixture.detectChanges();

    expect(component.ngControl.control?.setValue).toHaveBeenCalledWith('+1 650-253-0000', { emitEvent: false });
    expect(component.ngControl.control?.setErrors).toHaveBeenCalledWith(null);
    expect(component.ngControl.control?.markAsTouched).toHaveBeenCalled();
    expect(component.ngControl.control?.markAsDirty).toHaveBeenCalled();
  });
});
