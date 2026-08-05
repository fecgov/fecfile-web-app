import { F1MFormTypes, Form1M } from './form-1m.model';
import { ReportStatus } from './report.model';

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
    let form = Form1M.fromJSON(data);
    expect(form.formLabel).toEqual('Form 1M');

    data.form_type = F1MFormTypes.F1MA;
    form = Form1M.fromJSON(data);
    expect(form.formLabel).toEqual('Form 1M');
  });

  it('canAmend should return correct bool', () => {
    const data = {
      id: '999',
      form_type: F1MFormTypes.F1MN,
      committee_name: 'foo',
    };
    let form = Form1M.fromJSON(data);
    expect(form.canAmend).toEqual(false);

    form.report_status = ReportStatus.SUBMIT_SUCCESS;
    expect(form.canAmend).toEqual(true);
  });
});
