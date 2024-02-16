import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { SharedModule } from 'app/shared/shared.module';
import { CardModule } from 'primeng/card';
import { ReportSummaryComponent } from './report-summary.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReportDetailedSummaryComponent } from '../report-detailed-summary/report-detailed-summary.component';
import { ReportService } from 'app/shared/services/report.service';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'app/shared/services/api.service';
import { Form3X } from 'app/shared/models/form-3x.model';
import { BehaviorSubject, of, Subject } from 'rxjs';

describe('ReportSummaryComponent', () => {
  let component: ReportSummaryComponent;
  let fixture: ComponentFixture<ReportSummaryComponent>;
  let apiService: ApiService;
  const f3x: Form3X = Form3X.fromJSON({
    id: '999',
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
    spyOn(apiService, 'post').and.returnValue(of(true));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
