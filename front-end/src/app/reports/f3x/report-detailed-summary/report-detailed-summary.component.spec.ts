import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { Form3X } from 'app/shared/models/form-3x.model';
import { SharedModule } from 'app/shared/shared.module';
import { CardModule } from 'primeng/card';

import { ReportDetailedSummaryComponent } from './report-detailed-summary.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReportService } from 'app/shared/services/report.service';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { ApiService } from 'app/shared/services/api.service';

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
      imports: [SharedModule, CardModule, RouterTestingModule.withRoutes([]), HttpClientTestingModule],
      declarations: [ReportDetailedSummaryComponent],
      providers: [
        ReportService,
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
    spyOn(apiService, 'post').and.returnValue(of(true));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('CALCULATING', () => {
    beforeEach(async () => {
      f3x.calculation_status = 'CALCULATING';
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
      fixture.detectChanges();
      return component.refreshSummary();
    });
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
});
