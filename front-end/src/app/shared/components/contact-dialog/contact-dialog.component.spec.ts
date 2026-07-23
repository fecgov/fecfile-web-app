import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, provideZoneChangeDetection, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { ROUTES } from 'app/routes';
import { Contact, ContactTypeLabels, ContactTypes } from 'app/shared/models/contact.model';
import { LabelPipe } from 'app/shared/pipes/label.pipe';
import { testContact, testMockStore } from 'app/shared/utils/unit-test.utils';
import { Confirmation, ConfirmationService, MessageService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SelectModule } from 'primeng/select';
import { ContactLookupComponent } from '../contact-lookup/contact-lookup.component';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';
import { FecInternationalPhoneInputComponent } from '../fec-international-phone-input/fec-international-phone-input.component';
import { ContactDialogComponent } from './contact-dialog.component';
import { ContactService } from 'app/shared/services/contact.service';
import { LabelUtils } from 'app/shared/utils/label.utils';

@Component({
  imports: [ContactDialogComponent],
  standalone: true,
  template: `<app-contact-dialog
    [(visible)]="visible"
    [availableContactTypes]="contactTypeOptions"
    [contact]="contact()"
  />`,
})
class TestHostComponent {
  component = viewChild.required(ContactDialogComponent);
  visible = signal(false);
  contactTypeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels);
  contact = signal(new Contact());
}

describe('ContactDialogComponent', () => {
  let host: TestHostComponent;
  let component: ContactDialogComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let testConfirmationService: ConfirmationService;

  let contactService: ContactService;
  let messageService: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SelectModule,
        AutoCompleteModule,
        ContactDialogComponent,
        ErrorMessagesComponent,
        FecInternationalPhoneInputComponent,
        ContactLookupComponent,
        LabelPipe,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZoneChangeDetection(),
        ConfirmationService,
        FormBuilder,
        MessageService,
        provideMockStore(testMockStore()),
        provideRouter(ROUTES),
        DatePipe,
        ContactService,
      ],
    }).compileComponents();

    testConfirmationService = TestBed.inject(ConfirmationService);

    contactService = TestBed.inject(ContactService);
    messageService = TestBed.inject(MessageService);
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    component = host.component();
    host.contact.set(testContact());

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open dialog with new or edit contact', () => {
    host.contact.update((c) => Contact.fromJSON({ ...c, id: '123' }));
    host.visible.set(true);
    expect(component.isNewItem()).toBe(false);
    expect(component.contactLookup().contactTypeReadOnly()).toBe(true);

    host.contact.update((c) => Contact.fromJSON({ ...c, id: undefined }));
    host.contactTypeOptions = [{ label: 'org', value: 'ORG' }];
    host.visible.set(true);
    expect(component.contactLookup().contactTypeReadOnly()).toBe(false);
  });

  it('should save contact', async () => {
    const contactEmitSpy = vi.spyOn(component.savedContact, 'emit');
    const messageSpy = vi.spyOn(messageService, 'add');
    const tester = testContact();
    component.submitForm();
    fixture.detectChanges();
    tester.first_name = 'Changed name';
    const updateSpy = vi.spyOn(contactService, 'update').mockResolvedValueOnce(tester);

    component.submitForm();
    fixture.detectChanges();
    expect(contactEmitSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(messageSpy).toHaveBeenCalledTimes(1);
  });

  it('should raise confirmation dialog', () => {
    host.contact.set(new Contact());
    const spy = vi.spyOn(testConfirmationService, 'confirm').mockImplementation((confirmation: Confirmation) => {
      if (confirmation.accept) return confirmation?.accept();
    });
    component.confirmUpdate(host.contact());
    expect(spy).toHaveBeenCalled();
  });

  it('#updateContact happy path', () => {
    const testContact1 = new Contact();
    testContact1.id = 'test_contact_1_id';
    testContact1.type = ContactTypes.ORGANIZATION;

    const testContact2 = new Contact();
    testContact2.id = 'test_contact_2_id';
    testContact2.type = ContactTypes.COMMITTEE;

    host.contact.set(testContact1);

    expect(component.contact()?.id).toBe(testContact1.id);
    expect(component.contact()?.type).toBe(testContact1.type);
    expect(component.form().dirty()).toBe(false);

    component.updateContact(testContact2);

    expect(component.contact()?.id).toBe(testContact2.id);
    expect(component.contact()?.type).toBe(testContact2.type);
    expect(component.form().dirty()).toBe(true);
  });
});
