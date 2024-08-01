import { F99FormTypes, Form99 } from './form-99.model';

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
  });

  it('should set formLabel to "Form 99', () => {
    const data = {
      id: '999',
      form_type: F99FormTypes.F99,
      committee_name: 'foo',
    };
    const form = Form99.fromJSON(data);
    expect(form.formLabel).toEqual('FORM 99');
  });

  describe('formSubLabel', () => {
    it('should display the correct labels for each text code', () => {
      const valueLabelPairs: [string | undefined, string][] = [
        ['MSI', 'Disavowal Response'],
        ['MSM', 'Filing Frequency Change Notice'],
        ['MST', 'Miscellaneous Report to the FEC'],
        [undefined, ''],
      ];
      for (const [textCode, label] of valueLabelPairs) {
        const data = {
          id: '999',
          form_type: F99FormTypes.F99,
          committee_name: 'foo',
          text_code: textCode,
        };
        const form = Form99.fromJSON(data);
        expect(form.formSubLabel).toEqual(label);
      }
    });
  });
});
