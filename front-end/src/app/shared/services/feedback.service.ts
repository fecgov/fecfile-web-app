import { HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Feedback } from '../models/feedback.model';
import { ApiService } from './api.service';

interface SecurityPolicyViolation {
  type: string;
  url: string;
  user_agent: string;
  body: {
    blockedURL: string;
    documentURL: string;
    originalPolicy: string;
    disposition: string;
    effectiveDirective: string;
    violatedDirective: string;
    lineNumber: number;
    columnNumber: number;
    sourceFile: string;
    statusCode: number;
    referrer: string;
    sample: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  private readonly apiService = inject(ApiService);
  private readonly apiEndpoint = '/feedback';

  constructor() {
    window.addEventListener('securitypolicyviolation', this.handleCspViolation.bind(this));
  }

  public async submitFeedback(feedback: Feedback): Promise<void> {
    const response = await this.apiService.post<void>(`${this.apiEndpoint}/submit/`, feedback, {}, [
      HttpStatusCode.BadRequest,
      HttpStatusCode.InternalServerError,
    ]);
    if (!response.body) {
      throw new Error();
    }
  }

  private handleCspViolation(event: SecurityPolicyViolationEvent) {
    // Extract violation details
    const violationReport: SecurityPolicyViolation = {
      body: {
        blockedURL: event.blockedURI,
        documentURL: event.documentURI,
        originalPolicy: event.originalPolicy,
        disposition: event.disposition,
        effectiveDirective: event.effectiveDirective,
        violatedDirective: event.violatedDirective,
        lineNumber: event.lineNumber,
        columnNumber: event.columnNumber,
        sourceFile: event.sourceFile,
        statusCode: event.statusCode,
        referrer: event.referrer,
        sample: event.sample,
      },
      type: 'csp-violation',
      url: event.documentURI,
      user_agent: navigator.userAgent,
    };

    // Send violation report to the backend
    this.reportViolation(violationReport);
  }

  // Method to send violation report to the backend
  private reportViolation(violationReport: SecurityPolicyViolation) {
    return this.apiService.post(`${this.apiEndpoint}/csp-report/`, violationReport);
  }
}
