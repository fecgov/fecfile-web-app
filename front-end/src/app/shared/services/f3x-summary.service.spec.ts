import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from '../utils/unit-test.utils';
import { F3xSummaryService } from './f3x-summary.service';
import { F3xSummary } from '../models/f3x-summary.model';
import { environment } from '../../../environments/environment';

describe('F3xSummaryService', () => {
  let service: F3xSummaryService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [F3xSummaryService, provideMockStore(testMockStore)],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(F3xSummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#get should return a specific f3x summary record', () => {
    const f3xSummary: F3xSummary = F3xSummary.fromJSON({ id: '999' });

    service.get('999').subscribe((response: F3xSummary) => {
      expect(response).toEqual(f3xSummary);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/f3x-summaries/${f3xSummary.id}`);
    expect(req.request.method).toEqual('GET');
    req.flush(f3xSummary);
    httpTestingController.verify();
  });

  it('#create() should POST a payload', () => {
    const f3xSummary: F3xSummary = new F3xSummary();

    service.create(f3xSummary).subscribe((response: F3xSummary) => {
      expect(response).toEqual(f3xSummary);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/f3x-summaries/?fields_to_validate=`);
    expect(req.request.method).toEqual('POST');
    req.flush(f3xSummary);
    httpTestingController.verify();
  });

  it('#startAmendment() should POST', () => {
    const f3xSummary: F3xSummary = F3xSummary.fromJSON({ id: '999' });

    service.startAmendment(f3xSummary).subscribe((response: string) => {
      expect(response).toEqual('amended report');
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/f3x-summaries/999/amend`);
    expect(req.request.method).toEqual('POST');
    req.flush('amended report');
    httpTestingController.verify();
  });

  it('#update() should PUT a payload', () => {
    const f3xSummary: F3xSummary = F3xSummary.fromJSON({ id: '999' });

    service.update(f3xSummary).subscribe((response: F3xSummary) => {
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
    const f3xSummary: F3xSummary = F3xSummary.fromJSON({ id: '999' });

    service.delete(f3xSummary).subscribe((response: null) => {
      expect(response).toBeNull();
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/f3x-summaries/999`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(null);
    httpTestingController.verify();
  });
});
