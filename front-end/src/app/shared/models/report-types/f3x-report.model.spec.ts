import { F3xReport, F3xFormTypes } from './f3x-report.model';
import { UploadSubmission } from '../upload-submission.model';
import { WebPrintSubmission } from '../webprint-submission.model';

describe('F3xReport', () => {
  it('should create an instance', () => {
    expect(new F3xReport()).toBeTruthy();
  });

  it('#fromJSON() should return a populated F3xReport instance', () => {
    const data = {
      id: '999',
      form_type: F3xFormTypes.F3XT,
      committee_name: 'foo',
    };
    const f3xReport: F3xReport = F3xReport.fromJSON(data);
    expect(f3xReport).toBeInstanceOf(F3xReport);
    expect(f3xReport.id).toBe('999');
    expect(f3xReport.form_type).toBe(F3xFormTypes.F3XT);
    expect(f3xReport.committee_name).toBe('foo');
    expect(f3xReport.election_code).toBe(undefined);
    expect(f3xReport.upload_submission).toBe(undefined);
  });

  it('#fromJSON() should return an F3xReport instance with a valid UploadSubmission instance', () => {
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

    const f3xReport = F3xReport.fromJSON(data);
    expect(f3xReport.upload_submission).toBeInstanceOf(UploadSubmission);
    expect(f3xReport.upload_submission?.fec_report_id).toBe('FEC-1234567');
    expect(f3xReport.upload_submission?.created).toBeInstanceOf(Date);
    expect(f3xReport.upload_submission?.created?.getFullYear()).toBe(2012);
    expect(f3xReport.webprint_submission).toBeInstanceOf(WebPrintSubmission);
    expect(f3xReport.webprint_submission?.fec_status).toBe('COMPLETED');
    expect(f3xReport.webprint_submission?.created).toBeInstanceOf(Date);
    expect(f3xReport.webprint_submission?.created?.getFullYear()).toBe(2010);
  });
});
