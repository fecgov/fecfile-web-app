import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EventEmitter } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { CommitteeLookupResponse, Contact, ContactTypes, FecfileCommitteeLookupData, FecfileIndividualLookupData, IndividualLookupResponse } from 'app/shared/models/contact.model';
import { ContactService } from 'app/shared/services/contact.service';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { DropdownModule } from 'primeng/dropdown';
import { of } from 'rxjs';

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

  it('#onDropdownSearch COM happy path', fakeAsync(() => {
    const testCommitteeLookupResponse = new CommitteeLookupResponse();
    testCommitteeLookupResponse.fec_api_committees = [{ id: 'testId', name: 'testName' }];
    testCommitteeLookupResponse.fecfile_committees = [FecfileCommitteeLookupData.fromJSON(
      { id: 123, name: 'testName' })];
    spyOn(testContactService, 'committeeLookup').and.returnValue(of(testCommitteeLookupResponse));
    const testEvent = { query: 'hi' };
    component.contactTypeFormControl.setValue("COM");
    component.onDropdownSearch(testEvent);
    //tick(500);
    expect(JSON.stringify(component.contactLookupList) ===
      JSON.stringify(testCommitteeLookupResponse.toSelectItemGroups())).toBeTrue();
  }));

  it('#onDropdownSearch IND happy path', fakeAsync(() => {
    const testIndividualLookupResponse = new IndividualLookupResponse();
    testIndividualLookupResponse.fecfile_individuals = [
      FecfileIndividualLookupData.fromJSON({
        id: 123,
        last_name: 'testLastName',
        first_name: 'testFirstName',
        type: ContactTypes.COMMITTEE,
      })
    ];
    spyOn(testContactService, 'individualLookup').and.returnValue(of(testIndividualLookupResponse));
    const testEvent = { query: 'hi' };
    component.contactTypeFormControl.setValue("IND");
    component.onDropdownSearch(testEvent);
    tick(500);
    expect(JSON.stringify(component.contactLookupList) ===
      JSON.stringify(testIndividualLookupResponse.toSelectItemGroups())).toBeTrue();
  }));

  it('#onContactSelect happy path', fakeAsync(() => {
    const eventEmitterEmitSpy = spyOn(component.contactSelect, 'emit');
    const testValue = Contact.fromJSON({
      id: 123,
      last_name: 'testLastName',
      first_name: 'testFirstName',
      type: ContactTypes.COMMITTEE,
    });
    const testEvent = {
      originalEvent: {
        type: 'click',
      },
      value: testValue,
    };
    component.onContactSelect(testEvent);
    tick(500);
    expect(eventEmitterEmitSpy).toHaveBeenCalledOnceWith(testValue);
  }));
});
