import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MessageService, ToastMessageOptions } from 'primeng/api';
import { of } from 'rxjs';
import { Form3X, F3xFormTypes, Report, CoverageDates } from 'app/shared/models';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { ReportCodes } from 'app/shared/utils/report-code.utils';
import { CreateF3XStep1Component, F3xReportTypeCategories } from './create-f3x-step1.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { singleClickEnableAction } from '../../../store/single-click.actions';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

let component: CreateF3XStep1Component;
let fixture: ComponentFixture<CreateF3XStep1Component>;
let router: Router;
let form3XService: Form3XService;
let store: MockStore;

describe('CreateF3XStep1Component: New', () => {
  const mockCoverageDates = [
    {
      report_code: ReportCodes.Q1,
      coverage_from_date: new Date('2024-01-01'),
      coverage_through_date: new Date('2024-03-31'),
    },
  ];

  let coverageDateSpy: jasmine.Spy<() => Promise<CoverageDates[]>>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CreateF3XStep1Component],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations(),
        Form3XService,
        MessageService,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            snapshot: { params: of({}) },
          },
        },
        provideMockStore(testMockStore()),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
    form3XService = TestBed.inject(Form3XService);
    spyOn(router, 'navigateByUrl').and.stub();
    spyOn(store, 'dispatch').and.callThrough();

    coverageDateSpy = spyOn(form3XService, 'getF3xCoverageDates').and.resolveTo(mockCoverageDates);
    fixture = TestBed.createComponent(CreateF3XStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and initialize the form for a new report', () => {
    expect(component).toBeTruthy();
    expect(component.reportId()).toBeNull();
    expect(component.form.get('filing_frequency')?.value).toBe('Q');
    expect(component.form.get('form_type')?.value).toBe(F3xFormTypes.F3XN);
    expect(coverageDateSpy).toHaveBeenCalled();
  });

  it('should call create method on save when form is valid', async () => {
    const mockForm3X = new Form3X();
    mockForm3X.id = '999';
    const createSpy = spyOn(form3XService, 'create').and.resolveTo(mockForm3X);

    component.form.patchValue({
      report_code: ReportCodes.Q2,
      coverage_from_date: new Date('2024-04-01'),
      coverage_through_date: new Date('2024-06-30'),
    });
    fixture.detectChanges();

    await component.save('continue');

    expect(createSpy).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith(`/reports/transactions/report/999/list`);
  });

  it('should not save and should dispatch singleClickEnableAction if form is invalid', async () => {
    const createSpy = spyOn(form3XService, 'create');
    const updateSpy = spyOn(form3XService, 'updateWithAllowedErrorCodes');
    component.form.patchValue({ coverage_from_date: null });
    await fixture.whenStable();

    expect(component.form.valid).toBeFalse();
    await component.save();

    expect(component.formSubmitted).toBeTrue();
    expect(createSpy).not.toHaveBeenCalled();
    expect(updateSpy).not.toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(singleClickEnableAction());
  });
});

describe('CreateF3XStep1Component: Edit', () => {
  let messageService: MessageService;
  let getSpy: jasmine.Spy<(reportId: string) => Promise<Report>>;
  let messageSpy: jasmine.Spy<(message: ToastMessageOptions) => void>;
  const mockReportId = '123';
  const mockReport = Form3X.fromJSON({
    id: mockReportId,
    filing_frequency: 'M',
    report_type_category: F3xReportTypeCategories.ELECTION_YEAR,
    report_code: ReportCodes.M4,
    coverage_from_date: '2024-04-05',
    coverage_through_date: '2024-04-30',
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CreateF3XStep1Component],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        Form3XService,
        MessageService,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ reportId: mockReportId }),
            snapshot: { params: of({ reportId: mockReportId }) },
          },
        },
        provideMockStore(testMockStore()),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
    spyOn(router, 'navigateByUrl').and.stub();
    spyOn(store, 'dispatch').and.callThrough();

    form3XService = TestBed.inject(Form3XService);
    messageService = TestBed.inject(MessageService);
    getSpy = spyOn(form3XService, 'get').and.resolveTo(mockReport);
    messageSpy = spyOn(messageService, 'add');

    fixture = TestBed.createComponent(CreateF3XStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should fetch existing report and patch form', () => {
    expect(component.reportId()).toBe(mockReportId);
    expect(getSpy).toHaveBeenCalledWith(mockReportId);
    fixture.detectChanges();
    expect(component.form.get('report_code')?.value).toBe(ReportCodes.M4);
    expect(component.form.get('filing_frequency')?.value).toBe('M');
    const coverage_from_date: Date = component.form.get('coverage_from_date')!.value;
    expect(coverage_from_date.getMonth()).toEqual(3); // April
    expect(coverage_from_date.getDate()).toEqual(5); // 5th
    expect(coverage_from_date.getFullYear()).toEqual(2024); // 2024
  });

  it('should call update method on save', async () => {
    const updateSpy = spyOn(form3XService, 'updateWithAllowedErrorCodes').and.resolveTo(mockReport);
    component.form.patchValue({ coverage_through_date: new Date('2024-07-01') });

    await component.save();

    expect(updateSpy).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/reports');
    expect(messageSpy).toHaveBeenCalled();
  });

  describe('Reactive Logic', () => {
    it('should update reportCodes when filing frequency and category change', () => {
      component.form.patchValue({
        filing_frequency: 'M',
        report_type_category: F3xReportTypeCategories.ELECTION_YEAR,
      });
      fixture.detectChanges();
      expect(component.reportCodes()).toContain(ReportCodes.M2);

      component.form.patchValue({ filing_frequency: 'Q' });
      fixture.detectChanges();
      expect(component.reportCodes()).toContain(ReportCodes.Q1);
    });

    it('should automatically update coverage dates when report code changes', fakeAsync(() => {
      component.form.get('report_code')?.setValue(ReportCodes.M2);
      tick();
      fixture.detectChanges();

      const fromDate = component.form.get('coverage_from_date')?.value;
      const throughDate = component.form.get('coverage_through_date')?.value;

      expect(fromDate.getMonth()).toBe(3);
      expect(throughDate.getMonth()).toBe(3);
    }));
  });
});

describe('Default Report Type Category Logic', () => {
  let coverageDateSpy: jasmine.Spy<() => Promise<CoverageDates[]>>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CreateF3XStep1Component],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations(),
        Form3XService,
        MessageService,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            snapshot: { params: of({}) },
          },
        },
        provideMockStore(testMockStore()),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
    form3XService = TestBed.inject(Form3XService);
    spyOn(router, 'navigateByUrl').and.stub();
    spyOn(store, 'dispatch').and.callThrough();

    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  const setupComponent = () => {
    fixture = TestBed.createComponent(CreateF3XStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('should be ELECTION_YEAR in an even year after January', () => {
    jasmine.clock().mockDate(new Date(2024, 1, 1));
    setupComponent();
    expect(component.defaultReportTypeCategory).toBe(F3xReportTypeCategories.ELECTION_YEAR);
  });

  it('should be ELECTION_YEAR in an odd year during January', () => {
    jasmine.clock().mockDate(new Date(2025, 0, 15));
    setupComponent();
    expect(component.defaultReportTypeCategory).toBe(F3xReportTypeCategories.ELECTION_YEAR);
  });

  it('should be NON_ELECTION_YEAR in an odd year after January', () => {
    jasmine.clock().mockDate(new Date(2025, 2, 20));
    setupComponent();
    expect(component.defaultReportTypeCategory).toBe(F3xReportTypeCategories.NON_ELECTION_YEAR);
  });

  it('should be NON_ELECTION_YEAR in an even year during January', () => {
    jasmine.clock().mockDate(new Date(2024, 0, 10));
    setupComponent();
    expect(component.defaultReportTypeCategory).toBe(F3xReportTypeCategories.NON_ELECTION_YEAR);
  });
});
