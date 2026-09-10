import type { Mock } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { Form3X, F3xFormTypes } from 'app/shared/models';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { ReportCodes } from 'app/shared/utils/report-code.utils';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CreateSharedF3Component, ReportTypeCategories } from './create-shared-f3.component';
import { FORM_3_SERVICE, BaseForm3Service } from 'app/shared/services/base-form-3.service';
import { BaseForm3 } from 'app/shared/models/reports/base-form-3';
import { FEATURE_FLAGS, FeatureFlags } from 'environments/config/feature-flag.config';

let component: CreateSharedF3Component;
let fixture: ComponentFixture<CreateSharedF3Component>;
let router: Router;
let activeServiceInstance: BaseForm3Service<BaseForm3>;
let store: MockStore;
let confirmService: ConfirmationService;
let messageService: MessageService;
let getSpy: Mock;
let messageSpy: Mock;
let updateSpy: Mock;
let confirmSpy: Mock;
let coverageDateSpy: Mock;

const defaultMockFlags: FeatureFlags = {
  showGlossary: false,
  showForm3: false,
  showSchedF: false,
  enableUnassignedTransactions: false,
  enableImport: false,
  manualReportVersion: false,
  userCanSetFilingFrequency: false,
};

const mockCoverageDates = [
  {
    report_code: ReportCodes.Q1,
    coverage_from_date: new Date('2024-01-01'),
    coverage_through_date: new Date('2024-03-31'),
  },
];

async function setup(params: {
  reportId?: string;
  mockUrl?: string;
  featureFlags?: Partial<FeatureFlags>;
  mockReport?: BaseForm3;
  fakeDate?: Date;
}) {
  const currentUrl = params.mockUrl ?? '/reports/f3x/create/step-1';
  await TestBed.configureTestingModule({
    imports: [ReactiveFormsModule, CreateSharedF3Component],
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      Form3XService,
      MessageService,
      { provide: FORM_3_SERVICE, useClass: Form3XService },
      {
        provide: ActivatedRoute,
        useValue: {
          params: of(params),
          snapshot: { params: of(params) },
        },
      },
      provideMockStore(testMockStore()),
      ConfirmationService,
      {
        provide: FEATURE_FLAGS,
        useValue: { ...defaultMockFlags, ...params.featureFlags },
      },
    ],
  }).compileComponents();

  messageService = TestBed.inject(MessageService);
  store = TestBed.inject(MockStore);
  confirmService = TestBed.inject(ConfirmationService);
  vi.spyOn(store, 'dispatch');
  router = TestBed.inject(Router);
  activeServiceInstance = TestBed.inject(FORM_3_SERVICE);
  messageSpy = vi.spyOn(messageService, 'add');
  vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
  Object.defineProperty(router, 'url', {
    get: () => currentUrl,
    configurable: true,
  });

  coverageDateSpy = vi.spyOn(activeServiceInstance, 'getCoverageDates').mockResolvedValue(mockCoverageDates);
  confirmSpy = vi.spyOn(confirmService, 'confirm').mockImplementation((confirmation) => {
    if (confirmation.reject) {
      confirmation.reject();
    }
    return confirmService;
  });
  vi.spyOn(activeServiceInstance, 'getTransactionsOutsideCoverage').mockResolvedValue(5);
  if (params.mockReport) {
    getSpy = vi.spyOn(activeServiceInstance, 'get').mockResolvedValue(params.mockReport);
    updateSpy = vi.spyOn(activeServiceInstance, 'updateWithAllowedErrorCodes').mockResolvedValue(params.mockReport);
  }

  if (params.fakeDate) vi.setSystemTime(params.fakeDate);

  fixture = TestBed.createComponent(CreateSharedF3Component);
  component = fixture.componentInstance;
  fixture.detectChanges();
}

beforeEach(async () => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('CreateSharedF3Component: New', () => {
  beforeEach(async () => {
    await setup({});
  });

  it('should create and initialize the form for a new report', async () => {
    expect(component).toBeTruthy();
    expect(component.isF3X()).toBe(true);
    expect(component.title()).toBe('Form 3X');
    expect(component.reportId()).toBeNull();

    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.form.get('filing_frequency')?.value).toBe('Q');
    expect(component.form.get('form_type')?.value).toBe(F3xFormTypes.F3XN);
    expect(coverageDateSpy).toHaveBeenCalled();
  });

  it('should call create method on save when form is valid', async () => {
    const mockForm3X = new Form3X();
    mockForm3X.id = '999';
    const createSpy = vi.spyOn(activeServiceInstance, 'create').mockResolvedValue(mockForm3X);

    component.form.patchValue({
      report_code: ReportCodes.Q2,
      coverage_from_date: new Date('2024-04-01'),
      coverage_through_date: new Date('2024-06-30'),
    });
    fixture.detectChanges();

    await component.submitForm('continue');

    expect(createSpy).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith(`/reports/transactions/report/999/list`);
  });

  it('should not save and should dispatch singleClickEnableAction if form is invalid', async () => {
    const createSpy = vi.spyOn(activeServiceInstance, 'create');
    const updateSpy = vi.spyOn(activeServiceInstance, 'updateWithAllowedErrorCodes');

    await fixture.whenStable();
    fixture.detectChanges();
    // now invalidate the form
    component.form.patchValue({ coverage_from_date: null });
    expect(component.form.valid).toBe(false);

    await component.submitForm();

    expect(component.formSubmitted).toBe(true);
    expect(createSpy).not.toHaveBeenCalled();
    expect(updateSpy).not.toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: '[SingleClickButtonDisabled] False' }));
  });
});

describe('CreateSharedF3Component: Edit', () => {
  const mockReportId = '123';
  const mockReport = Form3X.fromJSON({
    id: mockReportId,
    filing_frequency: 'M',
    report_type_category: ReportTypeCategories.ELECTION_YEAR,
    report_code: ReportCodes.M4,
    coverage_from_date: '2024-04-05',
    coverage_through_date: '2024-04-30',
  });

  beforeEach(async () => {
    await setup({ reportId: mockReportId, mockReport });
  });

  it('should fetch existing report and patch form', () => {
    expect(component.reportId()).toBe(mockReportId);
    expect(getSpy).toHaveBeenCalledWith(mockReportId);
    fixture.detectChanges();
    expect(component.form.get('report_code')?.value).toBe(ReportCodes.M4);
    expect(component.form.get('filing_frequency')?.value).toBe('M');
    const coverage_from_date: Date = component.form.get('coverage_from_date')?.value;
    expect(coverage_from_date.getMonth()).toEqual(3); // April
    expect(coverage_from_date.getDate()).toEqual(5); // 5th
    expect(coverage_from_date.getFullYear()).toEqual(2024); // 2024
  });

  it('should call update method on save', async () => {
    const updateSpy = vi.spyOn(activeServiceInstance, 'updateWithAllowedErrorCodes').mockResolvedValue(mockReport);
    component.form.patchValue({ coverage_from_date: new Date('2024-06-01') });
    component.form.patchValue({ coverage_through_date: new Date('2024-07-01') });
    await component.submitForm();

    expect(updateSpy).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/reports');
    expect(messageSpy).toHaveBeenCalled();
  });

  describe('Reactive Logic', () => {
    it('should update reportCodes when filing frequency and category change', () => {
      component.form.patchValue({
        filing_frequency: 'M',
        report_type_category: ReportTypeCategories.ELECTION_YEAR,
      });
      fixture.detectChanges();
      expect(component.reportCodes()).toContainEqual(ReportCodes.M2);

      component.form.patchValue({ filing_frequency: 'Q' });
      fixture.detectChanges();
      expect(component.reportCodes()).toContainEqual(ReportCodes.Q1);
    });

    it('should automatically update coverage dates when report code changes', () => {
      component.form.get('report_code')?.setValue(ReportCodes.M2);

      fixture.detectChanges();

      const fromDate = component.form.get('coverage_from_date')?.value;
      const throughDate = component.form.get('coverage_through_date')?.value;

      expect(fromDate.getMonth()).toBe(3);
      expect(throughDate.getMonth()).toBe(3);
    });
  });
});

describe('Default Report Type Category Logic', () => {
  it('should be ELECTION_YEAR in an even year after January', async () => {
    await setup({ fakeDate: new Date(2024, 1, 1) });
    expect(component.defaultReportTypeCategory).toBe(ReportTypeCategories.ELECTION_YEAR);
  });

  it('should be ELECTION_YEAR in an odd year during January', async () => {
    await setup({ fakeDate: new Date(2025, 0, 15) });
    expect(component.defaultReportTypeCategory).toBe(ReportTypeCategories.ELECTION_YEAR);
  });

  it('should be NON_ELECTION_YEAR in an odd year after January', async () => {
    await setup({ fakeDate: new Date(2025, 2, 20) });
    expect(component.defaultReportTypeCategory).toBe(ReportTypeCategories.NON_ELECTION_YEAR);
  });

  it('should be NON_ELECTION_YEAR in an even year during January', async () => {
    await setup({ fakeDate: new Date(2024, 0, 10) });
    expect(component.defaultReportTypeCategory).toBe(ReportTypeCategories.NON_ELECTION_YEAR);
  });
});

describe('unassigned transactions', () => {
  const mockReportId = '123';
  const mockReport = Form3X.fromJSON({
    id: mockReportId,
    filing_frequency: 'M',
    report_type_category: ReportTypeCategories.ELECTION_YEAR,
    report_code: ReportCodes.M4,
    coverage_from_date: '2024-04-05',
    coverage_through_date: '2024-04-30',
  });

  it('should call for confirmation if there will be unassigned transactions and unassigned feature flag is enabled', async () => {
    await setup({ reportId: mockReportId, featureFlags: { enableUnassignedTransactions: true }, mockReport });

    component.form.patchValue({ coverage_from_date: new Date('2024-06-01') });
    component.form.patchValue({ coverage_through_date: new Date('2024-07-01') });

    await component.submitForm();

    expect(updateSpy).not.toHaveBeenCalled();
    expect(confirmSpy).toHaveBeenCalled();
  });

  it(`should not call for confirmation if there will not be unassigned transactions and unassigned feature flag is enabled`, async () => {
    await setup({ reportId: mockReportId, featureFlags: { enableUnassignedTransactions: true }, mockReport });
    const updateSpy = vi.spyOn(activeServiceInstance, 'updateWithAllowedErrorCodes').mockResolvedValue(mockReport);
    const confirmSpy = vi.spyOn(confirmService, 'confirm');
    vi.spyOn(activeServiceInstance, 'getTransactionsOutsideCoverage').mockResolvedValue(0);
    component.form.patchValue({ coverage_from_date: new Date('2024-06-01') });
    component.form.patchValue({ coverage_through_date: new Date('2024-07-01') });

    expect(component.featureFlags.enableUnassignedTransactions).toBe(true);

    await component.submitForm();

    expect(updateSpy).toHaveBeenCalled();
    expect(confirmSpy).not.toHaveBeenCalled();
  });

  it('should not call for confirmation if coverage dates are changed and unassigned feature flag is disabled', async () => {
    await setup({ reportId: mockReportId, mockReport });
    const updateSpy = vi.spyOn(activeServiceInstance, 'updateWithAllowedErrorCodes').mockResolvedValue(mockReport);
    const confirmSpy = vi.spyOn(confirmService, 'confirm');
    const getTransactionsOutsideCoverageSpy = vi
      .spyOn(activeServiceInstance, 'getTransactionsOutsideCoverage')
      .mockResolvedValue(5);
    component.form.patchValue({ coverage_from_date: new Date('2024-06-01') });
    component.form.patchValue({ coverage_through_date: new Date('2024-07-01') });

    expect(component.featureFlags.enableUnassignedTransactions).toBe(false);

    await component.submitForm();
    expect(updateSpy).toHaveBeenCalled();
    expect(confirmSpy).not.toHaveBeenCalled();
    expect(getTransactionsOutsideCoverageSpy).not.toHaveBeenCalled();
  });
});
