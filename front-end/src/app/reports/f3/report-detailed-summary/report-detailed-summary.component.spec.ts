import { ComponentFixture, TestBed } from '@angular/core/testing';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { Form3X } from 'app/shared/models/form-3x.model';
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
  const f3x: Form3X = Form3X.fromJSON({
    id: '999',
    coverage_from_date: '2022-05-25',
    form_type: 'F3XN',
    report_code: 'Q1',
  });
  const f3xSubject: Subject<object> = new BehaviorSubject<object>({ report: f3x });
  let apiService: ApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardModule, ReportDetailedSummaryComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        ReportService,
        provideMockStore(testMockStore),
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
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDetailedSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(apiService, 'post').and.returnValue(Promise.resolve(new HttpResponse<unknown>()));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('CALCULATING', () => {
    beforeEach(async () => {
      f3x.calculation_status = 'CALCULATING';
      TestBed.inject(MockStore).overrideSelector(selectActiveReport, f3x);
      TestBed.inject(MockStore).refreshState();
      fixture.detectChanges();
      return component.refreshSummary();
    });
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('SUCCEEDED', () => {
    beforeEach(async () => {
      f3x.calculation_status = 'SUCCEEDED';
      TestBed.inject(MockStore).overrideSelector(selectActiveReport, f3x);
      TestBed.inject(MockStore).refreshState();
      fixture.detectChanges();
      return component.refreshSummary();
    });
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
});
