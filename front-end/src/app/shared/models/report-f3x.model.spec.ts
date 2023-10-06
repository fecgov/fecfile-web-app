import { ReportF3X, F3xFormTypes } from './report-f3x.model';
import { UploadSubmission } from './upload-submission.model';
import { WebPrintSubmission } from './webprint-submission.model';

describe('ReportF3X', () => {
  it('should create an instance', () => {
    expect(new ReportF3X()).toBeTruthy();
  });

  it('#fromJSON() should return a populated ReportF3X instance', () => {
    const data = {
      id: '999',
      form_type: F3xFormTypes.F3XT,
      committee_name: 'foo',
    };
    const reportF3X: ReportF3X = ReportF3X.fromJSON(data);
    expect(reportF3X).toBeInstanceOf(ReportF3X);
    expect(reportF3X.id).toBe('999');
    expect(reportF3X.form_type).toBe(F3xFormTypes.F3XT);
    expect(reportF3X.committee_name).toBe('foo');
    expect(reportF3X.election_code).toBe(undefined);
    expect(reportF3X.upload_submission).toBe(undefined);
  });

  it('#fromJSON() should return an ReportF3X instance with a valid UploadSubmission instance', () => {
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

    const reportF3X = ReportF3X.fromJSON(data);
    expect(reportF3X.upload_submission).toBeInstanceOf(UploadSubmission);
    expect(reportF3X.upload_submission?.fec_report_id).toBe('FEC-1234567');
    expect(reportF3X.upload_submission?.created).toBeInstanceOf(Date);
    expect(reportF3X.upload_submission?.created?.getFullYear()).toBe(2012);
    expect(reportF3X.webprint_submission).toBeInstanceOf(WebPrintSubmission);
    expect(reportF3X.webprint_submission?.fec_status).toBe('COMPLETED');
    expect(reportF3X.webprint_submission?.created).toBeInstanceOf(Date);
    expect(reportF3X.webprint_submission?.created?.getFullYear()).toBe(2010);
  });
});
