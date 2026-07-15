import type { StringDate } from 'app/shared/components/signal-inputs/date-input/date.input';

export interface VersionData {
  original: string;
  amendment: string;
  eFilingId: string;
  previousSubmissionDate: StringDate;
}
