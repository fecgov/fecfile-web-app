import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FecApiService } from './fec-api.service';
import { FecApiPaginatedResponse } from 'app/shared/models/fec-api.model';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { environment } from 'environments/environment';

describe('FecApiService', () => {
  let httpTestingController: HttpTestingController;
  let service: FecApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(FecApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  describe('#getDetails()', () => {
    it('should return committee details', () => {
      const committeeAccount: CommitteeAccount = new CommitteeAccount();
      const response: FecApiPaginatedResponse = {
        "api_version": "1.0",
        "pagination": {
            "page": 1,
            "per_page": 20,
            "count": 1,
            "pages": 1
        },
        results: [committeeAccount]
      }

      service.getDetails("C00601211")
        .subscribe(committeeAccountData => {
          expect(committeeAccountData).toEqual(committeeAccount);
        });
      
      const req = httpTestingController.expectOne("https://api.open.fec.gov/v1/committee/C00601211/?api_key="+environment.fecApiKey);

      expect(req.request.method).toEqual('GET');
      req.flush(response);
    })
  });
});