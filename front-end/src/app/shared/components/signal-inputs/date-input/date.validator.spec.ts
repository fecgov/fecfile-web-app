import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';
import { CookieService } from 'ngx-cookie-service';
import { validateDate, validateDateAfter, validateDateOverlap } from './date.validators';
import { Coverage } from 'app/tools/election-cycle/election-cycle.model';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { detectChangesAndWait } from 'app/shared/utils/unit-test.utils';

interface TestFormModel {
  coverage: Coverage;
}

describe('Date Validators (Integration via Signal Form)', () => {
  let cookieService: CookieService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CookieService, useValue: { get: vi.fn().mockReturnValue('mock-cookie') } },
      ],
    });
    cookieService = TestBed.inject(CookieService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
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
    function createOverlapTestForm(coverage: Coverage, options?: Parameters<typeof validateDateOverlap>[3]) {
      return TestBed.runInInjectionContext(() => {
        const model = signal<{ coverage: Coverage }>({ coverage });

        const testForm = form(model, (schema) => {
          validateDateOverlap(schema.coverage, '/api/check-overlap', cookieService, options);
        });

        return { model, form: testForm };
      });
    }

    it('should attach overlap errors to both date fields when both dates overlap', async () => {
      const { form } = createOverlapTestForm({
        startDate: new Date('2020-01-01'),
        endDate: new Date('2020-01-10'),
      });

      await detectChangesAndWait();

      const request = httpTestingController.expectOne((req) => req.url === '/api/check-overlap');

      request.flush({ start_date: true, end_date: true });

      await detectChangesAndWait();

      expect(form.coverage.startDate().errors()).toContainEqual(
        expect.objectContaining({
          kind: 'overlap',
          message: 'The selected dates overlap with an existing period.',
        }),
      );

      expect(form.coverage.endDate().errors()).toContainEqual(
        expect.objectContaining({
          kind: 'overlap',
          message: 'The selected dates overlap with an existing period.',
        }),
      );
    });

    it('should attach an overlap error only to the start date when start_date is true', async () => {
      const { form } = createOverlapTestForm({
        startDate: new Date('2020-01-01'),
        endDate: new Date('2020-01-10'),
      });

      await detectChangesAndWait();

      const request = httpTestingController.expectOne((req) => req.url === '/api/check-overlap');

      request.flush({ start_date: true, end_date: false });

      await detectChangesAndWait();

      expect(form.coverage.startDate().errors()).toContainEqual(expect.objectContaining({ kind: 'overlap' }));
      expect(form.coverage.endDate().errors()).toEqual([]);
    });

    it('should use the custom error message when provided', async () => {
      const customMessage = 'These dates conflict with an existing election cycle.';

      const { form } = createOverlapTestForm(
        {
          startDate: new Date('2020-01-01'),
          endDate: new Date('2020-01-10'),
        },
        { message: customMessage },
      );

      await detectChangesAndWait();

      const request = httpTestingController.expectOne((req) => req.url === '/api/check-overlap');

      request.flush({ start_date: false, end_date: true });

      await detectChangesAndWait();

      expect(form.coverage.endDate().errors()).toContainEqual(
        expect.objectContaining({
          kind: 'overlap',
          message: customMessage,
        }),
      );
    });

    it('should delegate error mapping to mapResponseToErrors when provided', async () => {
      const customError = {
        kind: 'customOverlap',
        message: 'Custom validation error',
      };

      const mapResponseToErrors = vi.fn((response, fields) => {
        if (response.start_date) {
          return [
            {
              ...customError,
              fieldTree: fields.startField,
            },
          ];
        }

        return null;
      });

      const { form } = createOverlapTestForm(
        {
          startDate: new Date('2020-01-01'),
          endDate: new Date('2020-01-10'),
        },
        { mapResponseToErrors },
      );

      await detectChangesAndWait();

      const request = httpTestingController.expectOne((req) => req.url === '/api/check-overlap');

      request.flush({ start_date: true, end_date: true });

      await detectChangesAndWait();
      expect(form.coverage().valid()).toBeFalsy();

      expect(mapResponseToErrors).toHaveBeenCalledWith(
        { start_date: true, end_date: true },
        expect.objectContaining({
          startField: expect.anything(),
          endField: expect.anything(),
        }),
      );

      expect(form.coverage.startDate().errors()).toContainEqual(
        expect.objectContaining({
          kind: 'customOverlap',
          message: 'Custom validation error',
        }),
      );

      expect(form.coverage.endDate().errors()).toEqual([]);
    });

    it('should not apply default overlap errors when custom mapping returns null', async () => {
      const mapResponseToErrors = vi.fn(() => null);

      const { form } = createOverlapTestForm(
        {
          startDate: new Date('2020-01-01'),
          endDate: new Date('2020-01-10'),
        },
        { mapResponseToErrors },
      );

      await detectChangesAndWait();

      const request = httpTestingController.expectOne((req) => req.url === '/api/check-overlap');

      request.flush({ start_date: true, end_date: true });

      await detectChangesAndWait();
      expect(form.coverage().valid()).toBeTruthy();
      expect(mapResponseToErrors).toHaveBeenCalledOnce();
      expect(form.coverage.startDate().errors()).toEqual([]);
      expect(form.coverage.endDate().errors()).toEqual([]);
    });

    it('should include exclude_id when excludeId is provided', async () => {
      createOverlapTestForm(
        {
          startDate: new Date('2020-01-01'),
          endDate: new Date('2020-01-10'),
        },
        { excludeId: 'cycle-123' },
      );

      await detectChangesAndWait();

      const request = httpTestingController.expectOne((req) => req.url === '/api/check-overlap');

      expect(request.request.params.get('exclude_id')).toBe('cycle-123');
      expect(request.request.params.get('start_date')).toBeTruthy();
      expect(request.request.params.get('end_date')).toBeTruthy();

      request.flush({ start_date: false, end_date: false });
    });

    it('should not send exclude_id when excludeId is initial', async () => {
      createOverlapTestForm(
        {
          startDate: new Date('2020-01-01'),
          endDate: new Date('2020-01-10'),
        },
        { excludeId: 'initial' },
      );

      await detectChangesAndWait();

      const request = httpTestingController.expectOne((req) => req.url === '/api/check-overlap');

      expect(request.request.params.has('exclude_id')).toBe(false);

      request.flush({ start_date: false, end_date: false });
    });

    it('should report a serverError when the overlap request fails', async () => {
      const { form } = createOverlapTestForm({
        startDate: new Date('2020-01-01'),
        endDate: new Date('2020-01-10'),
      });

      await detectChangesAndWait();

      const request = httpTestingController.expectOne((req) => req.url === '/api/check-overlap');

      request.flush('Server error', {
        status: 500,
        statusText: 'Internal Server Error',
      });

      await detectChangesAndWait();

      expect(form.coverage().errors()).toContainEqual(
        expect.objectContaining({
          kind: 'serverError',
          message: 'Could not verify date coverage overlap.',
        }),
      );
    });
  });
});
