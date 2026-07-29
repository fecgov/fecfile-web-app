import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
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
import { Component, signal, viewChild } from '@angular/core';
import { LabelUtils } from 'app/shared/utils/label.utils';

@Component({
  imports: [ContactDialogComponent],
  standalone: true,
  template: `<app-contact-dialog [(contact)]="contact" [contactTypeOptions]="contactTypeOptions" />`,
})
class TestHostComponent {
  component = viewChild.required(ContactDialogComponent);
  contact = signal(new Contact());
  contactTypeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels);
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
        ConfirmationService,
        FormBuilder,
        MessageService,
        provideMockStore(testMockStore()),
        ContactService,
      ],
    }).compileComponents();

    testConfirmationService = TestBed.inject(ConfirmationService);

    contactService = TestBed.inject(ContactService);
    messageService = TestBed.inject(MessageService);
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    component = host.component();
    component.contact.set(testContact());

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog with flags set', () => {
    component.visible.set(true);
    component.dialogVisible.set(true);
    component.closeDialog();
    expect(component.visible()).toBe(false);
    expect(component.dialogVisible()).toBe(false);
  });

  it('should save contact', async () => {
    const contactEmitSpy = vi.spyOn(component.savedContact, 'emit');
    const messageSpy = vi.spyOn(messageService, 'add');
    const tester = testContact();
    component.updateContact(tester);
    fixture.detectChanges();
    tester.first_name = 'Changed name';
    const updateSpy = vi.spyOn(contactService, 'update').mockResolvedValueOnce(tester);

    await component.saveContact(false);
    fixture.detectChanges();
    expect(contactEmitSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(messageSpy).toHaveBeenCalledTimes(1);
  });

  it('should raise confirmation dialog', () => {
    component.contact.set(new Contact());
    const spy = vi.spyOn(testConfirmationService, 'confirm').mockImplementation((confirmation: Confirmation) => {
      if (confirmation.accept) return confirmation?.accept();
    });
    component.confirmPropagation();
    expect(spy).toHaveBeenCalled();
  });

  it('#updateContact happy path', () => {
    const testContact1 = new Contact();
    testContact1.id = 'test_contact_1_id';
    testContact1.type = ContactTypes.ORGANIZATION;

    const testContact2 = new Contact();
    testContact2.id = 'test_contact_2_id';
    testContact2.type = ContactTypes.COMMITTEE;

    component.contact.set(testContact1);

    expect(component.contact()?.id).toBe(testContact1.id);
    expect(component.contact()?.type).toBe(testContact1.type);
    expect(component.form.dirty).toBe(false);

    component.updateContact(testContact2);

    expect(component.contact()?.id).toBe(testContact2.id);
    expect(component.contact()?.type).toBe(testContact2.type);
    expect(component.form.dirty).toBe(true);
  });
});
