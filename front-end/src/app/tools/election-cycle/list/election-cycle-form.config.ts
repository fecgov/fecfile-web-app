import type { ElectionCycle } from '../election-cycle.model';
import type { WritableSignal } from '@angular/core';
import { form, required } from '@angular/forms/signals';
import {
  validateDate,
  validateDateAfter,
  validateDateOverlap,
} from 'app/shared/components/signal-inputs/date-input/date.validators';
import { validateYear } from 'app/shared/components/signal-inputs/number-input/number.input';
import { requiredMessage } from 'app/shared/utils/signal-schema.utils';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'environments/environment';

export const officeOptions = [
  { label: 'House', value: 'House' },
  { label: 'Presidential', value: 'Presidential' },
  { label: 'Senate', value: 'Senate' },
];
export const electionTypeOptions = [
  { label: 'General', value: 'General' },
  { label: 'Special', value: 'Special' },
];

export type ElectionCycleForm = Omit<ElectionCycle, 'toJson' | 'id'>;
export const INITIAL_FORM_VALUE: ElectionCycleForm = {
  office: null,
  electionType: null,
  electionYear: '',
  coverage: { startDate: null, endDate: null },
} as const;

export function createElectionCycleForm(
  model: WritableSignal<ElectionCycleForm>,
  cookieService: CookieService,
  onSubmit: () => Promise<void>,
) {
  return form(
    model,
    (schema) => {
      required(schema.office, { message: requiredMessage });
      required(schema.electionType, { message: requiredMessage });
      required(schema.electionYear, { message: requiredMessage });
      required(schema.coverage.startDate, { message: requiredMessage });
      required(schema.coverage.endDate, { message: requiredMessage });

      validateYear(schema.electionYear);
      validateDate(schema.coverage.startDate);
      validateDate(schema.coverage.endDate);
      validateDateAfter(schema.coverage);
      validateDateOverlap(schema.coverage, `${environment.apiUrl}/election-cycles/check-overlap/`, cookieService, {
        message: 'This date overlaps with another election cycle.',
      });
    },
    {
      submission: {
        ignoreValidators: 'none',
        action: onSubmit,
      },
    },
  );
}
