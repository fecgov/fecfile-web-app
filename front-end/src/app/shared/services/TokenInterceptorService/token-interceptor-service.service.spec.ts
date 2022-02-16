import { TestBed, inject } from '@angular/core/testing';

import { TokenInterceptorService } from './token-interceptor-service.service';

xdescribe('TokenInterceptorServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TokenInterceptorService],
    });
  });

  xit('should be created', inject([TokenInterceptorService], (service: TokenInterceptorService) => {
    expect(service).toBeTruthy();
  }));
});
