import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, viewChild } from '@angular/core';
import { ContactTypes } from 'app/shared/models';
import { FormGroup } from '@angular/forms';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { provideHttpClient } from '@angular/common/http';
import { ContactManagementService } from 'app/shared/services/contact-management.service';
import { ReportContactLookupComponent } from './report-contact-lookup.component';

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
  formSubmitted = false;

  component = viewChild.required(ReportContactLookupComponent);
}

describe('ReportContactLookupComponent', () => {
  let component: ReportContactLookupComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let contactManagementService: ContactManagementService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    component = host.component();

    contactManagementService = TestBed.inject(ContactManagementService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and set contact type on manager', () => {
    const manager = contactManagementService.get(host.key);
    const setAsSingleSpy = spyOn(manager, 'setAsSingle');

    component.ngOnInit();

    expect(component.manager().contactType()).toBe(host.contactType);
    expect(setAsSingleSpy).toHaveBeenCalledOnceWith(host.contactType);
  });

  it('should open dialog and set active key in service', () => {
    component.openDialog();

    expect(contactManagementService.activeKey()).toBe(host.key);
    expect(contactManagementService.showDialog()).toBeTrue();
  });
});
