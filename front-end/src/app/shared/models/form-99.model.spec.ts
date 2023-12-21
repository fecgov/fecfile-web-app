import { Form99, F99FormTypes } from './form-99.model';

describe('Form99', () => {
  it('should create an instance', () => {
    expect(new Form99()).toBeTruthy();
  });

  it('#fromJSON() should return a populated Form99 instance', () => {
    const data = {
      id: '999',
      form_type: F99FormTypes.F99,
      committee_name: 'foo',
    };
    const form99: Form99 = Form99.fromJSON(data);
    expect(form99).toBeInstanceOf(Form99);
    expect(form99.id).toBe('999');
    expect(form99.form_type).toBe(F99FormTypes.F99);
    expect(form99.committee_name).toBe('foo');
    expect(form99.routePrintPreviewBack).toBe('/reports/f99/edit/999');
    expect(form99.routePrintPreviewSignAndSubmit).toBe('/reports/f99/edit/999');
  });
});
