import { FECUploadStatus } from "./fec-upload-status.model"

describe('F3XSummary', () => {
  it('should create an instance', () => {
    expect(new FECUploadStatus).toBeTruthy();
  });

  it('#fromJSON() should return a populated FECUploadStatus instance', () => {
    const data = {
      fec_report_id: "FEC-1234567",
      message: "test message",
      status: "ACCEPTED",
      submission_id: "0123456789",
      success: true,
      acceptance_datetime: "10/10/2010",
    };
    const uploadStatus: FECUploadStatus = FECUploadStatus.fromJSON(data);
    expect(uploadStatus).toBeInstanceOf(FECUploadStatus);
    expect(uploadStatus.acceptance_datetime).toBeInstanceOf(Date);
    console.log(uploadStatus.acceptance_datetime);
    expect(uploadStatus.acceptance_datetime?.getFullYear()).toBe(2010);
    expect(uploadStatus.fec_report_id).toBe("FEC-1234567");
    expect(uploadStatus.success).toBe(true);
  });
});
