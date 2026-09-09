import type { Mock } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Form3X } from 'app/shared/models';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { ReportCodes } from 'app/shared/utils/report-code.utils';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CreateSharedF3Component } from './create-shared-f3.component';
import { FORM_3_SERVICE, BaseForm3Service } from 'app/shared/services/base-form-3.service';
import { BaseForm3 } from 'app/shared/models/reports/base-form-3';
import { FEATURE_FLAGS } from 'environments/tokens/feature-flags.config';
import { provideMockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';

let component: CreateSharedF3Component;
let fixture: ComponentFixture<CreateSharedF3Component>;
let router: Router;
let activeServiceInstance: BaseForm3Service<BaseForm3>;

async function setup(params: { reportId?: string; mockUrl?: string }) {
  const currentUrl = params.mockUrl ?? '/reports/f3x/create/step-1';

  await TestBed.configureTestingModule({
    imports: [ReactiveFormsModule, CreateSharedF3Component],
    providers: [
      provideRouter([]),
      provideHttpClient(),
      provideHttpClientTesting(),
      Form3XService,
      MessageService,
      ConfirmationService,
      { provide: FORM_3_SERVICE, useClass: Form3XService },
      provideMockStore({
        ...testMockStore(),
        initialState: {
          committeeAccount: {
            committeeAccount: {
              filing_frequency: 'Q',
              candidate_state: 'VA',
            },
          },
        },
      }),
    ],
  }).compileComponents();

  router = TestBed.inject(Router);
  activeServiceInstance = TestBed.inject(FORM_3_SERVICE);

  vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
  Object.defineProperty(router, 'url', {
    get: () => currentUrl,
    configurable: true,
  });
}

describe('CreateSharedF3Component: New', () => {
  const mockCoverageDates = [
    {
      report_code: ReportCodes.Q1,
      coverage_from_date: new Date('2024-01-01'),
      coverage_through_date: new Date('2024-03-31'),
    },
  ];

  beforeEach(async () => {
    await setup({});

    vi.spyOn(activeServiceInstance, 'getCoverageDates').mockResolvedValue(mockCoverageDates);
    fixture = TestBed.createComponent(CreateSharedF3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and initialize the form for a new report', async () => {
    expect(component).toBeTruthy();
    expect(component.isF3X()).toBe(true);
    expect(component.title()).toBe('Form 3X');
    expect(component.reportId()).toBeNull();

    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.form.filingFrequency().value()).toBe('Q');
  });

  it('should call create method on save when form is valid', async () => {
    const mockForm3X = new Form3X();
    mockForm3X.id = '999';
    const createSpy = vi.spyOn(activeServiceInstance, 'create').mockResolvedValue(mockForm3X);

    component.form.reportCode().value.set(ReportCodes.Q2);
    component.form.coverages.from().value.set(new Date('2024-04-01'));
    component.form.coverages.to().value.set(new Date('2024-06-30'));

    fixture.detectChanges();

    await component.submitForm('continue');

    expect(createSpy).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith(`/reports/transactions/report/999/list`);
  });

  it('should not save if form is invalid', async () => {
    const createSpy = vi.spyOn(activeServiceInstance, 'create');
    const updateSpy = vi.spyOn(activeServiceInstance, 'updateWithAllowedErrorCodes');

    await fixture.whenStable();
    fixture.detectChanges();

    // Invalidating required field
    component.form.coverages.from().value.set(null as unknown as Date);
    fixture.detectChanges();

    await component.submitForm();

    expect(createSpy).not.toHaveBeenCalled();
    expect(updateSpy).not.toHaveBeenCalled();
  });
});

describe('CreateSharedF3Component: Edit', () => {
  let messageService: MessageService;
  let getSpy: Mock;
  let messageSpy: Mock;
  const mockReportId = '123';
  const mockReport = Form3X.fromJSON({
    id: mockReportId,
    filing_frequency: 'M',
    report_type_category: 'Election Year',
    report_code: ReportCodes.M4,
    coverage_from_date: '2024-04-05',
    coverage_through_date: '2024-04-30',
  });

  beforeEach(async () => {
    await setup({ reportId: mockReportId });

    messageService = TestBed.inject(MessageService);
    getSpy = vi.spyOn(activeServiceInstance, 'get').mockResolvedValue(mockReport);
    vi.spyOn(activeServiceInstance, 'getTransactionsOutsideCoverage').mockResolvedValue(0);
    messageSpy = vi.spyOn(messageService, 'add');

    fixture = TestBed.createComponent(CreateSharedF3Component);
    component = fixture.componentInstance;

    // Simulate store resolving report data
    component.sharedF3Store.report.value.set(mockReport);
    fixture.detectChanges();
  });

  it('should fetch existing report and populate signal form fields', () => {
    expect(component.form.reportCode().value()).toBe(ReportCodes.M4);
    expect(component.form.filingFrequency().value()).toBe('M');

    const coverageFromDate = component.form.coverages.from().value() as Date;
    expect(coverageFromDate.getMonth()).toEqual(3); // April
    expect(coverageFromDate.getDate()).toEqual(5); // 5th
    expect(coverageFromDate.getFullYear()).toEqual(2024); // 2024
  });

  it('should call update method on save', async () => {
    const updateSpy = vi.spyOn(activeServiceInstance, 'updateWithAllowedErrorCodes').mockResolvedValue(mockReport);

    component.form.coverages.from().value.set(new Date('2024-06-01'));
    component.form.coverages.to().value.set(new Date('2024-07-01'));

    await component.submitForm();

    expect(updateSpy).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/reports');
    expect(messageSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'success',
        summary: 'Successful',
        detail: 'Report Updated',
      }),
    );
  });

  describe('Reactive Logic', () => {
    it('should update reportCodes when filing frequency and category change', () => {
      component.form.reportTypeCategory().value.set('Election Year');
      component.form.filingFrequency().value.set('M');
      fixture.detectChanges();

      expect(Array.from(component.reportCodes())).toContain(ReportCodes.M2);

      component.form.filingFrequency().value.set('Q');
      fixture.detectChanges();

      expect(Array.from(component.reportCodes())).toContain(ReportCodes.Q1);
    });

    it('should automatically update coverage dates when report code changes', async () => {
      component.form.reportCode().value.set(ReportCodes.M2);
      fixture.detectChanges();
      await fixture.whenStable();

      const fromDate = component.form.coverages.from().value() as Date;
      const throughDate = component.form.coverages.to().value() as Date;

      expect(fromDate.getMonth()).toBe(1); // February
      expect(throughDate.getMonth()).toBe(1);
    });
  });
});
