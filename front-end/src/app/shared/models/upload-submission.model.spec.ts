import { UploadSubmission } from './upload-submission.model';

describe('F3xReport', () => {
  it('should create an instance', () => {
    expect(new UploadSubmission()).toBeTruthy();
  });

  it('#fromJSON() should return a populated UploadSubmission instance', () => {
    const data = {
      fec_report_id: 'FEC-1234567',
      fec_message: 'test message',
      fec_status: 'ACCEPTED',
      fec_submission_id: '0123456789',
      created: '10/10/2010',
    };
    const uploadStatus: UploadSubmission = UploadSubmission.fromJSON(data);
    expect(uploadStatus).toBeInstanceOf(UploadSubmission);
    expect(uploadStatus.created).toBeInstanceOf(Date);
    expect(uploadStatus.created?.getFullYear()).toBe(2010);
    expect(uploadStatus.fec_report_id).toBe('FEC-1234567');
    expect(JSON.stringify(uploadStatus)).toContain('FEC-1234567');
  });
});
