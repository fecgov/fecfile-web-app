import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, convertToParamMap } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from '../utils/unit-test.utils';
import { ReportF3XService } from '../services/report-f3x.service';
import { ReportResolver } from './report.resolver';
import { Report } from '../models/report.model';
import { ReportF3X } from '../models/report-f3x.model';
import { environment } from '../../../environments/environment';

describe('ReportResolver', () => {
  let resolver: ReportResolver;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReportF3XService, provideMockStore(testMockStore)],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    resolver = TestBed.inject(ReportResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should return an F3X report', () => {
    const reportF3X: ReportF3X = ReportF3X.fromJSON({ id: '999' });
    const route = {
      paramMap: convertToParamMap({ reportId: '999' }),
    };

    resolver.resolve(route as ActivatedRouteSnapshot).subscribe((response: Report | undefined) => {
      expect(response).toEqual(reportF3X);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/reports/${reportF3X.id}`);
    expect(req.request.method).toEqual('GET');
    req.flush(reportF3X);
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
