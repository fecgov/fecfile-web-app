import type { StringDate } from 'app/shared/components/signal-inputs/date-input/date.input';

export interface VersionData {
  original: number;
  amendment: number;
  eFilingId: string;
  previousSubmissionDate: StringDate;
}
