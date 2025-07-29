import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

export enum CalculationStatus {
  CALCULATING = 'CALCULATING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
}

@Injectable({
  providedIn: 'root',
})
export class ServerSideEventService {
  calculationNotification(reportId: string): Observable<string> {
    const sseUrl = `${environment.apiUrl}/sse/${reportId}/calculation-status/`;

    return new Observable<string>((observer) => {
      const eventSource = new EventSource(sseUrl, { withCredentials: true });

      eventSource.onmessage = (event) => {
        if (event.data !== CalculationStatus.SUCCEEDED) return;
        observer.next(event.data);
        observer.complete();
      };

      eventSource.onerror = (error) => {
        observer.error(error);
      };

      return () => {
        eventSource.close();
      };
    });
  }

  webPrintNotification(submissionId: string | number): Observable<string> {
    const sseUrl = `${environment.apiUrl}/sse/${submissionId}/webprint-status/`;
    return new Observable<string>((observer) => {
      const eventSource = new EventSource(sseUrl, { withCredentials: true });
      eventSource.onmessage = (event) => {
        const status = event.data;
        observer.next(status);
        if (status === 'LISTENING' || status.startsWith(':')) return;
        observer.complete();
      };
      eventSource.onerror = (error) => {
        observer.error(error);
      };
      return () => eventSource.close();
    });
  }
}
