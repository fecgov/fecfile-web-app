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
    const f3xSummary: ReportF3X = ReportF3X.fromJSON(data);
    expect(f3xSummary).toBeInstanceOf(ReportF3X);
    expect(f3xSummary.id).toBe('999');
    expect(f3xSummary.form_type).toBe(F3xFormTypes.F3XT);
    expect(f3xSummary.committee_name).toBe('foo');
    expect(f3xSummary.election_code).toBe(undefined);
    expect(f3xSummary.upload_submission).toBe(undefined);
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

    const f3xSummary = ReportF3X.fromJSON(data);
    expect(f3xSummary.upload_submission).toBeInstanceOf(UploadSubmission);
    expect(f3xSummary.upload_submission?.fec_report_id).toBe('FEC-1234567');
    expect(f3xSummary.upload_submission?.created).toBeInstanceOf(Date);
    expect(f3xSummary.upload_submission?.created?.getFullYear()).toBe(2012);
    expect(f3xSummary.webprint_submission).toBeInstanceOf(WebPrintSubmission);
    expect(f3xSummary.webprint_submission?.fec_status).toBe('COMPLETED');
    expect(f3xSummary.webprint_submission?.created).toBeInstanceOf(Date);
    expect(f3xSummary.webprint_submission?.created?.getFullYear()).toBe(2010);
  });
});
