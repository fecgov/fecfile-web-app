/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { environment } from 'environments/environment';
import { testMockStore } from '../utils/unit-test.utils';
import { ApiService } from './api.service';

import { Router } from '@angular/router';
import { Feedback } from '../models/feedback.model';
import { FeedbackService } from './feedback.service';
import { LoginService } from './login.service';
import { HttpResponse, provideHttpClient } from '@angular/common/http';

describe('FeedbackService', () => {
  let service: FeedbackService;
  let httpTestingController: HttpTestingController;
  let apiService: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ApiService,
        LoginService,
        provideMockStore(testMockStore),
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    TestBed.inject(Router);
    apiService = TestBed.inject(ApiService);
  });

  afterEach(() => {
    window.removeEventListener('securitypolicyviolation', () => {});
  });

  it('should be created', () => {
    service = TestBed.inject(FeedbackService);
    expect(service).toBeTruthy();
  });

  it('should add event listener for securitypolicyviolation on construction', () => {
    const addEventListenerSpy = spyOn(window, 'addEventListener').and.callThrough(); // Ensure callThrough
    service = TestBed.inject(FeedbackService);
    expect(addEventListenerSpy).toHaveBeenCalledWith('securitypolicyviolation', jasmine.any(Function));
  });

  it('#submitFeedback() should POST a payload', fakeAsync(() => {
    service = TestBed.inject(FeedbackService);
    const feedback: Feedback = {
      action: 'test_action',
      feedback: 'test_feedback',
      about: 'test_about',
      location: 'test_location',
    };

    service.submitFeedback(feedback).then();
    tick(100);
    const req = httpTestingController.expectOne(`${environment.apiUrl}/feedback/submit/`);
    expect(req.request.method).toEqual('POST');
    req.flush(feedback);
    httpTestingController.verify();
  }));

  it('should handle SecurityPolicyViolationEvent and report violation', fakeAsync(() => {
    const handleCspViolationSpy = spyOn<any>(FeedbackService.prototype, 'handleCspViolation').and.callThrough();
    const postSpy = spyOn(apiService, 'post').and.resolveTo(new HttpResponse());
    service = TestBed.inject(FeedbackService);
    const mockEvent = new Event('securitypolicyviolation') as SecurityPolicyViolationEvent;
    Object.defineProperties(mockEvent, {
      blockedURI: { value: 'https://example.com/blocked.js' },
      documentURI: { value: 'https://example.com/' },
      originalPolicy: { value: "default-src 'self'" },
      disposition: { value: 'enforce' },
      effectiveDirective: { value: 'script-src' },
      violatedDirective: { value: "script-src 'self'" },
      lineNumber: { value: 42 },
      columnNumber: { value: 13 },
      sourceFile: { value: 'https://example.com/script.js' },
      statusCode: { value: 200 },
      referrer: { value: 'https://referrer.com/' },
      sample: { value: 'sample code' },
    });

    window.dispatchEvent(mockEvent);
    tick();

    expect(handleCspViolationSpy).toHaveBeenCalledWith(mockEvent);

    expect(postSpy).toHaveBeenCalledWith(
      '/feedback/csp-report/',
      jasmine.objectContaining({
        body: {
          blockedURL: 'https://example.com/blocked.js',
          documentURL: 'https://example.com/',
          originalPolicy: "default-src 'self'",
          disposition: 'enforce',
          effectiveDirective: 'script-src',
          violatedDirective: "script-src 'self'",
          lineNumber: 42,
          columnNumber: 13,
          sourceFile: 'https://example.com/script.js',
          statusCode: 200,
          referrer: 'https://referrer.com/',
          sample: 'sample code',
        },
        type: 'csp-violation',
        url: 'https://example.com/',
        user_agent: navigator.userAgent,
      }),
    );
  }));
});
