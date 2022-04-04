import { TestBed } from '@angular/core/testing';

import { FecApiService } from './fec-api.service';

describe('FecApiService', () => {
  let service: FecApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FecApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
