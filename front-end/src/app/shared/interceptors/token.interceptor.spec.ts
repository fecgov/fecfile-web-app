import { TestBed, inject } from '@angular/core/testing';

import { TokenInterceptor } from './token.interceptor';

xdescribe('TokenInterceptorServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TokenInterceptor],
    });
  });

  xit('should be created', inject([TokenInterceptor], (service: TokenInterceptor) => {
    expect(service).toBeTruthy();
  }));
});
