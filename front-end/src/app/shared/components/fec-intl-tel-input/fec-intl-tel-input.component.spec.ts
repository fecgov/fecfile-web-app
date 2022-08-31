/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FecIntlTelInputComponent } from './fec-intl-tel-input.component';

describe('FecIntlTelInputComponent', () => {
  let component: FecIntlTelInputComponent;
  let fixture: ComponentFixture<FecIntlTelInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FecIntlTelInputComponent],
      providers: [],
      imports: [FormsModule, ReactiveFormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FecIntlTelInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('writeValue() happy path', () => {
    const setNumberSpy = spyOn<any>(component['iti'], 'setNumber');
    const onChangeSpy = spyOn<any>(component, 'onChange');
    const testString = 'testString';
    component.writeValue(testString);

    expect(setNumberSpy).toHaveBeenCalledOnceWith(testString);
    expect(onChangeSpy).toHaveBeenCalledOnceWith(testString);
  });

  it('registerOnChange() happy path', () => {
    const testFunction = () => { return; };
    component.registerOnChange(testFunction);
    const onChangeSpy = spyOn<any>(component, 'onChange');
    const testValue = 'testValue';
    const testTarget = { value: testValue } as HTMLInputElement;
    const testEvent = { target: testTarget } as unknown as KeyboardEvent;
    component.onKey(testEvent);
    expect(onChangeSpy).toHaveBeenCalledOnceWith('+' +
      component['countryCode'] + ' ' + component['number']);
  });

  it('onKey() happy path', () => {
    const onChangeSpy = spyOn<any>(component, 'onChange');
    const testValue = 'testValue';
    const testTarget = { value: testValue } as HTMLInputElement;
    const testEvent = { target: testTarget } as unknown as KeyboardEvent;
    component.onKey(testEvent);

    expect(component['number']).toEqual(testValue)
    expect(onChangeSpy).toHaveBeenCalledOnceWith('+' +
      component['countryCode'] + ' ' + component['number']);
  });

  it('afterViewInit() happy path', fakeAsync(() => {
    const testDialCode = '123';
    spyOn<any>(component['iti'],
      'getSelectedCountryData').and.returnValue({ dialCode: testDialCode });
    const onChangeSpy = spyOn<any>(component, 'onChange');

    component.telInput?.nativeElement.dispatchEvent(new Event('countrychange'));
    tick();
    expect(component['countryCode']).toEqual(testDialCode);
    expect(onChangeSpy).toHaveBeenCalledOnceWith('+' +
      testDialCode + ' ' + component['number']);
  }));

});
