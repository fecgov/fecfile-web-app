import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EventEmitter } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { Contact, ContactTypes, FecApiCommitteeLookupData, FecApiLookupData } from 'app/shared/models/contact.model';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { DropdownModule } from 'primeng/dropdown';
import { of } from 'rxjs';

import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { FecApiService } from 'app/shared/services/fec-api.service';
import { SelectItem } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DialogModule } from 'primeng/dialog';
import { ContactLookupComponent } from '../contact-lookup/contact-lookup.component';
import { TransactionContactLookupComponent } from './transaction-contact-lookup.component';
import { LabelPipe } from 'app/shared/pipes/label.pipe';

describe('TransactionContactLookupComponent', () => {
  let component: TransactionContactLookupComponent;
  let fixture: ComponentFixture<TransactionContactLookupComponent>;

  let testFecApiService: FecApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionContactLookupComponent, ContactLookupComponent, LabelPipe],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        DialogModule,
        HttpClientTestingModule,
        DropdownModule,
        AutoCompleteModule,
      ],
      providers: [FormBuilder, FecApiService, EventEmitter, provideMockStore(testMockStore)],
    }).compileComponents();

    testFecApiService = TestBed.inject(FecApiService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionContactLookupComponent);
    component = fixture.componentInstance;
    component.form.addControl('contact_1', new FormControl());
    component.selectedContactFormControlName = 'contact_1';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#updateFormWithPrimaryContact Contact happy path', fakeAsync(() => {
    const eventEmitterEmitSpy = spyOn(component.contactSelect, 'emit');
    const testContact = Contact.fromJSON({
      id: 123,
      last_name: 'testLastName',
      first_name: 'testFirstName',
      type: ContactTypes.COMMITTEE,
    });
    const testValue = {
      value: testContact,
    } as SelectItem<Contact>;
    component.updateFormWithPrimaryContact(testValue);
    tick(500);
    expect(eventEmitterEmitSpy).toHaveBeenCalledOnceWith(testValue);
  }));

  it('#updateFormWithPrimaryContact FecApiLookupData createContactForm null vals', fakeAsync(() => {
    const testFecApiLookupData = new FecApiCommitteeLookupData({ id: 'C12345678' } as FecApiCommitteeLookupData);
    const testValue = {
      value: testFecApiLookupData,
    } as SelectItem<FecApiLookupData>;
    spyOn(testFecApiService, 'getCommitteeDetails').and.returnValue(of(new CommitteeAccount()));
    component.createContactForm.removeControl('committee_id');
    component.createContactForm.removeControl('name');
    component.createContactForm.removeControl('street_1');
    component.createContactForm.removeControl('street_2');
    component.createContactForm.removeControl('city');
    component.createContactForm.removeControl('state');
    component.createContactForm.removeControl('zip');
    component.updateFormWithPrimaryContact(testValue);
    tick(500);
    expect(component.createContactDialogVisible).toEqual(true);
  }));

  it('#updateFormWithPrimaryContact FecApiLookupData happy path', fakeAsync(() => {
    const testFecApiLookupData = new FecApiCommitteeLookupData({ id: 'C12345678' } as FecApiCommitteeLookupData);
    const testValue = {
      value: testFecApiLookupData,
    } as SelectItem<FecApiLookupData>;
    spyOn(testFecApiService, 'getCommitteeDetails').and.returnValue(of(new CommitteeAccount()));

    component.updateFormWithPrimaryContact(testValue);
    tick(500);
    expect(component.createContactDialogVisible).toEqual(true);
  }));

  it('#createNewContact happy path', () => {
    component.onCreateNewContactSelect();
    component.closeCreateContactDialog();
    component.createContactSave();
    expect(component.createContactForm.get('committee_id')?.value).toBe(null);
    component.onCreateContactDialogClose();
    expect(component.createContactFormSubmitted).toBeFalse();
  });
});
