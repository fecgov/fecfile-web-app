import { F3xSummary, F3xFormTypes } from './f3x-summary.model';
import { FECUploadStatus } from './fec-upload-status.model';

describe('F3XSummary', () => {
  it('should create an instance', () => {
    expect(new F3xSummary()).toBeTruthy();
  });

  it('#fromJSON() should return a populated F3xSummary instance', () => {
    const data = {
      id: 999,
      form_type: F3xFormTypes.F3XT,
      committee_name: 'foo',
    };
    const f3xSummary: F3xSummary = F3xSummary.fromJSON(data);
    expect(f3xSummary).toBeInstanceOf(F3xSummary);
    expect(f3xSummary.id).toBe(999);
    expect(f3xSummary.form_type).toBe(F3xFormTypes.F3XT);
    expect(f3xSummary.committee_name).toBe('foo');
    expect(f3xSummary.election_code).toBe(null);
    expect(f3xSummary.upload_status).toBe(null);
  });

  it('#fromJSON() should return an F3xSummary instance with a valid FECUploadStatus instance', ()=>{
    const data = {
      upload_status: {
        fec_report_id: "FEC-1234567",
        acceptance_datetime: "12/12/2012",
      }
    };

    const f3xSummary = F3xSummary.fromJSON(data);
    expect(f3xSummary.upload_status).toBeInstanceOf(FECUploadStatus);
    expect(f3xSummary.upload_status?.fec_report_id).toBe("FEC-1234567");
    expect(f3xSummary.upload_status?.acceptance_datetime).toBeInstanceOf(Date);
    expect(f3xSummary.upload_status?.acceptance_datetime?.getFullYear()).toBe(2012);
  });
});
