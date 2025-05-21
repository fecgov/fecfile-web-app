import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportContactLookupComponent } from './report-contact-lookup.component';
import { Component, viewChild } from '@angular/core';
import { ContactTypes } from 'app/shared/models';
import { FormGroup } from '@angular/forms';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { provideHttpClient } from '@angular/common/http';

@Component({
  imports: [ReportContactLookupComponent],
  standalone: true,
  template: `<app-report-contact-lookup
    [form]="form"
    [formSubmitted]="formSubmitted"
    [key]="key"
    [contactType]="contactType"
  ></app-report-contact-lookup>`,
})
class TestHostComponent {
  key = 'contact_1';
  contactType = ContactTypes.INDIVIDUAL;
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

  component = viewChild.required(ReportContactLookupComponent);
}

describe('ReportContactLookupComponent', () => {
  let component: ReportContactLookupComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportContactLookupComponent],
      providers: [provideHttpClient()],
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
