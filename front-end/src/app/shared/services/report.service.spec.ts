import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from '../utils/unit-test.utils';
import { ReportService } from './report.service';
import { ListRestResponse } from '../models/rest-api.model';
import { ReportF3X } from '../models/report-f3x.model';
import { environment } from '../../../environments/environment';
import { Report } from '../models/report.model';

describe('ReportService', () => {
  let service: ReportService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReportService, provideMockStore(testMockStore)],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getTableData() should return a list of contacts', () => {
    const mockResponse: ListRestResponse = {
      count: 2,
      next: 'https://next-page',
      previous: 'https://previous-page',
      results: [
        ReportF3X.fromJSON({
          id: 1,
        }),
        ReportF3X.fromJSON({
          id: 2,
        }),
      ],
    };

    service.getTableData().subscribe((response: ListRestResponse) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/f3x-summaries/?page=1&ordering=form_type`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
    httpTestingController.verify();
  });

  it('#setActiveReportById() should throw error if report id is undefined', () => {
    expect(() => {
      service.setActiveReportById(undefined);
    }).toThrowError();
  });

  it('#delete() should DELETE a record', () => {
    const mockResponse = null;
    const reportF3X: ReportF3X = ReportF3X.fromJSON({ id: 1 });

    service.delete(reportF3X).subscribe((response: null) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/f3x-summaries/1`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(mockResponse);
    httpTestingController.verify();
  });

  it('should set the COH store values', () => {
    const reports: Report[] = [{ id: '999' } as Report];
    const result = service.setStoreCashOnHand(reports);
    expect(result).not.toBeTruthy();
  });
});
