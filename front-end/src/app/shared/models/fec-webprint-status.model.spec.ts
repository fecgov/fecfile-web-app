import { FECWebPrintStatus } from "./fec-webprint-status.model"

describe('F3XSummary', () => {
  it('should create an instance', () => {
    expect(new FECWebPrintStatus).toBeTruthy();
  });

  it('#fromJSON() should return a populated FECWebPrintStatus instance', () => {
    const data = {
      fec_report_id: "FEC-1234567",
      fec_message: "test message",
      fec_status: "ACCEPTED",
      fec_submission_id: "0123456789",
      created: "10/10/2010",
      updated: "10/12/2010",
    };
    const uploadStatus: FECWebPrintStatus = FECWebPrintStatus.fromJSON(data);
    expect(uploadStatus).toBeInstanceOf(FECWebPrintStatus);
    expect(uploadStatus.created).toBeInstanceOf(Date);
    expect(uploadStatus.created?.getFullYear()).toBe(2010);
    expect(JSON.stringify(uploadStatus)).toContain("FEC-1234567");
  });
});
