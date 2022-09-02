import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { selectReportCodeLabelList } from 'app/store/label-lookup.selectors';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { ActivatedRoute } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { SharedModule } from 'app/shared/shared.module';
import { CardModule } from 'primeng/card';

import { ReportDetailedSummaryComponent } from './report-detailed-summary.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReportService } from 'app/shared/services/report.service';
import { BehaviorSubject, Subject } from 'rxjs';

describe('ReportDetailedSummaryComponent', () => {
  let component: ReportDetailedSummaryComponent;
  let fixture: ComponentFixture<ReportDetailedSummaryComponent>;
  const f3x: F3xSummary = F3xSummary.fromJSON({
    id: 999,
    coverage_from_date: '2022-05-25',
    form_type: 'F3XN',
    report_code: 'Q1',
  });
  const f3xSubject: Subject<object> = new BehaviorSubject<object>({ report: f3x });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, CardModule, RouterTestingModule.withRoutes([]), HttpClientTestingModule],
      declarations: [ReportDetailedSummaryComponent],
      providers: [
        ReportService,
        provideMockStore({
          selectors: [
            { selector: selectReportCodeLabelList, value: {} },
            { selector: selectActiveReport, value: { id: 999 } },
          ],
        }),
        {
          provide: ActivatedRoute,
          useValue: {
            data: f3xSubject,
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDetailedSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('CALCULATING', () => {
    beforeEach(async () => {
      f3x.calculation_status = 'CALCULATING';
      f3xSubject.next({ report: f3x });
      await TestBed.configureTestingModule({
        imports: [SharedModule, CardModule, RouterTestingModule.withRoutes([]), HttpClientTestingModule],
        declarations: [ReportDetailedSummaryComponent],
        providers: [
          ReportService,
          provideMockStore({
            selectors: [
              { selector: selectReportCodeLabelList, value: {} },
              { selector: selectActiveReport, value: { id: 999 } },
            ],
          }),
          {
            provide: ActivatedRoute,
            useValue: {
              data: f3xSubject,
            },
          },
        ],
      }).compileComponents();
    });
    beforeEach(() => {
      fixture = TestBed.createComponent(ReportDetailedSummaryComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('SUCCEEDED', () => {
    beforeEach(async () => {
      f3x.calculation_status = 'SUCCEEDED';
      f3xSubject.next({ report: f3x });
      await TestBed.configureTestingModule({
        imports: [SharedModule, CardModule, RouterTestingModule.withRoutes([]), HttpClientTestingModule],
        declarations: [ReportDetailedSummaryComponent],
        providers: [
          ReportService,
          provideMockStore({
            selectors: [
              { selector: selectReportCodeLabelList, value: {} },
              { selector: selectActiveReport, value: { id: 999 } },
            ],
          }),
          {
            provide: ActivatedRoute,
            useValue: {
              data: f3xSubject,
            },
          },
        ],
      }).compileComponents();
    });
    beforeEach(() => {
      fixture = TestBed.createComponent(ReportDetailedSummaryComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
});
