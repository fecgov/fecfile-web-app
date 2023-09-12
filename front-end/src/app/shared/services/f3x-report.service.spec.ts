import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from '../utils/unit-test.utils';
import { F3xReportService } from './f3x-report.service';
import { F3xReport } from '../models/report-types/f3x-report.model';
import { environment } from '../../../environments/environment';

describe('F3xReportService', () => {
  let service: F3xReportService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [F3xReportService, provideMockStore(testMockStore)],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(F3xReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#get should return a specific f3x summary record', () => {
    const f3xReport: F3xReport = F3xReport.fromJSON({ id: '999' });

    service.get('999').subscribe((response: F3xReport) => {
      expect(response).toEqual(f3xReport);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/f3x-summaries/${f3xReport.id}`);
    expect(req.request.method).toEqual('GET');
    req.flush(f3xReport);
    httpTestingController.verify();
  });

  it('#create() should POST a payload', () => {
    const f3xReport: F3xReport = new F3xReport();

    service.create(f3xReport).subscribe((response: F3xReport) => {
      expect(response).toEqual(f3xReport);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/f3x-summaries/?fields_to_validate=`);
    expect(req.request.method).toEqual('POST');
    req.flush(f3xReport);
    httpTestingController.verify();
  });

  it('#update() should PUT a payload', () => {
    const f3xReport: F3xReport = F3xReport.fromJSON({ id: '999' });

    service.update(f3xReport).subscribe((response: F3xReport) => {
      expect(response).toEqual(f3xReport);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/f3x-summaries/${f3xReport.id}/?fields_to_validate=`
    );
    expect(req.request.method).toEqual('PUT');
    req.flush(f3xReport);
    httpTestingController.verify();
  });

  it('#delete() should DELETE a record', () => {
    const f3xReport: F3xReport = F3xReport.fromJSON({ id: '999' });

    service.delete(f3xReport).subscribe((response: null) => {
      expect(response).toBeNull();
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/f3x-summaries/999`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(null);
    httpTestingController.verify();
  });
});
