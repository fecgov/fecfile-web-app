/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { AddressInputComponent } from './address-input.component';
import { SignalFormControl } from 'app/shared/utils/signal-form-control';
import { Injector } from '@angular/core';
import { createSignal } from '@angular/core/primitives/signals';

describe('AddressInputComponent', () => {
  let component: AddressInputComponent;
  let fixture: ComponentFixture<AddressInputComponent>;
  let injector: Injector;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectModule, InputTextModule, ReactiveFormsModule, AddressInputComponent, ErrorMessagesComponent],
    }).compileComponents();

    injector = TestBed.inject(Injector);

    fixture = TestBed.createComponent(AddressInputComponent);
    component = fixture.componentInstance;
    (component.form as any) = createSignal(
      new FormGroup(
        {
          contributor_street_1: new SignalFormControl(injector, ''),
          contributor_street_2: new SignalFormControl(injector, ''),
          contributor_city: new SignalFormControl(injector, ''),
          contributor_state: new SignalFormControl(injector, ''),
          contributor_zip: new SignalFormControl(injector, ''),
        },
        { updateOn: 'blur' },
      ),
    );
    (component.templateMap as any) = createSignal(testTemplateMap);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
