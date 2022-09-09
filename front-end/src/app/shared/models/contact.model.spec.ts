import { Contact, ContactTypes, FecCommitteeLookupData, FecIndividualLookupData } from './contact.model';

describe('Contact', () => {
  it('should create an instance', () => {
    expect(new Contact()).toBeTruthy();
  });

  it('#fromJSON() should return a populated Contact class', () => {
    const data = {
      id: 999,
      type: ContactTypes.COMMITTEE,
      name: 'foo',
    };
    const contact: Contact = Contact.fromJSON(data);
    expect(contact).toBeInstanceOf(Contact);
    expect(contact.id).toBe(999);
    expect(contact.type).toBe(ContactTypes.COMMITTEE);
    expect(contact.name).toBe('foo');
    expect(contact.occupation).toBe(null);
  });

  it('#fromJSON() should return a populated FecCommitteeLookupData class', () => {
    const data = {
      id: "C123",
      name: 'foo',
    };
    const fecCommitteeLookupData: FecCommitteeLookupData =
      FecCommitteeLookupData.fromJSON(data);
    expect(fecCommitteeLookupData).toBeInstanceOf(
      FecCommitteeLookupData);
    expect(fecCommitteeLookupData.id).toBe("C123");
    expect(fecCommitteeLookupData.name).toBe('foo');
  });

  it('#fromJSON() should return a populated FecIndividualLookupData class', () => {
    const data = {
      id: 123,
      last_name: 'test_last_name',
      first_name: 'test_first_name',
    };
    const fecIndividualLookupData: FecIndividualLookupData =
      FecIndividualLookupData.fromJSON(data);
    expect(fecIndividualLookupData).toBeInstanceOf(
      FecIndividualLookupData);
    expect(fecIndividualLookupData.id).toBe(123);
    expect(fecIndividualLookupData.last_name).toBe('test_last_name');
    expect(fecIndividualLookupData.first_name).toBe('test_first_name');
  });

});
