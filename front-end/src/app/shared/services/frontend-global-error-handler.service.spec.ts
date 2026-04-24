import { TestBed } from '@angular/core/testing';
import { FrontendGlobalErrorHandlerService } from './frontend-global-error-handler.service';
import { FrontendErrorReportingService } from './frontend-error-reporting.service';

describe('FrontendGlobalErrorHandlerService', () => {
  let handler: FrontendGlobalErrorHandlerService;
  const reportRuntimeError = vi.fn();

  beforeEach(() => {
    reportRuntimeError.mockReset();
    TestBed.configureTestingModule({
      providers: [
        FrontendGlobalErrorHandlerService,
        {
          provide: FrontendErrorReportingService,
          useValue: {
            reportRuntimeError,
          },
        },
      ],
    });

    handler = TestBed.inject(FrontendGlobalErrorHandlerService);
  });

  it('should be created', () => {
    expect(handler).toBeTruthy();
  });

  it('should forward error to reporting service', () => {
    const error = new Error('global error test');
    handler.handleError(error);

    expect(reportRuntimeError).toHaveBeenCalledWith(error, 'angular.error-handler');
  });
});
