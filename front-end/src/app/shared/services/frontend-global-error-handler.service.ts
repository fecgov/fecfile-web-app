import { ErrorHandler, inject, Injectable } from '@angular/core';
import { FrontendErrorReportingService } from './frontend-error-reporting.service';

@Injectable()
export class FrontendGlobalErrorHandlerService extends ErrorHandler {
  private readonly errorReportingService = inject(FrontendErrorReportingService);

  override handleError(error: unknown): void {
    this.errorReportingService.reportRuntimeError(error, 'angular.error-handler');
    super.handleError(error);
  }
}
