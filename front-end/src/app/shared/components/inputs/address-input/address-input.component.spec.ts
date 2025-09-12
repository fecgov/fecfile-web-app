import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { AddressInputComponent } from './address-input.component';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { Component, viewChild } from '@angular/core';

const testTemplateMap = {
  street_1: 'street_1',
  street_2: 'street_2',
  city: 'city',
  state: 'state',
  zip: 'zip',
  secondary_street_1: 'secondary_street_1',
  secondary_street_2: 'secondary_street_2',
  secondary_city: 'secondary_city',
  secondary_state: 'secondary_state',
  secondary_zip: 'secondary_zip',
};

@Component({
  imports: [AddressInputComponent],
  standalone: true,
  template: `<app-address-input
    [form]="form"
    [formSubmitted]="formSubmitted"
    [templateMap]="templateMap"
    [templateMapKeyPrefix]="templateMapKeyPrefix"
    [keyPrefix]="keyPrefix"
  />`,
})
class TestHostComponent {
  templateMap = testTemplateMap;
  form = new FormGroup(
    {
      street_1: new SubscriptionFormControl(''),
      street_2: new SubscriptionFormControl(''),
      city: new SubscriptionFormControl(''),
      state: new SubscriptionFormControl(''),
      zip: new SubscriptionFormControl(''),
      secondary_street_1: new SubscriptionFormControl(''),
      secondary_street_2: new SubscriptionFormControl(''),
      secondary_city: new SubscriptionFormControl(''),
      secondary_state: new SubscriptionFormControl(''),
      secondary_zip: new SubscriptionFormControl(''),
      subordinate_street_1: new SubscriptionFormControl(''),
      subordinate_street_2: new SubscriptionFormControl(''),
      subordinate_city: new SubscriptionFormControl(''),
      subordinate_state: new SubscriptionFormControl(''),
      subordinate_zip: new SubscriptionFormControl(''),
    },
    { updateOn: 'blur' },
  );
  formSubmitted = false;
  templateMapKeyPrefix: 'secondary' | 'signatory_1' | 'signatory_2' | 'candidate' | null = null;
  keyPrefix: 'subordinate' | null = null;

  component = viewChild.required(AddressInputComponent);
}

describe('AddressInputComponent', () => {
  let component: AddressInputComponent;
  let host: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectModule, InputTextModule, ReactiveFormsModule, TestHostComponent, ErrorMessagesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    component = host.component();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute field names based on templateMap', () => {
    // Default computation
    expect(component.streetOneFieldName()).toBe('street_1');
    expect(component.streetTwoFieldName()).toBe('street_2');
    expect(component.cityFieldName()).toBe('city');
    expect(component.stateFieldName()).toBe('state');
    expect(component.zipFieldName()).toBe('zip');
  });

  it('should compute field names with secondary prefix', () => {
    host.templateMapKeyPrefix = 'secondary';
    fixture.detectChanges();

    expect(component.streetOneFieldName()).toBe('secondary_street_1');
    expect(component.streetTwoFieldName()).toBe('secondary_street_2');
    expect(component.cityFieldName()).toBe('secondary_city');
    expect(component.stateFieldName()).toBe('secondary_state');
    expect(component.zipFieldName()).toBe('secondary_zip');
  });

  it('should compute field names with keyPrefix', () => {
    host.keyPrefix = 'subordinate';
    fixture.detectChanges();

    expect(component.streetOneFieldName()).toBe('subordinate_street_1');
    expect(component.streetTwoFieldName()).toBe('subordinate_street_2');
    expect(component.cityFieldName()).toBe('subordinate_city');
    expect(component.stateFieldName()).toBe('subordinate_state');
    expect(component.zipFieldName()).toBe('subordinate_zip');
  });
});
