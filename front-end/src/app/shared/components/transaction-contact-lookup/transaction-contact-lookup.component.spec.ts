import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EventEmitter } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import {
  Contact,
  ContactTypes,
  FecApiCommitteeLookupData,
  FecApiLookupData
} from 'app/shared/models/contact.model';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { DropdownModule } from 'primeng/dropdown';
import { of } from 'rxjs';

import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { FecApiService } from 'app/shared/services/fec-api.service';
import { SelectItem } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DialogModule } from 'primeng/dialog';
import { TransactionContactLookupComponent } from './transaction-contact-lookup.component';

describe('TransactionContactLookupComponent', () => {
  let component: TransactionContactLookupComponent;
  let fixture: ComponentFixture<TransactionContactLookupComponent>;

  let testFecApiService: FecApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionContactLookupComponent],
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

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onContactLookupSelect Contact happy path', fakeAsync(() => {
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
    component.onContactLookupSelect(testValue);
    tick(500);
    expect(eventEmitterEmitSpy).toHaveBeenCalledOnceWith(testValue);
  }));

  it('#onContactLookupSelect FecApiLookupData createContactForm null vals', fakeAsync(() => {
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
    component.onContactLookupSelect(testValue);
    tick(500);
    expect(component.createContactDialogVisible).toEqual(true);
  }));

  it('#onContactLookupSelect FecApiLookupData happy path', fakeAsync(() => {
    const testFecApiLookupData = new FecApiCommitteeLookupData({ id: 'C12345678' } as FecApiCommitteeLookupData);
    const testValue = {
      value: testFecApiLookupData,
    } as SelectItem<FecApiLookupData>;
    spyOn(testFecApiService, 'getCommitteeDetails').and.returnValue(of(new CommitteeAccount()));

    component.onContactLookupSelect(testValue);
    tick(500);
    expect(component.createContactDialogVisible).toEqual(true);
  }));

  it('#onCreateContactDialogOpen null form control', () => {
    component.createContactForm = new FormGroup({});
    component.selectedFecCommitteeAccount = {} as CommitteeAccount;

    component.onCreateContactDialogOpen();
    expect(component.createContactFormSubmitted).toBeFalse();
    component.selectedFecCommitteeAccount = undefined;
    component.onCreateContactDialogOpen();
  });

  it('#createNewContact happy path', () => {
    component.onCreateNewContactSelect();
    component.closeCreateContactDialog();
    component.createContactSave();
    component.selectedFecCommitteeAccount = {
      committee_id: 'testCommitteeId',
      name: 'testName',
      street_1: 'testStreet1',
      street_2: 'testStreet2',
      city: 'testCity',
      state: 'testState',
      zip: 'testZip',
      treasurer_phone: 'testTreasPhone',
    } as CommitteeAccount;
    component.onCreateContactDialogOpen();
    expect(component.createContactForm.get('committee_id')?.value).toBe(
      component.selectedFecCommitteeAccount.committee_id
    );
    component.onCreateContactDialogClose();
    expect(component.createContactFormSubmitted).toBeFalse();
  });
  
});
