import { Contact, ContactTypes, FecApiCommitteeLookupData, FecfileCommitteeLookupData, FecfileIndividualLookupData } from './contact.model';

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

  it('#fromJSON() should return a populated FecApiCommitteeLookupData class', () => {
    const data = {
      id: "C123",
      name: 'foo',
    };
    const fecApiCommitteeLookupData: FecApiCommitteeLookupData =
      FecApiCommitteeLookupData.fromJSON(data);
    expect(fecApiCommitteeLookupData).toBeInstanceOf(
      FecApiCommitteeLookupData);
    expect(fecApiCommitteeLookupData.id).toBe("C123");
    expect(fecApiCommitteeLookupData.name).toBe('foo');
  });

  it('#fromJSON() should return a populated FecfileCommitteeLookupData class', () => {
    const data = {
      id: 999,
      type: ContactTypes.COMMITTEE,
      name: 'foo',
    };
    const fecfileCommitteeLookupData: FecfileCommitteeLookupData =
      FecfileCommitteeLookupData.fromJSON(data);
    expect(fecfileCommitteeLookupData).toBeInstanceOf(
      Contact);
    expect(fecfileCommitteeLookupData.id).toBe(999);
    expect(fecfileCommitteeLookupData.name).toBe('foo');
  });

  it('#fromJSON() should return a populated FecfileIndividualLookupData class', () => {
    const data = {
      id: 999,
      type: ContactTypes.INDIVIDUAL,
      name: 'foo',
      last_name: 'test_last_name',
      first_name: 'test_first_name'
    };
    const fecfileIndividualLookupData: FecfileIndividualLookupData =
      FecfileIndividualLookupData.fromJSON(data);
    expect(fecfileIndividualLookupData).toBeInstanceOf(
      Contact);
    expect(fecfileIndividualLookupData.id).toBe(999);
    expect(fecfileIndividualLookupData.last_name).toBe('test_last_name');
    expect(fecfileIndividualLookupData.first_name).toBe('test_first_name');
  });

});
