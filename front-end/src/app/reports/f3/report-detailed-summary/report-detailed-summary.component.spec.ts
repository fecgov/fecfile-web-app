import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Form3 } from 'app/shared/models/form-3.model';
import { ReportDetailedSummaryComponent } from './report-detailed-summary.component';
import { ReportService } from 'app/shared/services/report.service';
import { Subject } from 'rxjs';
import { ApiService } from 'app/shared/services/api.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CalculationStatus, ServerSideEventService } from 'app/shared/services/server-side-event.service';
import { selectActiveReport } from 'app/store/active-report.selectors';

describe('ReportDetailedSummaryComponent', () => {
  let component: ReportDetailedSummaryComponent;
  let fixture: ComponentFixture<ReportDetailedSummaryComponent>;
  let store: MockStore;
  let apiService: jasmine.SpyObj<ApiService>;
  let reportService: jasmine.SpyObj<ReportService>;
  let sseService: jasmine.SpyObj<ServerSideEventService>;
  let sseSubject: Subject<string>;

  const initialF3: Form3 = Form3.fromJSON({
    id: '999',
    form_type: 'F3N',
    calculation_status: null,
  });

  beforeEach(async () => {
    apiService = jasmine.createSpyObj('ApiService', ['post']);
    reportService = jasmine.createSpyObj('ReportService', ['setActiveReportById']);
    sseService = jasmine.createSpyObj('ServerSideEventService', ['calculationNotification']);
    sseSubject = new Subject<string>();

    await TestBed.configureTestingModule({
      imports: [ReportDetailedSummaryComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideMockStore({
          initialState: {},
          selectors: [{ selector: selectActiveReport, value: initialF3 }],
        }),
        { provide: ApiService, useValue: apiService },
        { provide: ReportService, useValue: reportService },
        { provide: ServerSideEventService, useValue: sseService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportDetailedSummaryComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    // Mock the return value for the SSE service
    sseService.calculationNotification.and.returnValue(sseSubject.asObservable());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should start calculation if status is null', () => {
      const startCalculationSpy = spyOn(component, 'startCalculation');
      component.ngOnInit();
      expect(startCalculationSpy).toHaveBeenCalledWith('999');
    });

    it('should listen for completion if status is CALCULATING', () => {
      const listenSpy = spyOn(component, 'listenForCompletion');
      const calculatingReport = { ...initialF3, calculation_status: CalculationStatus.CALCULATING } as Form3;
      store.overrideSelector(selectActiveReport, calculatingReport);
      store.refreshState();
      fixture.detectChanges();

      component.ngOnInit();
      expect(listenSpy).toHaveBeenCalledWith('999');
    });

    it('should set calculationFinished to true if status is SUCCEEDED', () => {
      const succeededReport = { ...initialF3, calculation_status: CalculationStatus.SUCCEEDED } as Form3;
      store.overrideSelector(selectActiveReport, succeededReport);
      store.refreshState();
      fixture.detectChanges();

      component.ngOnInit();
      expect(component.calculationFinished()).toBe(true);
    });

    it('should do nothing if report has no ID', () => {
      const startCalculationSpy = spyOn(component, 'startCalculation');
      const listenSpy = spyOn(component, 'listenForCompletion');
      const noIdReport = { ...initialF3, id: undefined } as Form3;
      store.overrideSelector(selectActiveReport, noIdReport);
      store.refreshState();
      fixture.detectChanges();

      component.ngOnInit();
      expect(startCalculationSpy).not.toHaveBeenCalled();
      expect(listenSpy).not.toHaveBeenCalled();
    });
  });

  describe('startCalculation', () => {
    it('should call apiService.post and then listenForCompletion', fakeAsync(() => {
      const listenSpy = spyOn(component, 'listenForCompletion');
      apiService.post.and.resolveTo();
      component.startCalculation('999');
      tick();

      expect(apiService.post).toHaveBeenCalledWith('/web-services/summary/calculate-summary/', { report_id: '999' });
      expect(listenSpy).toHaveBeenCalledWith('999');
      expect(component.calculationFinished()).toBe(false);
    }));

    it('should handle errors from apiService.post', fakeAsync(() => {
      const consoleErrorSpy = spyOn(console, 'error');
      const listenSpy = spyOn(component, 'listenForCompletion');
      apiService.post.and.rejectWith('API Error');
      component.startCalculation('999');
      tick();

      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to start calculation', 'API Error');
      expect(listenSpy).not.toHaveBeenCalled();
    }));
  });

  describe('listenForCompletion', () => {
    it('should refresh summary when SSE service emits SUCCEEDED', () => {
      const refreshSummarySpy = spyOn(component, 'refreshSummary');
      component.listenForCompletion('999');
      sseSubject.next(CalculationStatus.SUCCEEDED);

      expect(sseService.calculationNotification).toHaveBeenCalledWith('999');
      expect(refreshSummarySpy).toHaveBeenCalledWith('999');
    });

    it('should not refresh summary if status is not SUCCEEDED', () => {
      const refreshSummarySpy = spyOn(component, 'refreshSummary');
      component.listenForCompletion('999');
      sseSubject.next(CalculationStatus.FAILED);
      expect(refreshSummarySpy).not.toHaveBeenCalled();
    });

    it('should handle errors from the SSE service', () => {
      const consoleErrorSpy = spyOn(console, 'error');
      component.listenForCompletion('999');
      sseSubject.error('SSE Error');

      expect(consoleErrorSpy).toHaveBeenCalledWith('SSE connection error', 'SSE Error');
    });
  });

  describe('refreshSummary', () => {
    it('should call setActiveReportById and set calculationFinished to true', fakeAsync(() => {
      reportService.setActiveReportById.and.resolveTo();
      component.refreshSummary('999');
      tick();

      expect(reportService.setActiveReportById).toHaveBeenCalledWith('999');
      expect(component.calculationFinished()).toBe(true);
    }));
  });
});
