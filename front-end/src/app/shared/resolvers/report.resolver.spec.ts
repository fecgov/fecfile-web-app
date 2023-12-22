import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, convertToParamMap } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from '../utils/unit-test.utils';
import { Form3XService } from '../services/form-3x.service';
import { ReportResolver } from './report.resolver';
import { Report } from '../models/report.model';
import { Form3X } from '../models/form-3x.model';
import { environment } from '../../../environments/environment';

describe('ReportResolver', () => {
  let resolver: ReportResolver;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Form3XService, provideMockStore(testMockStore)],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    resolver = TestBed.inject(ReportResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should return an F3X report', () => {
    const form3X: Form3X = Form3X.fromJSON({ id: '999' });
    const route = {
      paramMap: convertToParamMap({ reportId: '999' }),
    };

    resolver.resolve(route as ActivatedRouteSnapshot).subscribe((response: Report | undefined) => {
      console.log(`AHOY${response}`);
      expect(response).toEqual(form3X);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/reports/${form3X.id}`);
    expect(req.request.method).toEqual('GET');
    req.flush(form3X);
    httpTestingController.verify();
  });

  xit('should return undefined', () => {
    const route = {
      paramMap: convertToParamMap({ reportId: undefined }),
    };

    resolver.resolve(route as ActivatedRouteSnapshot).subscribe((response: Report | undefined) => {
      expect(response).toEqual(undefined);
    });
  });
});
