import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from '../utils/unit-test.utils';
import { ReportF3XService } from './report-f3x.service';
import { ReportF3X } from '../models/report-f3x.model';
import { environment } from '../../../environments/environment';

describe('ReportF3XService', () => {
  let service: ReportF3XService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReportF3XService, provideMockStore(testMockStore)],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ReportF3XService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#get should return a specific f3x summary record', () => {
    const reportF3X: ReportF3X = ReportF3X.fromJSON({ id: '999' });

    service.get('999').subscribe((response: ReportF3X) => {
      expect(response).toEqual(reportF3X);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/reports/report-f3x/${reportF3X.id}`);
    expect(req.request.method).toEqual('GET');
    req.flush(reportF3X);
    httpTestingController.verify();
  });

  it('#create() should POST a payload', () => {
    const reportF3X: ReportF3X = new ReportF3X();

    service.create(reportF3X).subscribe((response) => {
      expect(response).toEqual(reportF3X);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/reports/report-f3x/?fields_to_validate=`);
    expect(req.request.method).toEqual('POST');
    req.flush(reportF3X);
    httpTestingController.verify();
  });

  it('#update() should PUT a payload', () => {
    const reportF3X: ReportF3X = ReportF3X.fromJSON({ id: '999' });

    service.update(reportF3X).subscribe((response) => {
      expect(response).toEqual(reportF3X);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/reports/report-f3x/${reportF3X.id}/?fields_to_validate=`
    );
    expect(req.request.method).toEqual('PUT');
    req.flush(reportF3X);
    httpTestingController.verify();
  });

  it('#delete() should DELETE a record', () => {
    const reportF3X: ReportF3X = ReportF3X.fromJSON({ id: '999' });

    service.delete(reportF3X).subscribe((response: null) => {
      expect(response).toBeNull();
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/reports/report-f3x/999`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(null);
    httpTestingController.verify();
  });

  it('should set the COH store values', () => {
    const reports: ReportF3X[] = [{ id: '999' } as ReportF3X];
    const result = service.setStoreCashOnHand(reports);
    expect(result).not.toBeTruthy();
  });
});
