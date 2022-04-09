import { Contact, ContactTypes } from './contact.model';

describe('Contact', () => {
  it('should create an instance', () => {
    expect(new Contact()).toBeTruthy();
  });

  it('#fromJSON should return a populated Contact class', () => {
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
    expect(contact.occupation).toBeNull;
  });

  it('#getFieldsByType should return correct fields', () => {
    let result = Contact.getFieldsByType(ContactTypes.INDIVIDUAL);
    expect(result[0]).toBe('type');
    expect(result.length).toBe(18);

    result = Contact.getFieldsByType(ContactTypes.COMMITTEE);
    expect(result[1]).toBe('committee_id');
    expect(result.length).toBe(13);

    result = Contact.getFieldsByType(ContactTypes.CANDIDATE);
    expect(result[1]).toBe('candidate_id');
    expect(result.length).toBe(22);

    result = Contact.getFieldsByType(ContactTypes.ORGANIZATION);
    expect(result[1]).toBe('name');
    expect(result.length).toBe(12);
  });
});
