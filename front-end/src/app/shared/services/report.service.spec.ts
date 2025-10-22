import { HttpStatusCode, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { environment } from '../../../environments/environment';
import { Form3X } from '../models/form-3x.model';
import { ListRestResponse } from '../models/rest-api.model';
import { testMockStore } from '../utils/unit-test.utils';
import { ReportService } from './report.service';

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
});
