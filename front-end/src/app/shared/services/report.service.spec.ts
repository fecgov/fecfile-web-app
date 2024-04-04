import { fakeAsync, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testActiveReport, testMockStore } from '../utils/unit-test.utils';
import { ReportService } from './report.service';
import { ListRestResponse } from '../models/rest-api.model';
import { Form3X } from '../models/form-3x.model';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';

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
      pageNumber: 1,
      results: [
        Form3X.fromJSON({
          id: 1,
        }),
        Form3X.fromJSON({
          id: 2,
        }),
      ],
    };

    service.getTableData().subscribe((response: ListRestResponse) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/reports/?page=1&ordering=form_type`);
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
    const form3X: Form3X = Form3X.fromJSON({ id: 1 });

    service.delete(form3X).subscribe((response: null) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/reports/1`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(mockResponse);
    httpTestingController.verify();
  });

  it('#startAmendment() should call amend', () => {
    const report: Form3X = Form3X.fromJSON({ id: 1 });

    service.startAmendment(report).subscribe((response: string) => {
      expect(response).toEqual('amended 1');
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/reports/1/amend/`);
    expect(req.request.method).toEqual('POST');
    req.flush('amended 1');
    httpTestingController.verify();
  });

  describe('getAllReports', () => {
    it('should get all reports', fakeAsync(async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const getSpy = spyOn(service.apiService, 'get').and.callFake(() => of([testActiveReport]));

      const reports = await service.getAllReports();
      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(reports.length).toBe(1);
    }));
  });
});
