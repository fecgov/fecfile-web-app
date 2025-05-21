import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { AddressInputComponent } from './address-input.component';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { Component, viewChild } from '@angular/core';

@Component({
  imports: [AddressInputComponent],
  standalone: true,
  template: `<app-address-input
    [form]="form"
    [formSubmitted]="formSubmitted"
    [templateMap]="templateMap"
  ></app-address-input>`,
})
class TestHostComponent {
  templateMap = testTemplateMap;
  form = new FormGroup(
    {
      contributor_street_1: new SubscriptionFormControl(''),
      contributor_street_2: new SubscriptionFormControl(''),
      contributor_city: new SubscriptionFormControl(''),
      contributor_state: new SubscriptionFormControl(''),
      contributor_zip: new SubscriptionFormControl(''),
    },
    { updateOn: 'blur' },
  );
  formSubmiteed = false;

  component = viewChild.required(AddressInputComponent);
}

describe('AddressInputComponent', () => {
  let component: AddressInputComponent;
  let host: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectModule, InputTextModule, ReactiveFormsModule, AddressInputComponent, ErrorMessagesComponent],
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
