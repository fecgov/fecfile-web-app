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
    const f3xSummary: ReportF3X = ReportF3X.fromJSON({ id: '999' });

    service.get('999').subscribe((response: ReportF3X) => {
      expect(response).toEqual(f3xSummary);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/f3x-summaries/${f3xSummary.id}`);
    expect(req.request.method).toEqual('GET');
    req.flush(f3xSummary);
    httpTestingController.verify();
  });

  it('#create() should POST a payload', () => {
    const f3xSummary: ReportF3X = new ReportF3X();

    service.create(f3xSummary).subscribe((response: ReportF3X) => {
      expect(response).toEqual(f3xSummary);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/f3x-summaries/?fields_to_validate=`);
    expect(req.request.method).toEqual('POST');
    req.flush(f3xSummary);
    httpTestingController.verify();
  });

  it('#update() should PUT a payload', () => {
    const f3xSummary: ReportF3X = ReportF3X.fromJSON({ id: '999' });

    service.update(f3xSummary).subscribe((response: ReportF3X) => {
      expect(response).toEqual(f3xSummary);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/f3x-summaries/${f3xSummary.id}/?fields_to_validate=`
    );
    expect(req.request.method).toEqual('PUT');
    req.flush(f3xSummary);
    httpTestingController.verify();
  });

  it('#delete() should DELETE a record', () => {
    const f3xSummary: ReportF3X = ReportF3X.fromJSON({ id: '999' });

    service.delete(f3xSummary).subscribe((response: null) => {
      expect(response).toBeNull();
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/f3x-summaries/999`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(null);
    httpTestingController.verify();
  });
});
