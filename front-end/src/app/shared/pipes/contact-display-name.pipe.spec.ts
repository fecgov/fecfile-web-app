import { Contact, ContactTypes } from '../models/contact.model';
import { ContactDisplayNamePipe } from './contact-display-name.pipe';

describe('ContactDisplayNamePipe', () => {
  let pipe: ContactDisplayNamePipe;

  const contact = new Contact();
  contact.first_name = 'Jane';
  contact.last_name = 'Smith';
  contact.name = 'ABC Inc';

  beforeEach(() => {
    pipe = new ContactDisplayNamePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('#contactDisplayName returns the contact name', () => {
    let name = pipe.transform(contact);
    expect(name).toBe('Smith, Jane');

    contact.type = ContactTypes.ORGANIZATION;
    name = pipe.transform(contact);
    expect(name).toBe('ABC Inc');

    contact.name = undefined;
    name = pipe.transform(contact);
    expect(name).toBe('');
  });
});
