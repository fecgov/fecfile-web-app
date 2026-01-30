import { ComponentFixture, TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { Form3X } from 'app/shared/models/reports/form-3x.model';
import { CardModule } from 'primeng/card';
import { ReportDetailedSummaryComponent } from './report-detailed-summary.component';
import { ReportService } from 'app/shared/services/report.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { ApiService } from 'app/shared/services/api.service';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ReportDetailedSummaryComponent', () => {
  let component: ReportDetailedSummaryComponent;
  let fixture: ComponentFixture<ReportDetailedSummaryComponent>;
  const f3xSubject: Subject<object> = new BehaviorSubject<object>({ report: new Form3X() });
  let apiService: ApiService;
  let reportService: ReportService<Form3X>;
  let store: MockStore;
  let postSpy: jasmine.Spy;

  const buildReport = (overrides: Partial<Form3X> = {}) =>
    Form3X.fromJSON({
      id: '999',
      coverage_from_date: '2022-05-25',
      form_type: 'F3XN',
      report_code: 'Q1',
      report_type: 'F3X',
      ...overrides,
    });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardModule, ReportDetailedSummaryComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        ReportService,
        provideMockStore(testMockStore()),
        {
          provide: ActivatedRoute,
          useValue: {
            data: f3xSubject,
          },
        },
        ApiService,
      ],
    }).compileComponents();

    apiService = TestBed.inject(ApiService);
    reportService = TestBed.inject(ReportService);
    store = TestBed.inject(MockStore);
    store.overrideSelector(selectActiveReport, buildReport({ calculation_status: 'SUCCEEDED' }));
    store.refreshState();
  });

  beforeEach(() => {
    (ReportDetailedSummaryComponent as any).lastCalcByReportId.clear();
    postSpy = spyOn(apiService, 'post').and.returnValue(Promise.resolve(new HttpResponse<unknown>()));
    spyOn(reportService, 'setActiveReportById').and.returnValue(Promise.resolve(new Form3X()));
    fixture = TestBed.createComponent(ReportDetailedSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    postSpy.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate when calculation_status is missing', fakeAsync(() => {
    const report = buildReport();
    report.updated = new Date('2024-01-02');
    store.overrideSelector(selectActiveReport, report);
    store.refreshState();
    fixture.detectChanges();
    flushMicrotasks();
    expect(postSpy).toHaveBeenCalledTimes(1);
  }));

  it('should not recalculate when calculation_status is SUCCEEDED and updated unchanged', fakeAsync(() => {
    const report = buildReport({ calculation_status: 'SUCCEEDED' });
    report.updated = new Date('2024-01-02');
    (ReportDetailedSummaryComponent as any).lastCalcByReportId.set(report.id, report.updated.getTime());
    store.overrideSelector(selectActiveReport, report);
    store.refreshState();
    fixture.detectChanges();
    flushMicrotasks();
    expect(postSpy).not.toHaveBeenCalled();
  }));

  it('should recalculate when calculation_status is SUCCEEDED and updated changed', fakeAsync(() => {
    const report = buildReport({ calculation_status: 'SUCCEEDED' });
    report.updated = new Date('2024-01-02');
    (ReportDetailedSummaryComponent as any).lastCalcByReportId.set(report.id, new Date('2024-01-01').getTime());
    store.overrideSelector(selectActiveReport, report);
    store.refreshState();
    fixture.detectChanges();
    flushMicrotasks();
    expect(postSpy).toHaveBeenCalledTimes(1);
  }));
});
