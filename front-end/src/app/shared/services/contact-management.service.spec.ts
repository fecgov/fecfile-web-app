import { TestBed } from '@angular/core/testing';
import { ContactManagementService, ContactManager } from './contact-management.service';
import { ContactTypes, emptyContact } from '../models';
import { testContact } from '../utils/unit-test.utils';

describe('ContactManagementService', () => {
  let service: ContactManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initially not show dialog', () => {
    expect(service.showDialog()).toBeFalse();
  });

  it('should toggle dialog visibility', () => {
    expect(service.showDialog()).toBeFalse();
    service.showDialog.set(true);
    expect(service.showDialog()).toBeTrue();
  });

  it('should create and retrieve a ContactManager by key', () => {
    const key = 'testKey';
    const manager = service.get(key);
    expect(manager).toBeInstanceOf(ContactManager);
    expect(manager).toEqual(service.get(key)); // should return the same instance
  });

  it('should clear contact when dialog is shown and clearOnLoad is true', () => {
    const key = 'testKey';
    const manager = service.get(key);
    manager.clearOnLoad.set(true);
    manager.contact.set(testContact());

    service.activeKey.set(key);
    service.showDialog.set(true);
    TestBed.flushEffects();
    expect(manager.contact()).toEqual(emptyContact(manager.contactType()));
  });

  it('should not clear contact when clearOnLoad is false', () => {
    const key = 'testKey';
    const manager = service.get(key);
    manager.clearOnLoad.set(false);
    const contactData = testContact();
    manager.contact.set(contactData);

    service.activeKey.set(key);
    service.showDialog.set(true);

    expect(manager.contact()).toEqual(contactData);
  });
});

describe('ContactManager', () => {
  let manager: ContactManager;

  beforeEach(() => {
    manager = new ContactManager();
  });

  it('should set a single contact type', () => {
    manager.setAsSingle(ContactTypes.ORGANIZATION);
    expect(manager.contactType()).toBe(ContactTypes.ORGANIZATION);
    expect(manager.contactTypeOptions().length).toBe(1);
    expect(manager.contactTypeOptions()[0].value).toBe(ContactTypes.ORGANIZATION);
  });

  it('should set multiple contact type options', () => {
    manager.setContactTypeOptions([ContactTypes.INDIVIDUAL, ContactTypes.ORGANIZATION]);
    expect(manager.contactType()).toBe(ContactTypes.INDIVIDUAL);
    expect(manager.contactTypeOptions().length).toBe(2);
    expect(manager.contactTypeOptions().map((option) => option.value)).toContain(ContactTypes.INDIVIDUAL);
    expect(manager.contactTypeOptions().map((option) => option.value)).toContain(ContactTypes.ORGANIZATION);
  });
});
