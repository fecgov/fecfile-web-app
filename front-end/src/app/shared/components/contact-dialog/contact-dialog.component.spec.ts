import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { Contact, ContactTypeLabels, ContactTypes } from 'app/shared/models/contact.model';
import { LabelPipe } from 'app/shared/pipes/label.pipe';
import { testContact, testIndividual, testMockStore } from 'app/shared/utils/unit-test.utils';
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
import { By } from '@angular/platform-browser';
import { afterEach, vi } from 'vitest';

@Component({
  imports: [ContactDialogComponent],
  standalone: true,
  template: `<app-contact-dialog
    [(contact)]="contact"
    [contactTypeOptions]="contactTypeOptions"
    [headerTitle]="headerTitle()"
  />`,
})
class TestHostComponent {
  component = viewChild.required(ContactDialogComponent);
  contact = signal(new Contact());
  contactTypeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels);
  headerTitle = signal<string | undefined>('Create a new contact');
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

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check for duplicates on add for every contact type, but not on edit', () => {
    component.contact.set(new Contact());
    component.visible.set(true);

    for (const type of Object.values(ContactTypes)) {
      component.type.set(type);
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('app-duplicate-contact'))).not.toBeNull();
    }

    component.contact.set(testContact());
    component.type.set(ContactTypes.INDIVIDUAL);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('app-duplicate-contact'))).toBeNull();
  });

  it('should check for duplicates after changing the type of an existing contact and switching back', () => {
    const contact = testContact();
    component.contact.set(contact);
    component.type.set(contact.type);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('app-duplicate-contact'))).toBeNull();

    component.type.set(contact.type === ContactTypes.INDIVIDUAL ? ContactTypes.ORGANIZATION : ContactTypes.INDIVIDUAL);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('app-duplicate-contact'))).not.toBeNull();

    component.type.set(contact.type);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('app-duplicate-contact'))).not.toBeNull();
  });

  it('should show the loading flag before opening the selected contact for editing', async () => {
    vi.useFakeTimers();
    host.headerTitle.set(undefined);
    component.contact.set(new Contact());
    component.visible.set(true);
    fixture.detectChanges();

    for (const type of [ContactTypes.CANDIDATE, ContactTypes.COMMITTEE, ContactTypes.ORGANIZATION]) {
      const selectedContact = testContact();
      selectedContact.id = `duplicate-${type}`;
      selectedContact.type = type;
      const transition = component.useContact(selectedContact);
      fixture.detectChanges();

      expect(component.loadingDuplicateContact()).toBe(true);
      expect(fixture.debugElement.query(By.css('img[src="assets/img/fec-loading-flag.gif"]'))).not.toBeNull();
      expect(component.contact()?.id).not.toBe(selectedContact.id);

      await vi.advanceTimersByTimeAsync(750);
      await transition;
      fixture.detectChanges();

      expect(component.loadingDuplicateContact()).toBe(false);
      expect(component.contact()?.id).toBe(selectedContact.id);
      expect(component.type()).toBe(type);

      component.closeDialog();
      component.visible.set(true);
      fixture.detectChanges();
    }

    component.closeDialog();
    expect(component.contact()?.id).toBeUndefined();
    expect(component.contact()).toBeInstanceOf(Contact);
    expect(component.type()).toBe(ContactTypes.ORGANIZATION);
  });

  it('should close dialog with flags set', () => {
    component.visible.set(true);
    component.closeDialog();
    expect(component.visible()).toBe(false);
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

  it('should use a duplicate contact without confirmation or update when it has no changes', () => {
    const selectedContact = testContact();
    component.contact.set(selectedContact);
    component.type.set(selectedContact.type);
    component.visible.set(true);
    for (const [field, control] of Object.entries(component.form.controls)) {
      control.setValue(selectedContact[field as keyof Contact]);
    }
    const confirmSpy = vi.spyOn(testConfirmationService, 'confirm');
    const savedContactSpy = vi.spyOn(component.savedContact, 'emit');
    const updateSpy = vi.spyOn(contactService, 'update');

    component.confirmPropagation();

    expect(confirmSpy).not.toHaveBeenCalled();
    expect(updateSpy).not.toHaveBeenCalled();
    expect(savedContactSpy).toHaveBeenCalledWith(selectedContact);
    expect(component.visible()).toBe(false);
    expect(component.contact()).toBeInstanceOf(Contact);
  });

  it('should save a viewed duplicate contact without requiring a field edit', async () => {
    vi.useFakeTimers();
    host.headerTitle.set(undefined);
    const selectedContact = testIndividual();
    component.contact.set(new Contact());
    component.visible.set(true);
    fixture.detectChanges();

    const transition = component.useContact(selectedContact);
    await vi.advanceTimersByTimeAsync(750);
    await transition;
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.unchangedExistingContact()).toBe(true);
    expect(component.disableSubmission()).toBe(false);
    const confirmSpy = vi.spyOn(testConfirmationService, 'confirm');
    const savedContactSpy = vi.spyOn(component.savedContact, 'emit');

    const saveButton = fixture.debugElement.nativeElement.querySelector('[data-cy="save"]') as HTMLButtonElement;
    expect(saveButton.disabled).toBe(false);
    saveButton.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(confirmSpy).not.toHaveBeenCalled();
    expect(savedContactSpy).toHaveBeenCalledWith(selectedContact);
    expect(component.visible()).toBe(false);
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
