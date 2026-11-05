import type { MaybeFieldTree } from '@angular/forms/signals';
import { DateUtils } from 'app/shared/utils/date.utils';
import type { DateOverlapResponse } from 'app/shared/components/signal-inputs/date-input/date.validators';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mapResponseToErrors } from './create-shared-f3.utils';

describe('mapResponseToErrors', () => {
  const startField = {} as MaybeFieldTree<Date | null, string>;
  const endField = {} as MaybeFieldTree<Date | null, string>;

  const fields = { startField, endField };

  const overlappingReport = {
    report_code_label: ' F3 ',
    coverage_from_date: '2026-01-01',
    coverage_through_date: '2026-06-30',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return an error for the start field when start_date is present', () => {
    const response = {
      start_date: '2026-01-01',
      end_date: null,
      overlapping_reports: [overlappingReport],
    } as unknown as DateOverlapResponse;
    expect(mapResponseToErrors(response, fields)).toEqual([
      {
        kind: 'overlap',
        message:
          'You have entered coverage dates that overlap the coverage dates of the following report: F3 01/01/2026 - 06/30/2026',
        fieldTree: startField,
      },
    ]);
  });

  it('should return an error for the end field when end_date is present', () => {
    const response = {
      start_date: null,
      end_date: 'Coverage overlaps',
      overlapping_reports: [overlappingReport],
    } as unknown as DateOverlapResponse;

    expect(mapResponseToErrors(response, fields)).toEqual([
      {
        kind: 'overlap',
        message:
          'You have entered coverage dates that overlap the coverage dates of the following report: F3 01/01/2026 - 06/30/2026',
        fieldTree: endField,
      },
    ]);
  });

  it('should return errors for both fields when both dates are present', () => {
    const response = {
      start_date: 'Coverage overlaps',
      end_date: 'Coverage overlaps',
      overlapping_reports: [overlappingReport],
    } as unknown as DateOverlapResponse;

    const result = mapResponseToErrors(response, fields);

    expect(result).toHaveLength(2);
    expect(result?.[0].fieldTree).toBe(startField);
    expect(result?.[1].fieldTree).toBe(endField);
    expect(result?.[0].message).toBe(result?.[1].message);
  });

  it('should return null when neither date has an error', () => {
    const response = {
      start_date: null,
      end_date: null,
      overlapping_reports: [overlappingReport],
    } as unknown as DateOverlapResponse;

    expect(mapResponseToErrors(response, fields)).toBeNull();
  });

  it('should return an empty message when there are no overlapping reports', () => {
    const response = {
      start_date: 'Coverage overlaps',
      end_date: null,
      overlapping_reports: [],
    } as unknown as DateOverlapResponse;

    expect(mapResponseToErrors(response, fields)).toEqual([
      {
        kind: 'overlap',
        message: '',
        fieldTree: startField,
      },
    ]);
  });

  it('should use only the first overlapping report in the error message', () => {
    const response = {
      start_date: 'Coverage overlaps',
      end_date: null,
      overlapping_reports: [
        overlappingReport,
        {
          report_code_label: 'F3X',
          coverage_from_date: '07-01-2026',
          coverage_through_date: '12-31-2026',
        },
      ],
    } as unknown as DateOverlapResponse;

    const result = mapResponseToErrors(response, fields);

    expect(result?.[0].message).toContain('report: F3 01/01/2026 - 06/30/2026');
    expect(result?.[0].message).not.toContain('F3X');
  });

  it('should convert the overlapping report dates using DateUtils', () => {
    const convertSpy = vi.spyOn(DateUtils, 'convertFecFormatToSlashFormat');
    const response = {
      start_date: 'Coverage overlaps',
      end_date: null,
      overlapping_reports: [overlappingReport],
    } as unknown as DateOverlapResponse;

    mapResponseToErrors(response, fields);

    expect(convertSpy).toHaveBeenCalledWith('2026-01-01');
    expect(convertSpy).toHaveBeenCalledWith('2026-06-30');
  });
});
