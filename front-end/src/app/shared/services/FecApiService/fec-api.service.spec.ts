import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FecApiService } from './fec-api.service';

describe('FecApiService', () => {
  let service: FecApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(FecApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
