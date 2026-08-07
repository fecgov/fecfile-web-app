export const ReportSidebarSection = {
  EDIT: 'EDIT',
  TRANSACTIONS: 'TRANSACTIONS',
  REVIEW: 'REVIEW',
  SUBMISSION: 'SUBMISSION',
  CREATE: 'CREATE',
} as const;
export type ReportSidebarSection = (typeof ReportSidebarSection)[keyof typeof ReportSidebarSection];
