import { Contact, ContactTypes } from './contact.model';

describe('Contact', () => {
  it('should create an instance', () => {
    expect(new Contact()).toBeTruthy();
  });

  it('#fromJSON() should return a populated Contact class', () => {
    const data = {
      id: '999',
      type: ContactTypes.COMMITTEE,
      name: 'foo',
    };
    const contact: Contact = Contact.fromJSON(data);
    expect(contact).toBeInstanceOf(Contact);
    expect(contact.id).toBe('999');
    expect(contact.type).toBe(ContactTypes.COMMITTEE);
    expect(contact.name).toBe('foo');
    expect(contact.occupation).toBe(undefined);
  });
});
