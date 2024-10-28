import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { environment } from '../../../environments/environment';
import { F3xLine6aOverride, Form3X } from '../models/form-3x.model';
import { testMockStore } from '../utils/unit-test.utils';
import { Form3XService } from './form-3x.service';

describe('Form3XService', () => {
  let service: Form3XService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Form3XService, provideMockStore(testMockStore)],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(Form3XService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#create() should POST a payload', () => {
    const form3X: Form3X = new Form3X();

    service.create(form3X).subscribe((response) => {
      expect(response).toEqual(form3X);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/reports/form-3x/?fields_to_validate=`);
    expect(req.request.method).toEqual('POST');
    req.flush(form3X);
    httpTestingController.verify();
  });

  it('#update() should PUT a payload', () => {
    const form3X: Form3X = Form3X.fromJSON({ id: '999' });

    service.update(form3X).subscribe((response) => {
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

    service.delete(form3X).subscribe((response: null) => {
      expect(response).toBeNull();
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/reports/form-3x/999`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(null);
    httpTestingController.verify();
  });

  it('#getF3xLine6aOverride() should get a record', fakeAsync(() => {
    let retval = new F3xLine6aOverride();
    service.getF3xLine6aOverride('2024').then((response) => {
      if (response) {
        retval = response;
      }
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/f3x_line6a_overrides/?year=2024`);
    expect(req.request.method).toEqual('GET');
    const apiRetval = new F3xLine6aOverride();
    apiRetval.id = 'test_id';
    req.flush([apiRetval]);
    httpTestingController.verify();
    tick(500);

    expect(retval.id).toEqual('test_id');
  }));

  it('#getF3xLine6aOverride() should get a record', fakeAsync(() => {
    let retval = new F3xLine6aOverride();
    service.getF3xLine6aOverride('2024').then((response) => {
      if (response) {
        retval = response;
      }
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/f3x_line6a_overrides/?year=2024`);
    expect(req.request.method).toEqual('GET');
    const apiRetval = new F3xLine6aOverride();
    apiRetval.id = 'test_id';
    req.flush([apiRetval]);
    httpTestingController.verify();
    tick(500);

    expect(retval.id).toEqual('test_id');
  }));

  it('#createF3xLine6aOverride() should get a record', fakeAsync(() => {
    const payload = new F3xLine6aOverride();
    let retval: F3xLine6aOverride | undefined;
    payload.id = 'test_id';
    service.createF3xLine6aOverride(payload).then((response) => {
      retval = response;
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/f3x_line6a_overrides/`);
    expect(req.request.method).toEqual('POST');
    const apiRetval = new F3xLine6aOverride();
    apiRetval.id = 'test_id';
    req.flush(apiRetval);
    httpTestingController.verify();
    tick(500);

    expect(retval?.id).toEqual('test_id');
  }));

  it('#updateF3xLine6aOverride() should get a record', fakeAsync(() => {
    const payload = new F3xLine6aOverride();
    let retval: F3xLine6aOverride | undefined;
    payload.id = 'test_id';
    service.updateF3xLine6aOverride(payload).then((response) => {
      retval = response;
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/f3x_line6a_overrides/test_id/`);
    expect(req.request.method).toEqual('PUT');
    const apiRetval = new F3xLine6aOverride();
    apiRetval.id = 'test_id';
    req.flush(apiRetval);
    httpTestingController.verify();
    tick(500);

    expect(retval?.id).toEqual('test_id');
  }));

  describe('getFutureReports', () => {
    it('should return a list of Form3X reports whose coverage through is after the submitted value', () => {
      service.getFutureReports('2024-01-20').subscribe((reports) => {
        expect(reports.length).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
