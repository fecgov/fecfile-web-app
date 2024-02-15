import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { FecApiPaginatedResponse } from 'app/shared/models/fec-api.model';
import { FecFiling } from '../models/fec-filing.model';
import { testMockStore } from '../utils/unit-test.utils';
import { FecApiService } from './fec-api.service';
import { Candidate } from '../models/candidate.model';

describe('FecApiService', () => {
  let httpTestingController: HttpTestingController;
  let service: FecApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FecApiService, provideMockStore(testMockStore)],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(FecApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getCandidateDetails()', () => {
    it('should return candidate details', () => {
      const candidate: Candidate = new Candidate();
      const response: FecApiPaginatedResponse = {
        api_version: '1.0',
        pagination: {
          page: 1,
          per_page: 20,
          count: 1,
          pages: 1,
        },
        results: [candidate],
      };

      service.getCandidateDetails('P12345678').subscribe((candidateData) => {
        expect(candidateData).toEqual(candidate);
      });

      const req = httpTestingController.expectOne(
        'https://localhost/api/v1/contacts/candidate/?candidate_id=P12345678',
      );

      expect(req.request.method).toEqual('GET');
      req.flush(response);
    });
  });

  describe('#getCommitteeDetails()', () => {
    it('should return committee details', () => {
      const committeeAccount: CommitteeAccount = new CommitteeAccount();
      const response: FecApiPaginatedResponse = {
        api_version: '1.0',
        pagination: {
          page: 1,
          per_page: 20,
          count: 1,
          pages: 1,
        },
        results: [committeeAccount],
      };

      service.getCommitteeDetails('C00601211').subscribe((committeeAccountData) => {
        expect(committeeAccountData).toEqual(committeeAccount);
      });

      const req = httpTestingController.expectOne(`https://localhost/api/v1/openfec/C00601211/committee/`);

      expect(req.request.method).toEqual('GET');
      req.flush(response);
    });
  });

  describe('#getCommitteeRecentFiling()', () => {
    it('should return most recent filing from realtime endpoint', () => {
      const f1Filing: FecFiling = FecFiling.fromJSON({ form_type: 'F1N', pdf_url: 'go here' });

      service.getCommitteeRecentFiling('C00601211').subscribe((mostRecentFiling) => {
        expect(mostRecentFiling).toEqual(f1Filing);
      });

      const req = httpTestingController.expectOne(`https://localhost/api/v1/openfec/C00601211/filings/`);

      expect(req.request.method).toEqual('GET');
      req.flush(f1Filing);
    });
  });

  it('should return most recent filing from nightly endpoint', () => {
    const f2Filing: FecFiling = FecFiling.fromJSON({ form_type: 'F2', pdf_url: 'dont go here' });

    service.getCommitteeRecentFiling('C00601211').subscribe((mostRecentFiling) => {
      expect(mostRecentFiling).toEqual(f2Filing);
    });

    const realtimeReq = httpTestingController.expectOne(`https://localhost/api/v1/openfec/C00601211/filings/`);
    expect(realtimeReq.request.method).toEqual('GET');
    realtimeReq.flush(f2Filing);
  });
});
