import { FECUploadStatus } from "./fec-upload-status.model"

describe('F3XSummary', () => {
  it('should create an instance', () => {
    expect(new FECUploadStatus).toBeTruthy();
  });

  it('#fromJSON() should return a populated FECUploadStatus instance', () => {
    const data = {
      fec_report_id: "FEC-1234567",
      fec_message: "test message",
      fec_status: "ACCEPTED",
      fec_submission_id: "0123456789",
      created: "10/10/2010",
    };
    const uploadStatus: FECUploadStatus = FECUploadStatus.fromJSON(data);
    expect(uploadStatus).toBeInstanceOf(FECUploadStatus);
    expect(uploadStatus.created).toBeInstanceOf(Date);
    console.log(uploadStatus.created);
    expect(uploadStatus.created?.getFullYear()).toBe(2010);
    expect(uploadStatus.fec_report_id).toBe("FEC-1234567");
    expect(JSON.stringify(uploadStatus)).toContain("FEC-1234567");
  });
});
