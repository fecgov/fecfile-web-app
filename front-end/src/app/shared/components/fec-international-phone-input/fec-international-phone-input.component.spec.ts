/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FecInternationalPhoneInputComponent } from './fec-international-phone-input.component';
import { NgxControlValueAccessor } from 'ngxtension/control-value-accessor';
import { ElementRef } from '@angular/core';

describe('FecInternationalPhoneInputComponent', () => {
  let component: FecInternationalPhoneInputComponent;
  let fixture: ComponentFixture<FecInternationalPhoneInputComponent>;

  let mockInputElement: HTMLInputElement;

  beforeEach(async () => {
    mockInputElement = document.createElement('input');
    mockInputElement.type = 'tel';

    await TestBed.configureTestingModule({
      imports: [FecInternationalPhoneInputComponent],
      providers: [
        {
          provide: NgxControlValueAccessor,
          useValue: {
            value: '',
            value$: jasmine.createSpy('value$').and.returnValue(''),
            markAsTouched: jasmine.createSpy('markAsTouched'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FecInternationalPhoneInputComponent);
    component = fixture.componentInstance;

    // Mock the viewChild input
    (component as any).internationalPhoneInput = () => new ElementRef<HTMLInputElement>(mockInputElement);

    spyOn(mockInputElement, 'addEventListener').and.callFake((event: any, callback: any) => {
      if (event === 'countrychange') {
        // Simulate dial code change
        (component as any).intlTelInput = {
          getSelectedCountryData: () => ({ dialCode: '1' }),
          setNumber: jasmine.createSpy('setNumber'),
          destroy: jasmine.createSpy('destroy'),
        };
        callback(); // trigger the listener
      }
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize intlTelInput and set country code on init', () => {
    component.ngAfterViewInit();

    expect((component as any).intlTelInput?.getSelectedCountryData().dialCode).toBe('1');
  });

  it('should update number signal on keyup event', () => {
    const testValue = '5551234';
    mockInputElement.value = testValue;

    const keyupEvent = new KeyboardEvent('keyup', { key: '4' });
    component.onKey(keyupEvent);

    expect((component as any).number()).toBe(testValue);
  });

  it('should mark control as touched on blur', () => {
    component.onBlur();
    const cva = TestBed.inject(NgxControlValueAccessor);
    expect(cva.markAsTouched).toHaveBeenCalled();
  });

  it('should call destroy on ngOnDestroy', () => {
    component.ngAfterViewInit(); // sets up mock intlTelInput
    component.ngOnDestroy();

    expect((component as any).intlTelInput.destroy).toHaveBeenCalled();
  });
});
