/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';

import { SignatureInputComponent } from './signature-input.component';
import { testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { SignalFormControl } from 'app/shared/utils/signal-form-control';
import { Injector } from '@angular/core';
import { createSignal } from '@angular/core/primitives/signals';

describe('SignatureInputComponent', () => {
  let component: SignatureInputComponent;
  let fixture: ComponentFixture<SignatureInputComponent>;
  let injector: Injector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SignatureInputComponent],
    });
    fixture = TestBed.createComponent(SignatureInputComponent);
    component = fixture.componentInstance;
    injector = TestBed.inject(Injector);

    // Set up component with form control
    const form = new FormGroup(
      {
        authorized_last_name: new SignalFormControl(injector),
        authorized_first_name: new SignalFormControl(injector),
        authorized_middle_name: new SignalFormControl(injector),
        authorized_prefix: new SignalFormControl(injector),
        authorized_suffix: new SignalFormControl(injector),
        authorized_title: new SignalFormControl(injector),
        authorized_date_signed: new SignalFormControl(injector),
      },
      { updateOn: 'blur' },
    );
    (component.form as any) = createSignal(form);
    (component.templateMapKeyPrefix as any) = createSignal('signatory_2');
    (component.templateMap as any) = createSignal({
      ...testTemplateMap,
      ...{
        signatory_2_last_name: 'authorized_last_name',
        signatory_2_first_name: 'authorized_first_name',
        signatory_2_middle_name: 'authorized_middle_name',
        signatory_2_prefix: 'authorized_prefix',
        signatory_2_suffix: 'authorized_suffix',
        signatory_2_title: 'authorized_title',
        signatory_2_date: 'authorized_date_signed',
      },
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
