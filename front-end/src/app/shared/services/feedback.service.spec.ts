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
import { provideHttpClient } from '@angular/common/http';

describe('FeedbackService', () => {
  let service: FeedbackService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ApiService,
        LoginService,
        provideMockStore(testMockStore()),
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(FeedbackService);
    TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#submitFeedback() should POST a payload', fakeAsync(() => {
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
});
