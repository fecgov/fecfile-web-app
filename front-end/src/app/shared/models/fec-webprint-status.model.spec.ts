import { FECWebPrintStatus } from "./fec-webprint-status.model"

describe('F3XSummary', () => {
  it('should create an instance', () => {
    expect(new FECWebPrintStatus).toBeTruthy();
  });

  it('#fromJSON() should return a populated FECWebPrintStatus instance', () => {
    const data = {
      fec_email: "test@test.com",
      fec_batch_id: "1234",
      fec_image_url: "image.test.com",
      fec_submission_id: "FEC-1234567",
      fec_message: "Message Goes Here",
      fec_status: "COMPLETED",
      fecfile_error: "",
      fecfile_task_state:"COMPLETED",
      id: 0,
      created: "10/10/2010",
      updated: "10/12/2010",
    };
    const uploadStatus: FECWebPrintStatus = FECWebPrintStatus.fromJSON(data);
    expect(uploadStatus).toBeInstanceOf(FECWebPrintStatus);
    expect(uploadStatus.fec_status).toBe("COMPLETED");
    expect(uploadStatus.created).toBeInstanceOf(Date);
    expect(uploadStatus.created?.getFullYear()).toBe(2010);
    expect(JSON.stringify(uploadStatus)).toContain("FEC-1234567");
  });
});
