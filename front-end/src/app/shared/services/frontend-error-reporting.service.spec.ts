import { TestBed } from '@angular/core/testing';
import { FrontendErrorReportingService } from './frontend-error-reporting.service';

describe('FrontendErrorReportingService', () => {
  let service: FrontendErrorReportingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FrontendErrorReportingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not throw when runtime error is reported', () => {
    expect(() => service.reportRuntimeError(new Error('runtime test'))).not.toThrow();
  });

  it('should not throw when promise rejection is reported', () => {
    expect(() => service.reportPromiseRejection('promise test')).not.toThrow();
  });
});
