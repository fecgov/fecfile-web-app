/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { Component, NO_ERRORS_SCHEMA, viewChild } from '@angular/core';
import { ContactService } from 'app/shared/services/contact.service';
import { ContactManagementService } from 'app/shared/services/contact-management.service';
import { ContactTypes, Contact } from 'app/shared/models/contact.model';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { AutoComplete, AutoCompleteCompleteEvent, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { ContactSearchComponent } from './contact-search.component';
import { CommitteeAccount } from 'app/shared/models';

@Component({
  imports: [ContactSearchComponent],
  standalone: true,
  template: `<app-contact-search [key]="key" [isBare]="isBare"></app-contact-search>`,
})
class TestHostComponent {
  key = 'contact_1';
  isBare = true;

  component = viewChild.required(ContactSearchComponent);
}

describe('ContactSearchComponent', () => {
  let component: ContactSearchComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let contactManagementService: ContactManagementService;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, SelectModule, AutoComplete, ContactSearchComponent],
      providers: [provideHttpClient(), ContactService, ContactManagementService],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    component = host.component();

    contactManagementService = TestBed.inject(ContactManagementService);

    contactManagementService.activeKey.set(host.key);
    const manager = contactManagementService.get(host.key);
    manager.contactType.set(ContactTypes.INDIVIDUAL);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have manager set based on key input', () => {
    expect(component.manager()).toBeDefined();
    expect(component.manager()).toEqual(contactManagementService.get(host.key));
  });

  describe('onDropdownSearch', () => {
    it('should perform candidate lookup and set contactLookupList when contact type is CANDIDATE', async () => {
      const searchTerm = 'John Doe';
      const mockResponse = {
        toSelectItemGroups: jasmine
          .createSpy('toSelectItemGroups')
          .and.returnValue([{ label: 'Candidates', items: [] }]),
      };

      component.manager().contactType.set(ContactTypes.CANDIDATE);
      const spy = spyOn(component.contactService, 'candidateLookup').and.returnValue(Promise.resolve(mockResponse));
      const event = { query: searchTerm } as AutoCompleteCompleteEvent;

      await component.onDropdownSearch(event);

      expect(spy).toHaveBeenCalledWith(searchTerm);
      expect(mockResponse.toSelectItemGroups).toHaveBeenCalledWith(component.isBare());
      expect(component.contactLookupList).toEqual([{ label: 'Candidates', items: [] }]);
    });

    it('should perform committee lookup and set contactLookupList when contact type is COMMITTEE', async () => {
      const searchTerm = 'Committee ABC';
      const mockResponse = {
        toSelectItemGroups: jasmine
          .createSpy('toSelectItemGroups')
          .and.returnValue([{ label: 'Committees', items: [] }]),
      };

      component.manager().contactType.set(ContactTypes.COMMITTEE);
      const spy = spyOn(component.contactService, 'committeeLookup').and.resolveTo(mockResponse);
      const event = { query: searchTerm } as AutoCompleteCompleteEvent;
      await component.onDropdownSearch(event);

      expect(spy).toHaveBeenCalledWith(searchTerm);
      expect(mockResponse.toSelectItemGroups).toHaveBeenCalledWith(component.isBare());
      expect(component.contactLookupList).toEqual([{ label: 'Committees', items: [] }]);
    });

    it('should perform individual lookup and set contactLookupList when contact type is INDIVIDUAL', async () => {
      const searchTerm = 'Jane Smith';
      const mockResponse = {
        toSelectItemGroups: jasmine
          .createSpy('toSelectItemGroups')
          .and.returnValue([{ label: 'Individuals', items: [] }]),
      };

      component.manager().contactType.set(ContactTypes.INDIVIDUAL);
      const spy = spyOn(component.contactService, 'individualLookup').and.returnValue(Promise.resolve(mockResponse));
      const event = { query: searchTerm } as AutoCompleteCompleteEvent;

      await component.onDropdownSearch(event);

      expect(spy).toHaveBeenCalledWith(searchTerm);
      expect(mockResponse.toSelectItemGroups).toHaveBeenCalled();
      expect(component.contactLookupList).toEqual([{ label: 'Individuals', items: [] }]);
    });

    it('should perform organization lookup and set contactLookupList when contact type is ORGANIZATION', async () => {
      const searchTerm = 'Org XYZ';
      const mockResponse = {
        toSelectItemGroups: jasmine
          .createSpy('toSelectItemGroups')
          .and.returnValue([{ label: 'Organizations', items: [] }]),
      };

      component.manager().contactType.set(ContactTypes.ORGANIZATION);

      const spy = spyOn(component.contactService, 'organizationLookup').and.returnValue(Promise.resolve(mockResponse));
      const event = { query: searchTerm } as AutoCompleteCompleteEvent;
      await component.onDropdownSearch(event);

      expect(spy).toHaveBeenCalledWith(searchTerm);
      expect(mockResponse.toSelectItemGroups).toHaveBeenCalled();
      expect(component.contactLookupList).toEqual([{ label: 'Organizations', items: [] }]);
    });

    it('should clear contactLookupList when searchTerm is empty', async () => {
      // Create a mock event with empty query
      const event = { query: '' } as AutoCompleteCompleteEvent;

      await component.onDropdownSearch(event);

      expect(component.contactLookupList).toEqual([]);
    });
  });

  describe('onContactLookupSelect', () => {
    it('should set contact from Contact instance and update manager', async () => {
      const selectedContact = new Contact();
      selectedContact.id = '1';
      selectedContact.type = ContactTypes.INDIVIDUAL;
      selectedContact.name = 'John Doe';

      const event = { value: selectedContact } as AutoCompleteSelectEvent;

      spyOn(component.manager().contact, 'set');
      spyOn(component.manager().outerContact, 'set');

      await component.onContactLookupSelect(event);

      expect(component.manager().contact.set).toHaveBeenCalledWith(selectedContact);
      if (component.isBare()) {
        expect(component.manager().outerContact.set).toHaveBeenCalledWith(selectedContact);
      }
    });

    it('should handle selection of FecApiCommitteeLookupData and update manager', async () => {
      const committeeData = {
        id: 'C456',
      } as any;

      const committeeDetails = CommitteeAccount.fromJSON({
        committee_id: 'C456',
        name: 'Committee ABC',
        street_1: '456 Elm St',
        city: 'Anytown',
        state: 'NY',
        zip: '67890',
        treasurer_phone: '1234567890',
      });

      const spy = spyOn(component.contactService, 'getCommitteeDetails').and.resolveTo(committeeDetails);

      spyOn(component.manager().contact, 'set');
      spyOn(component.manager().outerContact, 'set');

      const event = { value: committeeData } as AutoCompleteSelectEvent;

      await component.onContactLookupSelect(event);

      expect(spy).toHaveBeenCalledWith('C456');
      expect(component.manager().contact.set).toHaveBeenCalled();
      if (component.isBare()) {
        expect(component.manager().outerContact.set).toHaveBeenCalled();
      }
    });

    it('should do nothing if event.value is null or undefined', async () => {
      spyOn(component.manager().contact, 'set');
      spyOn(component.manager().outerContact, 'set');

      await component.onContactLookupSelect({ value: null } as AutoCompleteSelectEvent);

      expect(component.manager().contact.set).not.toHaveBeenCalled();
      expect(component.manager().outerContact.set).not.toHaveBeenCalled();
    });
  });

  describe('isContact', () => {
    it('should return true if value is instance of Contact', () => {
      const contact = new Contact();
      expect(component.isContact(contact)).toBeTrue();
    });

    it('should return false if value is not instance of Contact', () => {
      const notContact = {};
      expect(component.isContact(notContact)).toBeFalse();
    });
  });
});
