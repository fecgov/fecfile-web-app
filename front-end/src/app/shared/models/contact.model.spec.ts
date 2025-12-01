import { Contact, ContactTypes, FecApiCommitteeLookupData } from './contact.model';

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

  it('#FecApiCommitteeLookupData.toSelectItem() should return propertly marked', () => {
    const data: FecApiCommitteeLookupData = new FecApiCommitteeLookupData({
      id: 'C99999999',
      is_active: true,
      name: 'this_is_a_test_name',
    } as FecApiCommitteeLookupData);
    const expectedRetval = `this_<mark>is_a</mark>_test_name<br>(C99999999)<span
        class="pi pi-circle-on active-status-circle" 
        aria-label="Active" 
      ></span>`;

    const retval = data.toSelectItem('is_a');
    expect(retval.label).toBe(expectedRetval);
    expect(retval.value).toBe(data);
  });

  it('#FecApiCommitteeLookupData.toSelectItem() should return propertly marked name only', () => {
    const data: FecApiCommitteeLookupData = new FecApiCommitteeLookupData({
      id: 'C99999999',
      is_active: true,
      name: 'actblue',
    } as FecApiCommitteeLookupData);
    const expectedRetval = `<mark>act</mark>blue<br>(C99999999)<span
        class="pi pi-circle-on active-status-circle" 
        aria-label="Active" 
      ></span>`;

    const retval = data.toSelectItem('act');
    expect(retval.label).toBe(expectedRetval);
    expect(retval.value).toBe(data);
  });
});
