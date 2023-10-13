import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from '../utils/unit-test.utils';
import { Form3XService } from './form-3x.service';
import { Form3X } from '../models/form-3x.model';
import { environment } from '../../../environments/environment';

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

  it('#get should return a specific f3x summary record', () => {
    const form3X: Form3X = Form3X.fromJSON({ id: '999' });

    service.get('999').subscribe((response: Form3X) => {
      expect(response).toEqual(form3X);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/reports/form-3x/${form3X.id}`);
    expect(req.request.method).toEqual('GET');
    req.flush(form3X);
    httpTestingController.verify();
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
      `${environment.apiUrl}/reports/form-3x/${form3X.id}/?fields_to_validate=`
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

  it('should set the COH store values', () => {
    const reports: Form3X[] = [{ id: '999' } as Form3X];
    const result = service.setStoreCashOnHand(reports);
    expect(result).not.toBeTruthy();
  });
});
