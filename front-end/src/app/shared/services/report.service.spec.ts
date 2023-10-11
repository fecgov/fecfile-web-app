import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from '../utils/unit-test.utils';
import { ReportService } from './report.service';
import { ListRestResponse } from '../models/rest-api.model';
import { F3xSummary } from '../models/f3x-summary.model';
import { environment } from '../../../environments/environment';
import { Report } from '../interfaces/report.interface';

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
        F3xSummary.fromJSON({
          id: 1,
        }),
        F3xSummary.fromJSON({
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
    const f3xSummary: F3xSummary = F3xSummary.fromJSON({ id: 1 });

    service.delete(f3xSummary).subscribe((response: null) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/f3x-summaries/1`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(mockResponse);
    httpTestingController.verify();
  });

  it('#startAmendment() should call amend', () => {
    const f3xSummary: F3xSummary = F3xSummary.fromJSON({ id: 1 });

    service.startAmendment(f3xSummary).subscribe((response: string) => {
      expect(response).toEqual('amended 1');
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/f3x-summaries/1/amend/`);
    expect(req.request.method).toEqual('POST');
    req.flush('amended 1');
    httpTestingController.verify();
  });

  it('should set the COH store values', () => {
    const reports: Report[] = [{ id: '999' } as Report];
    const result = service.setStoreCashOnHand(reports);
    expect(result).not.toBeTruthy();
  });
});
