export const ReportStatus = {
  IN_PROGRESS: 'In progress',
  SUBMIT_PENDING: 'Submission pending',
  SUBMIT_SUCCESS: 'Submission success',
  SUBMIT_FAILURE: 'Submission failure',
} as const;
export type ReportStatus = (typeof ReportStatus)[keyof typeof ReportStatus];
