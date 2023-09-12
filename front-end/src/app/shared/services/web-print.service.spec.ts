import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from '../utils/unit-test.utils';
import { F3xReport } from '../models/report-types/f3x-report.model';
import { ApiService } from './api.service';
import { ReportService } from './report.service';
import { WebPrintService } from './web-print.service';

describe('WebPrintService', () => {
  let service: WebPrintService;
  let apiService: ApiService;
  let reportService: ReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WebPrintService, provideMockStore(testMockStore)],
    }).compileComponents();

    TestBed.inject(HttpTestingController);
    service = TestBed.inject(WebPrintService);
    apiService = TestBed.inject(ApiService);
    reportService = TestBed.inject(ReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should post as expected', () => {
    const api = spyOn(apiService, 'post');
    service.submitPrintJob('1');
    expect(api).toHaveBeenCalledWith('/web-services/submit-to-webprint/', {
      report_id: '1',
    });
  });

  it('should get new reports', () => {
    const reportRequest = spyOn(reportService, 'setActiveReportById').and.returnValue(of(new F3xReport()));
    service.getStatus('1');
    expect(reportRequest).toHaveBeenCalledWith('1');
  });
});
