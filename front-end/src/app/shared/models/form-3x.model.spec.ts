import { ReportCodes } from '../utils/report-code.utils';
import { F3xFormTypes, Form3X } from './form-3x.model';
import { UploadSubmission } from './upload-submission.model';
import { WebPrintSubmission } from './webprint-submission.model';

describe('Form3X', () => {
  it('should create an instance', () => {
    expect(new Form3X()).toBeTruthy();
  });

  it('#fromJSON() should return a populated Form3X instance', () => {
    const data = {
      id: '999',
      form_type: F3xFormTypes.F3XT,
      committee_name: 'foo',
    };
    const form3X: Form3X = Form3X.fromJSON(data);
    expect(form3X).toBeInstanceOf(Form3X);
    expect(form3X.id).toBe('999');
    expect(form3X.form_type).toBe(F3xFormTypes.F3XT);
    expect(form3X.committee_name).toBe('foo');
    expect(form3X.election_code).toBe(undefined);
    expect(form3X.upload_submission).toBe(undefined);
  });

  it('#fromJSON() should return an Form3X instance with a valid UploadSubmission instance', () => {
    const data = {
      upload_submission: {
        fec_report_id: 'FEC-1234567',
        created: '12/12/2012',
      },
      webprint_submission: {
        fec_message: 'test message',
        fec_status: 'COMPLETED',
        created: '10/10/2010',
      },
    };

    const form3X = Form3X.fromJSON(data);
    expect(form3X.upload_submission).toBeInstanceOf(UploadSubmission);
    expect(form3X.upload_submission?.fec_report_id).toBe('FEC-1234567');
    expect(form3X.upload_submission?.created).toBeInstanceOf(Date);
    expect(form3X.upload_submission?.created?.getFullYear()).toBe(2012);
    expect(form3X.webprint_submission).toBeInstanceOf(WebPrintSubmission);
    expect(form3X.webprint_submission?.fec_status).toBe('COMPLETED');
    expect(form3X.webprint_submission?.created).toBeInstanceOf(Date);
    expect(form3X.webprint_submission?.created?.getFullYear()).toBe(2010);
  });

  it('should set formLabel to "Form 3X"', () => {
    const data = {
      id: '999',
      form_type: F3xFormTypes.F3XT,
      committee_name: 'foo',
    };
    const form3X = Form3X.fromJSON(data);
    expect(form3X.formLabel).toEqual('Form 3X');
  });

  describe('formSubLabel', () => {
    it('should return empty string if report_code is undefined', () => {
      const data = {
        id: '999',
        form_type: F3xFormTypes.F3XT,
        committee_name: 'foo',
        report_code: undefined,
      };
      const form3X = Form3X.fromJSON(data);
      expect(form3X.formSubLabel).toEqual('');
    });

    it('should display the appropriate sub label', () => {
      const data = {
        id: '999',
        form_type: F3xFormTypes.F3XT,
        committee_name: 'foo',
        report_code: ReportCodes.Q1,
        report_code_label: 'APRIL 15 QUARTERLY REPORT (Q1)',
      };
      const form3X = Form3X.fromJSON(data);
      expect(form3X.formSubLabel).toEqual('APRIL 15 QUARTERLY REPORT (Q1)');
    });
  });
});
