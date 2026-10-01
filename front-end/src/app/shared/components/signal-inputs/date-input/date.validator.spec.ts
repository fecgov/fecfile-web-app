import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';
import { CookieService } from 'ngx-cookie-service';
import { validateDate, validateDateAfter, validateDateOverlap } from './date.validators';
import { DateUtils } from 'app/shared/utils/date.utils';
import { Coverage } from 'app/tools/election-cycle/election-cycle.model';

interface TestFormModel {
  coverage: Coverage;
}

describe('Date Validators (Integration via Signal Form)', () => {
  let cookieService: CookieService;

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [{ provide: CookieService, useValue: { get: vi.fn().mockReturnValue('mock-cookie') } }],
    });
    cookieService = TestBed.inject(CookieService);
  });

  function createSyncTestForm(initialCoverage: Coverage) {
    return TestBed.runInInjectionContext(() => {
      const model = signal<TestFormModel>({ coverage: initialCoverage });

      const testForm = form(model, (schema) => {
        validateDate(schema.coverage.startDate as never);
        validateDate(schema.coverage.endDate as never);
        validateDateAfter(schema.coverage);
      });

      return { model, form: testForm };
    });
  }

  describe('validateDate', () => {
    it('should mark form as invalid when startDate format is wrong', () => {
      const { form } = createSyncTestForm({
        startDate: 'invalid-date' as unknown as Date,
        endDate: new Date('2020-01-02'),
      });

      expect(form().valid()).toBe(false);
      expect(form.coverage.startDate().errors()).toContainEqual(
        expect.objectContaining({
          kind: 'pattern',
          message: 'This date does not follow the correct format, e.g. 01/01/2020',
        }),
      );
    });

    it('should strip "MM/DD/YYYY" placeholder and pass valid date string', () => {
      const { form } = createSyncTestForm({
        startDate: 'MM/DD/YYYY01/01/2020' as unknown as Date,
        endDate: new Date('2020-01-02'),
      });

      expect(form.coverage.startDate().errors()).toEqual([]);
    });
  });

  describe('validateDateAfter', () => {
    it('should flag an error on endDate when startDate is after endDate', () => {
      const { form } = createSyncTestForm({
        startDate: new Date('2020-01-10'),
        endDate: new Date('2020-01-05'),
      });

      expect(form().valid()).toBe(false);
      expect(form.coverage.endDate().errors()).toContainEqual(
        expect.objectContaining({
          kind: 'isAfter',
          message: 'END DATE must be after START DATE',
        }),
      );
    });

    it('should be valid when dates are in the correct sequence', () => {
      const { form } = createSyncTestForm({
        startDate: new Date('2020-01-01'),
        endDate: new Date('2020-01-05'),
      });

      expect(form().valid()).toBe(true);
      expect(form.coverage.endDate().errors()).toEqual([]);
    });

    it('should update reactivity dynamically when the signal model changes', () => {
      const { model, form } = createSyncTestForm({
        startDate: new Date('2020-01-01'),
        endDate: new Date('2020-01-05'),
      });

      expect(form().valid()).toBe(true);

      model.set({
        coverage: {
          startDate: new Date('2020-01-10'),
          endDate: new Date('2020-01-05'),
        },
      });

      expect(form().valid()).toBe(false);
      expect(form.coverage.endDate().errors()).toContainEqual(
        expect.objectContaining({
          kind: 'isAfter',
          message: 'END DATE must be after START DATE',
        }),
      );
    });
  });

  describe('validateDateOverlap (HTTP Validation)', () => {
    it('should trigger HTTP check with formatted parameters when dates are valid', () => {
      const convertSpy = vi.spyOn(DateUtils, 'convertDateToFecFormat');
      const startDate = new Date('2020-01-01');
      const endDate = new Date('2020-01-10');

      TestBed.runInInjectionContext(() => {
        const model = signal<{ coverage: Coverage }>({
          coverage: { startDate, endDate },
        });

        form(model, (schema) => {
          validateDateOverlap(schema.coverage, '/api/check-overlap', cookieService, { excludeId: 'cycle-123' });
        });
      });

      TestBed.tick();

      expect(convertSpy).toHaveBeenCalledWith(startDate);
      expect(convertSpy).toHaveBeenCalledWith(endDate);
    });
  });
});
