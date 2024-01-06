import { F1MFormTypes, Form1M } from "./form-1m.model";

describe('Form-1M', () => {
  it('should create an instance', () => {
    expect(new Form1M()).toBeTruthy();
  });

  it('should set formLabel to "Form 1M', () => {
    const data = {
      id: '999',
      form_type: F1MFormTypes.F1MN,
      committee_name: 'foo',
    };
    const form = Form1M.fromJSON(data);
    expect(form.formLabel).toEqual('FORM 1M');
  });

  it('should display empty string for sub label', () => {
    const data = {
      id: '999',
      form_type: F1MFormTypes.F1MN,
      committee_name: 'foo',
    };
    const form = Form1M.fromJSON(data);
    expect(form.formSubLabel).toEqual('');
  });

  describe('versionLabel', () => {
    it('should return just version label if report version is undefined', () => {
      const data = {
        id: '999',
        form_type: F1MFormTypes.F1MN,
        committee_name: 'foo',
        report_version: undefined
      };
      const form = Form1M.fromJSON(data);
      expect(form.versionLabel).toEqual('Original');
    });

    it('should also display report version if defined', () => {
      const data = {
        id: '999',
        form_type: F1MFormTypes.F1MN,
        committee_name: 'foo',
        report_version: '1'
      };
      const form = Form1M.fromJSON(data);
      expect(form.versionLabel).toEqual('Original 1');
    });
  });
});