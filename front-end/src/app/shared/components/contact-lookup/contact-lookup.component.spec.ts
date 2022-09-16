import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EventEmitter } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { CommitteeLookupResponse, Contact, ContactTypes, FecApiCommitteeLookupData, FecApiLookupData, FecfileCommitteeLookupData, FecfileIndividualLookupData, FecfileOrganizationLookupData, IndividualLookupResponse, OrganizationLookupResponse } from 'app/shared/models/contact.model';
import { ContactService } from 'app/shared/services/contact.service';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { DropdownModule } from 'primeng/dropdown';
import { of } from 'rxjs';

import { SelectItem } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ContactLookupComponent } from './contact-lookup.component';

describe('ContactLookupComponent', () => {
  let component: ContactLookupComponent;
  let fixture: ComponentFixture<ContactLookupComponent>;

  let testContactService: ContactService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactLookupComponent],
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule, DropdownModule, AutoCompleteModule],
      providers: [FormBuilder, ContactService, ContactService, EventEmitter, provideMockStore(testMockStore)],
    }).compileComponents();

    testContactService = TestBed.inject(ContactService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactLookupComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onDropdownSearch empty search', fakeAsync(() => {
    const testEvent = { query: null };
    component.onDropdownSearch(testEvent);
    tick(500);
    expect(component.contactLookupList.length === 0).toBeTrue();
  }));

  it('#onDropdownSearch COM undefined fec_api_committees', fakeAsync(() => {
    const testCommitteeLookupResponse = new CommitteeLookupResponse();
    testCommitteeLookupResponse.fecfile_committees = [
      {
        id: 123,
        name: 'testName'
      } as FecfileCommitteeLookupData
    ];
    spyOn(testContactService, 'committeeLookup').and.returnValue(
      of(testCommitteeLookupResponse));
    const testEvent = { query: 'hi' };
    component.contactTypeFormControl.setValue("COM");
    component.onDropdownSearch(testEvent);
    expect(component.contactLookupList[1].items.length === 0).toBeTrue();
  }));

  it('#onDropdownSearch COM undefined fecfile_committees', fakeAsync(() => {
    const testCommitteeLookupResponse = new CommitteeLookupResponse();
    testCommitteeLookupResponse.fec_api_committees = [
      {
        id: 'testId',
        name: 'testName',
        is_active: true
      } as FecApiCommitteeLookupData
    ];
    spyOn(testContactService, 'committeeLookup').and.returnValue(
      of(testCommitteeLookupResponse));
    const testEvent = { query: 'hi' };
    component.contactTypeFormControl.setValue("COM");
    component.onDropdownSearch(testEvent);
    expect(component.contactLookupList[0].items.length === 0).toBeTrue();
  }));

  it('#onDropdownSearch COM happy path', fakeAsync(() => {
    const testCommitteeLookupResponse = new CommitteeLookupResponse();
    testCommitteeLookupResponse.fec_api_committees = [
      {
        id: 'testId',
        name: 'testName',
        is_active: true
      } as FecApiCommitteeLookupData
    ];
    testCommitteeLookupResponse.fecfile_committees = [
      {
        id: 123,
        name: 'testName'
      } as FecfileCommitteeLookupData
    ];
    spyOn(testContactService, 'committeeLookup').and.returnValue(
      of(testCommitteeLookupResponse));
    const testEvent = { query: 'hi' };
    component.contactTypeFormControl.setValue("COM");
    component.onDropdownSearch(testEvent);
    expect(JSON.stringify(component.contactLookupList) ===
      JSON.stringify(testCommitteeLookupResponse.toSelectItemGroups())).toBeTrue();
  }));

  it('#onDropdownSearch IND undefined fecfile_individuals', fakeAsync(() => {
    const testIndividualLookupResponse = new IndividualLookupResponse();
    spyOn(testContactService, 'individualLookup').and.returnValue(
      of(testIndividualLookupResponse));
    const testEvent = { query: 'hi' };
    component.contactTypeFormControl.setValue("IND");
    component.onDropdownSearch(testEvent);
    tick(500);
    expect(component.contactLookupList[0].items.length === 0).toBeTrue();
  }));

  it('#onDropdownSearch IND happy path', fakeAsync(() => {
    const testIndividualLookupResponse = new IndividualLookupResponse();
    testIndividualLookupResponse.fecfile_individuals = [
      new FecfileIndividualLookupData({
        id: 123,
        last_name: 'testLastName',
        first_name: 'testFirstName',
        type: ContactTypes.INDIVIDUAL,
      } as FecfileIndividualLookupData)
    ];
    spyOn(testContactService, 'individualLookup').and.returnValue(
      of(testIndividualLookupResponse));
    const testEvent = { query: 'hi' };
    component.contactTypeFormControl.setValue("IND");
    component.onDropdownSearch(testEvent);
    tick(500);
    expect(JSON.stringify(component.contactLookupList) ===
      JSON.stringify(testIndividualLookupResponse.toSelectItemGroups())).toBeTrue();
  }));

  it('#onDropdownSearch ORG undefined fecfile_organizations', fakeAsync(() => {
    const testOrganizationLookupResponse = new OrganizationLookupResponse();
    spyOn(testContactService, 'organizationLookup').and.returnValue(
      of(testOrganizationLookupResponse));
    const testEvent = { query: 'hi' };
    component.contactTypeFormControl.setValue("ORG");
    component.onDropdownSearch(testEvent);
    tick(500);
    expect(component.contactLookupList[0].items.length === 0).toBeTrue();
  }));

  it('#onDropdownSearch ORG happy path', fakeAsync(() => {
    const testOrganizationLookupResponse = new OrganizationLookupResponse();
    testOrganizationLookupResponse.fecfile_organizations = [
      new FecfileOrganizationLookupData({
        id: 123,
        name: 'testOrgName',
        type: ContactTypes.ORGANIZATION,
      } as FecfileOrganizationLookupData)
    ];
    spyOn(testContactService, 'organizationLookup').and.returnValue(
      of(testOrganizationLookupResponse));
    const testEvent = { query: 'hi' };
    component.contactTypeFormControl.setValue("ORG");
    component.onDropdownSearch(testEvent);
    tick(500);
    expect(JSON.stringify(component.contactLookupList) ===
      JSON.stringify(testOrganizationLookupResponse.toSelectItemGroups())).toBeTrue();
  }));

  it('#onContactSelect Contact happy path', fakeAsync(() => {
    const eventEmitterEmitSpy = spyOn(component.fecfileContactSelect, 'emit');
    const testContact = Contact.fromJSON({
      id: 123,
      last_name: 'testLastName',
      first_name: 'testFirstName',
      type: ContactTypes.COMMITTEE,
    });
    const testValue = {
      value: testContact,
    } as SelectItem<Contact>;
    component.onContactSelect(testValue);
    tick(500);
    expect(eventEmitterEmitSpy).toHaveBeenCalledOnceWith(testValue);
  }));

  it('#onContactSelect FecApiLookupData happy path', fakeAsync(() => {
    const eventEmitterEmitSpy = spyOn(component.fecApiLookupSelect, 'emit');
    const testFecApiLookupData = new FecApiLookupData();
    const testValue = {
      value: testFecApiLookupData,
    } as SelectItem<FecApiLookupData>;
    component.onContactSelect(testValue);
    tick(500);
    expect(eventEmitterEmitSpy).toHaveBeenCalledOnceWith(
      testValue);
  }));

  it('#isContact happy path', () => {
    const expectedRetval = true;
    const retval = component.isContact(new Contact());

    expect(retval).toEqual(expectedRetval);
  });

});
