import { F24FormTypes, Form24 } from './form-24.model';

describe('Form24', () => {
  it('should create an instance', () => {
    expect(new Form24()).toBeTruthy();
  });

  it('#fromJSON() should return a populated Form24 instance', () => {
    const data = {
      id: '999',
      form_type: F24FormTypes.F24N,
      committee_name: 'foo',
    };
    const form24: Form24 = Form24.fromJSON(data);
    expect(form24).toBeInstanceOf(Form24);
    expect(form24.id).toBe('999');
    expect(form24.form_type).toBe(F24FormTypes.F24N);
    expect(form24.committee_name).toBe('foo');
  });

  it('should set formLabel to "Form 24', () => {
    const data = {
      id: '999',
      form_type: F24FormTypes.F24N,
      committee_name: 'foo',
    };
    const form = Form24.fromJSON(data);
    expect(form.formLabel).toEqual('FORM 24');
  });

  it('should display empty string for sub label', () => {
    const data = {
      id: '999',
      form_type: F24FormTypes.F24N,
      committee_name: 'foo',
    };
    const form = Form24.fromJSON(data);
    expect(form.formSubLabel).toEqual('');
  });

  describe('versionLabel', () => {
    it('should return just version label if report version is undefined', () => {
      const data = {
        id: '999',
        form_type: F24FormTypes.F24N,
        committee_name: 'foo',
        report_version: undefined,
      };
      const form = Form24.fromJSON(data);
      expect(form.versionLabel).toEqual('Original');
    });

    it('should also display report version if defined', () => {
      const data = {
        id: '999',
        form_type: F24FormTypes.F24N,
        committee_name: 'foo',
        report_version: '1',
      };
      const form = Form24.fromJSON(data);
      expect(form.versionLabel).toEqual('Original 1');
    });
  });
});
