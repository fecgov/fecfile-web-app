import { Report } from "../interfaces/report.interface";

export function ReportIsEditable(report: Report): boolean{
  const status = report?.upload_status?.status;
  console.log("HEY");
  return status != "ACCEPTED" && status != "PROCESSING";
}