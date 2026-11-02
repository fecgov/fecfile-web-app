import { describe, expect, it, vi } from 'vitest';
import { CommitteeStore } from 'app/committee/committee.store';
import { BaseForm3 } from 'app/shared/models/reports/base-form-3';
import { F3FormTypes, Form3 } from 'app/shared/models/reports/form-3.model';
import { F3xFormTypes, Form3X } from 'app/shared/models/reports/form-3x.model';
import {
  getCoverageDates,
  getReportCodes,
  ReportCodes,
  type FilingFrequency,
} from 'app/shared/utils/report-code.utils';
import type { Coverage, ElectionCycle } from 'app/tools/election-cycle/election-cycle.model';

import {
  buildJson,
  createInitialModel,
  fieldsToValidate,
  getDefaultReportCode,
  ReportTypeCategories,
  type SharedForm3Model,
} from './shared-form3.model';

const currentYear = new Date().getFullYear();
const jan1 = new Date(2026, 0, 1);
const mar31 = new Date(2026, 2, 31);
const apr1 = new Date(2026, 3, 1);
const jun30 = new Date(2026, 5, 30);

const unusedCode = 'UNUSED_TEST_CODE' as ReportCodes;
const anotherCode = 'ANOTHER_TEST_CODE' as ReportCodes;

function createCommitteeStore(
  candidateState: string | null = 'VA',
  filingFrequency: FilingFrequency = 'Q',
): CommitteeStore {
  return {
    committee: vi.fn().mockReturnValue(candidateState === null ? null : { candidate_state: candidateState }),
    filingFrequency: vi.fn().mockReturnValue(filingFrequency),
  } as unknown as CommitteeStore;
}

function createReport(overrides: Partial<BaseForm3> = {}): BaseForm3 {
  return {
    report_type_category: ReportTypeCategories.ELECTION_YEAR,
    report_code: ReportCodes.TER,
    coverage_from_date: '2026-01-01',
    coverage_through_date: '2026-03-31',
    date_of_election: '2026-11-03',
    state_of_election: 'VA',
    form_type: F3FormTypes.F3T,
    ...overrides,
  } as BaseForm3;
}

function createFormValue(overrides: Partial<SharedForm3Model> = {}): SharedForm3Model {
  return {
    filingFrequency: 'Q',
    reportTypeCategory: ReportTypeCategories.ELECTION_YEAR,
    reportCode: unusedCode,
    coverage: {
      startDate: jan1,
      endDate: mar31,
    } as Coverage,
    electionReport: {
      date: jan1,
      state: 'VA',
    },
    electionCycle: null,
    nextElectionCycle: null,
    ...overrides,
  };
}

function getExpectedDefaultCategory(): ReportTypeCategories {
  const isEvenYear = currentYear % 2 === 0;
  const isJanuary = new Date().getMonth() === 0;

  return (isEvenYear && isJanuary) || (!isEvenYear && !isJanuary)
    ? ReportTypeCategories.NON_ELECTION_YEAR
    : ReportTypeCategories.ELECTION_YEAR;
}

describe('shared-form3.model', () => {
  describe('fieldsToValidate', () => {
    it('should contain the expected fields', () => {
      expect(fieldsToValidate).toEqual([
        'filing_frequency',
        'report_type_category',
        'report_code',
        'coverage_from_date',
        'coverage_through_date',
        'date_of_election',
        'state_of_election',
        'form_type',
      ]);
    });
  });

  describe('getDefaultReportCode', () => {
    it('should return the first report code that has not been used', () => {
      expect(getDefaultReportCode([unusedCode, anotherCode], [unusedCode])).toBe(anotherCode);
    });

    it('should return the first code when no codes have been used', () => {
      expect(getDefaultReportCode([unusedCode, anotherCode], [])).toBe(unusedCode);
    });

    it('should return null when every report code has been used', () => {
      expect(getDefaultReportCode([unusedCode, anotherCode], [unusedCode, anotherCode])).toBeNull();
    });

    it('should return null when no report codes are available', () => {
      expect(getDefaultReportCode([], [])).toBeNull();
    });
  });

  describe('createInitialModel', () => {
    describe('when creating a report', () => {
      it('should initialize a quarterly F3 model', () => {
        const committeeStore = createCommitteeStore('VA', 'M');
        const model = createInitialModel(null, false, [], committeeStore);

        expect(model).toEqual(
          expect.objectContaining({
            filingFrequency: 'Q',
            reportTypeCategory: getExpectedDefaultCategory(),
            electionReport: {
              date: null,
              state: 'VA',
            },
            electionCycle: null,
          }),
        );

        const reportCodes = getReportCodes(
          getExpectedDefaultCategory() === ReportTypeCategories.ELECTION_YEAR,
          'Q',
          false,
        );

        expect(model.reportCode).toBe(getDefaultReportCode(reportCodes, []));

        expect(committeeStore.committee).toHaveBeenCalled();
        expect(committeeStore.filingFrequency).not.toHaveBeenCalled();
      });

      it('should initialize a monthly F3X model when the committee files monthly', () => {
        const committeeStore = createCommitteeStore('VA', 'M');
        const model = createInitialModel(null, true, [], committeeStore);

        expect(model.filingFrequency).toBe('M');

        const reportCodes = getReportCodes(
          getExpectedDefaultCategory() === ReportTypeCategories.ELECTION_YEAR,
          'M',
          true,
        );

        expect(model.reportCode).toBe(getDefaultReportCode(reportCodes, []));

        expect(committeeStore.filingFrequency).toHaveBeenCalled();
      });

      it('should default an F3X model to quarterly when the committee files quarterly', () => {
        const model = createInitialModel(null, true, [], createCommitteeStore('VA', 'Q'));

        expect(model.filingFrequency).toBe('Q');
      });

      it('should default an F3X model to quarterly when the committee filing frequency is not monthly', () => {
        const committeeStore = createCommitteeStore('VA', 'Q');

        const model = createInitialModel(undefined, true, [], committeeStore);

        expect(model.filingFrequency).toBe('Q');
      });

      it('should use the first unused report code', () => {
        const reportCodes = getReportCodes(
          getExpectedDefaultCategory() === ReportTypeCategories.ELECTION_YEAR,
          'Q',
          false,
        );
        const usedCodes = reportCodes.slice(0, 1);

        const model = createInitialModel(null, false, usedCodes, createCommitteeStore());

        expect(model.reportCode).toBe(getDefaultReportCode(reportCodes, usedCodes));
      });

      it('should return null for the election state when the committee has no candidate state', () => {
        const model = createInitialModel(null, false, [], createCommitteeStore(null));

        expect(model.electionReport.state).toBeNull();
      });

      it('should initialize coverage dates from the default report code', () => {
        const isElectionYear = getExpectedDefaultCategory() === ReportTypeCategories.ELECTION_YEAR;
        const reportCodes = getReportCodes(isElectionYear, 'Q', false);
        const expectedCode = getDefaultReportCode(reportCodes, []);
        const expectedDates = getCoverageDates(expectedCode, currentYear, isElectionYear, 'Q');

        const model = createInitialModel(null, false, [], createCommitteeStore());

        expect(model.coverage).toEqual({
          startDate: expectedDates?.[0] ?? null,
          endDate: expectedDates?.[1] ?? null,
        });
      });
    });

    describe('when editing a report', () => {
      it('should preserve the existing report values', () => {
        const report = createReport();

        const model = createInitialModel(report, false, [], createCommitteeStore('MD'));

        expect(model).toEqual({
          filingFrequency: 'Q',
          reportTypeCategory: ReportTypeCategories.ELECTION_YEAR,
          reportCode: ReportCodes.TER,
          coverage: {
            startDate: '2026-01-01',
            endDate: '2026-03-31',
          },
          electionReport: {
            date: '2026-11-03',
            state: 'VA',
          },
          electionCycle: null,
          nextElectionCycle: null,
        });
      });

      it('should preserve the existing monthly filing frequency for F3X', () => {
        const report = createReport({
          filing_frequency: 'M',
        } as Partial<Form3X>);

        const model = createInitialModel(report, true, [], createCommitteeStore());

        expect(model.filingFrequency).toBe('M');
      });

      it('should default the filing frequency to quarterly for F3X when the report is not monthly', () => {
        const report = createReport({
          filing_frequency: 'Q',
        } as Partial<Form3X>);

        const model = createInitialModel(report, true, [], createCommitteeStore());

        expect(model.filingFrequency).toBe('Q');
      });

      it('should default the filing frequency to quarterly for F3', () => {
        const report = createReport({
          filing_frequency: 'M',
        } as Partial<Form3X>);

        const model = createInitialModel(report, false, [], createCommitteeStore());

        expect(model.filingFrequency).toBe('Q');
      });

      it('should use the committee state when the report election state is null', () => {
        const report = createReport({
          state_of_election: undefined,
        });

        const model = createInitialModel(report, false, [], createCommitteeStore('MD'));

        expect(model.electionReport.state).toBe('MD');
      });

      it('should use null when both the report election state and committee state are null', () => {
        const report = createReport({
          state_of_election: undefined,
        });

        const model = createInitialModel(report, false, [], createCommitteeStore(null));

        expect(model.electionReport.state).toBeNull();
      });

      it('should default missing coverage dates to null', () => {
        const report = createReport({
          coverage_from_date: undefined,
          coverage_through_date: undefined,
        });

        const model = createInitialModel(report, false, [], createCommitteeStore());

        expect(model.coverage).toEqual({
          startDate: null,
          endDate: null,
        });
      });

      it('should default a missing election date to null', () => {
        const report = createReport({
          date_of_election: undefined,
        });

        const model = createInitialModel(report, false, [], createCommitteeStore());

        expect(model.electionReport.date).toBeNull();
      });

      it('should preserve the existing election cycle', () => {
        const electionCycle = {
          electionYear: currentYear,
        } as ElectionCycle;

        const report = createReport({
          electionCycle,
        } as Partial<Form3>);

        const model = createInitialModel(report, false, [], createCommitteeStore());

        expect(model.electionCycle).toBe(electionCycle);
      });

      it('should default a missing election cycle to null', () => {
        const model = createInitialModel(createReport(), false, [], createCommitteeStore());

        expect(model.electionCycle).toBeNull();
      });

      it('should not use the committee filing frequency when editing', () => {
        const committeeStore = createCommitteeStore('VA', 'M');

        createInitialModel(createReport(), true, [], committeeStore);

        expect(committeeStore.filingFrequency).not.toHaveBeenCalled();
      });
    });
  });

  describe('buildJson', () => {
    it('should map the shared form values to an F3 report', () => {
      const report = createReport();
      const formValue = createFormValue();

      const result = buildJson(report, formValue, false, true);

      expect(result).toBe(report);
      expect(report).toEqual(
        expect.objectContaining({
          report_type_category: formValue.reportTypeCategory,
          report_code: formValue.reportCode,
          coverage_from_date: formValue.coverage.startDate,
          coverage_through_date: formValue.coverage.endDate,
          date_of_election: formValue.electionReport.date,
          state_of_election: formValue.electionReport.state,
          electionCycle: null,
        }),
      );
    });

    it('should assign the election cycle for F3 reports', () => {
      const report = createReport();
      const electionCycle = {
        electionYear: currentYear,
      } as ElectionCycle;

      const formValue = createFormValue({ electionCycle });

      buildJson(report, formValue, false, true);

      expect((report as Form3).electionCycle).toBe(electionCycle);
    });

    it('should assign the filing frequency for F3X reports', () => {
      const report = createReport();
      const formValue = createFormValue({
        filingFrequency: 'M',
      });

      buildJson(report, formValue, true, true);

      expect((report as Form3X).filing_frequency).toBe('M');
    });

    it('should set the F3 form type to F3T when the report code is TER', () => {
      const report = createReport();
      const formValue = createFormValue({
        reportCode: ReportCodes.TER,
      });

      buildJson(report, formValue, false, true);

      expect(report.form_type).toBe(F3FormTypes.F3T);
    });

    it('should set the F3X form type to F3XT when the report code is TER', () => {
      const report = createReport();
      const formValue = createFormValue({
        reportCode: ReportCodes.TER,
      });

      buildJson(report, formValue, true, true);

      expect(report.form_type).toBe(F3xFormTypes.F3XT);
    });

    it('should not change the existing form type when the report code is not TER', () => {
      const existingFormType = 'EXISTING_FORM_TYPE';
      const report = createReport({
        form_type: existingFormType,
      });

      const formValue = createFormValue({
        reportCode: unusedCode,
      });

      buildJson(report, formValue, false, true);

      expect(report.form_type).toBe(existingFormType);
    });

    it('should include election date and state when the report has an election report', () => {
      const report = createReport();
      const formValue = createFormValue({
        electionReport: {
          date: jan1,
          state: 'CA',
        },
      });

      buildJson(report, formValue, false, true);

      expect(report.date_of_election).toBe(jan1);
      expect(report.state_of_election).toBe('CA');
    });

    it('should set election date and state to undefined when the report has no election report', () => {
      const report = createReport();
      const formValue = createFormValue();

      buildJson(report, formValue, false, false);

      expect(report.date_of_election).toBeUndefined();
      expect(report.state_of_election).toBeUndefined();
    });

    it('should update coverage dates from the form values', () => {
      const report = createReport();
      const formValue = createFormValue({
        coverage: {
          startDate: apr1,
          endDate: jun30,
        } as Coverage,
      });

      buildJson(report, formValue, false, true);

      expect(report.coverage_from_date).toBe(apr1);
      expect(report.coverage_through_date).toBe(jun30);
    });

    it('should overwrite existing report values with the form values', () => {
      const report = createReport({
        report_code: anotherCode,
        coverage_from_date: jan1,
        coverage_through_date: mar31,
      });

      const formValue = createFormValue({
        reportCode: unusedCode,
        coverage: {
          startDate: apr1,
          endDate: jun30,
        } as Coverage,
      });

      buildJson(report, formValue, false, true);

      expect(report.report_code).toBe(unusedCode);
      expect(report.coverage_from_date).toBe(apr1);
      expect(report.coverage_through_date).toBe(jun30);
    });
  });
});
