import { HttpStatusCode, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { environment } from '../../../environments/environment';
import { Form3X } from '../models/reports/form-3x.model';
import { ListRestResponse } from '../models/rest-api.model';
import { testMockStore } from '../utils/unit-test.utils';
import { ReportService } from './report.service';
import { Report, ReportStatus } from '../models';

describe('ReportService', () => {
  let service: ReportService<Form3X>;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), ReportService, provideMockStore(testMockStore())],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ReportService<Form3X>);
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

    service.getTableData().then((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/reports/?page=1&ordering=form_type`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
    httpTestingController.verify();
  });

  it('#setActiveReportById() should throw error if report id is undefined', async () => {
    try {
      await service.setActiveReportById(undefined);
      fail('Expected function to throw an error, but it did not.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      expect(err.message).toBe('FECfile+: No Report Id Provided.');
    }
  });

  it('#delete() should DELETE a record', async () => {
    const mockResponse = null;
    const form3X: Form3X = Form3X.fromJSON({ id: 1 });

    service.delete(form3X).then((response) => {
      expect(response).toEqual(mockResponse);
    });
    const req = httpTestingController.expectOne(`${environment.apiUrl}/reports/1/`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(mockResponse);
    httpTestingController.verify();
  });

  it('#startAmendment() should call amend', fakeAsync(async () => {
    const report: Form3X = Form3X.fromJSON({ id: 1 });

    service.startAmendment(report).then((response) => {
      expect(response).toEqual('amended 1');
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/reports/1/amend/`);
    expect(req.request.method).toEqual('POST');
    req.flush('amended 1');
    httpTestingController.verify();
  }));

  it('#startUnamendment() should call unamend', fakeAsync(async () => {
    const report: Form3X = Form3X.fromJSON({ id: 1 });

    service.startUnamendment(report).then((response) => {
      expect(response).toEqual('unamended 1');
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/reports/1/unamend/`);
    expect(req.request.method).toEqual('POST');
    req.flush('unamended 1');
    httpTestingController.verify();
  }));

  it('#updateWithAllowedErrorCodes() should PUT a record', async () => {
    const form3X: Form3X = Form3X.fromJSON({ id: 1 });

    service.updateWithAllowedErrorCodes(form3X, [HttpStatusCode.BadRequest], []).then((response) => {
      expect(response).toEqual(form3X);
    });
    const req = httpTestingController.expectOne(`${environment.apiUrl}/reports/1/?fields_to_validate=`);
    expect(req.request.method).toEqual('PUT');
    req.flush(form3X);
    httpTestingController.verify();
  });

  describe('#pollReport()', () => {
    const reportId = '123';
    const pendingReport = Form3X.fromJSON({ id: reportId, report_status: ReportStatus.SUBMIT_PENDING });
    const successReport = Form3X.fromJSON({ id: reportId, report_status: ReportStatus.SUBMIT_SUCCESS });
    const stopCondition = (r: Report) => r.report_status !== ReportStatus.SUBMIT_PENDING;

    it('should stop polling and dispatch action when condition is met immediately', fakeAsync(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dispatchSpy = spyOn((service as any).store, 'dispatch');
      service.pollReport(reportId, stopCondition);
      const req = httpTestingController.expectOne(`${environment.apiUrl}/reports/${reportId}/`);
      req.flush(successReport);
      tick();
      expect(dispatchSpy).toHaveBeenCalled();
      httpTestingController.verify();
    }));

    it('should poll multiple times until condition is met', fakeAsync(() => {
      const pollingTime = 2000;

      service.pollReport(reportId, stopCondition, pollingTime);
      const req1 = httpTestingController.expectOne(`${environment.apiUrl}/reports/${reportId}/`);
      req1.flush(pendingReport);
      tick();
      tick(pollingTime);

      const req2 = httpTestingController.expectOne(`${environment.apiUrl}/reports/${reportId}/`);
      req2.flush(successReport);
      tick();

      httpTestingController.verify();
    }));

    it('should stop polling when pollLimit is reached', fakeAsync(() => {
      const pollLimit = 2;
      const pollingTime = 1000;

      service.pollReport(reportId, stopCondition, pollingTime, pollLimit);

      // Poll 0
      httpTestingController.expectOne(`${environment.apiUrl}/reports/${reportId}/`).flush(pendingReport);
      tick();
      tick(pollingTime);

      // Poll 1
      httpTestingController.expectOne(`${environment.apiUrl}/reports/${reportId}/`).flush(pendingReport);
      tick();
      tick(pollingTime);

      // Poll 2 (The limit)
      httpTestingController.expectOne(`${environment.apiUrl}/reports/${reportId}/`).flush(pendingReport);
      tick();

      // Ensure no further requests are made after the limit
      httpTestingController.verify();
    }));
  });
});
