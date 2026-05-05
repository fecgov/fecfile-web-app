import { ErrorHandler, inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FrontendErrorReportingService } from './frontend-error-reporting.service';

@Injectable()
export class FrontendGlobalErrorHandlerService extends ErrorHandler {
  private readonly errorReportingService = inject(FrontendErrorReportingService);
  private readonly messageService = inject(MessageService);
  private readonly chunkReloadMarkerKey = 'fecfile:chunk-reload-attempted-at';
  private readonly chunkReloadMarkerTtlMs = 60000;
  private readonly chunkReloadDelayMs = 5000;

  override handleError(error: unknown): void {
    this.maybeRecoverFromChunkLoadFailure(error);
    this.errorReportingService.reportRuntimeError(error, 'angular.error-handler');
    super.handleError(error);
  }

  private maybeRecoverFromChunkLoadFailure(error: unknown): void {
    if (!this.isChunkLoadFailure(error)) {
      return;
    }

    this.reloadApplicationOnce();
  }

  private isChunkLoadFailure(error: unknown): boolean {
    const message = this.extractErrorMessage(error);
    if (!message) {
      return false;
    }

    const normalizedMessage = message.toLowerCase();
    return (
      normalizedMessage.includes('chunkloaderror') ||
      normalizedMessage.includes('loading chunk') ||
      normalizedMessage.includes('failed to fetch dynamically imported module') ||
      normalizedMessage.includes('importing a module script failed') ||
      (normalizedMessage.includes('failed to load module script') && normalizedMessage.includes('text/html'))
    );
  }

  private extractErrorMessage(error: unknown): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === 'object' && error !== null && 'message' in error) {
      const message = (error as { message?: unknown }).message;
      if (typeof message === 'string') {
        return message;
      }
    }

    return '';
  }

  private reloadApplicationOnce(): void {
    const now = Date.now();
    const previousAttemptAt = Number.parseInt(sessionStorage.getItem(this.chunkReloadMarkerKey) ?? '', 10);
    if (Number.isFinite(previousAttemptAt) && now - previousAttemptAt < this.chunkReloadMarkerTtlMs) {
      return;
    }

    sessionStorage.setItem(this.chunkReloadMarkerKey, String(now));

    this.messageService.add({
      severity: 'warn',
      summary: 'Updating FECfile+',
      detail: 'A new version of FECfile+ is available. Reloading now...',
      life: this.chunkReloadDelayMs,
    });

    globalThis.setTimeout(() => {
      globalThis.location.reload();
    }, this.chunkReloadDelayMs);
  }
}
