import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { environment } from '../../../environments/environment';
import { Form3X } from '../models/form-3x.model';
import { testMockStore } from '../utils/unit-test.utils';
import { Form3XService } from './form-3x.service';
import { provideHttpClient } from '@angular/common/http';

describe('Form3XService', () => {
  let service: Form3XService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), Form3XService, provideMockStore(testMockStore)],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(Form3XService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#create() should POST a payload', () => {
    const form3X: Form3X = new Form3X();

    service.create(form3X).then((response) => {
      expect(response).toEqual(form3X);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/reports/form-3x/?fields_to_validate=`);
    expect(req.request.method).toEqual('POST');
    req.flush(form3X);
    httpTestingController.verify();
  });

  it('#update() should PUT a payload', () => {
    const form3X: Form3X = Form3X.fromJSON({ id: '999' });

    service.update(form3X).then((response) => {
      expect(response).toEqual(form3X);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/reports/form-3x/${form3X.id}/?fields_to_validate=`,
    );
    expect(req.request.method).toEqual('PUT');
    req.flush(form3X);
    httpTestingController.verify();
  });

  it('#delete() should DELETE a record', () => {
    const form3X: Form3X = Form3X.fromJSON({ id: '999' });

    service.delete(form3X).then((response) => {
      expect(response).toBeNull();
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/reports/form-3x/999/`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(null);
    httpTestingController.verify();
  });

  describe('getFutureReports', () => {
    it('should return a list of Form3X reports whose coverage through is after the submitted value', async () => {
      service.getFutureReports('2024-01-20').then((reports) => {
        expect(reports.length).toBeGreaterThanOrEqual(0);
      });
      const req = httpTestingController.expectOne(`${environment.apiUrl}/reports/form-3x/future/?after=2024-01-20`);
      expect(req.request.method).toEqual('GET');
      req.flush(null);
      httpTestingController.verify();
    });
  });
});
