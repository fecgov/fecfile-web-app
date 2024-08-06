import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { FecApiPaginatedResponse } from 'app/shared/models/fec-api.model';
import { Candidate } from '../models/candidate.model';
import { FecFiling } from '../models/fec-filing.model';
import { testMockStore } from '../utils/unit-test.utils';
import { FecApiService } from './fec-api.service';

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

      service.getCandidateDetails('P12345678').subscribe((candidateData) => {
        expect(candidateData).toEqual(candidate);
      });

      const req = httpTestingController.expectOne(
        'https://localhost/api/v1/contacts/candidate/?candidate_id=P12345678',
      );

      expect(req.request.method).toEqual('GET');
      req.flush(candidate);
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

      const req = httpTestingController.expectOne(
        `https://localhost/api/v1/openfec/C00601211/committee/?force_efo_target=PRODUCTION`,
      );

      expect(req.request.method).toEqual('GET');
      req.flush(response);
    });
  });

  describe('#getCommitteeRecentF1Filing()', () => {
    it('should call api with request for most recent f1 filing', () => {
      const f1Filing: FecFiling = FecFiling.fromJSON({ form_type: 'F1N', pdf_url: 'go here' });

      service.getCommitteeRecentF1Filing('C00601211').subscribe((mostRecentFiling) => {
        expect(mostRecentFiling).toEqual(f1Filing);
      });

      const req = httpTestingController.expectOne(`https://localhost/api/v1/openfec/C00601211/f1_filing/`);

      expect(req.request.method).toEqual('GET');
      req.flush(f1Filing);
    });
  });
  describe('#queryFilings()', () => {
    it('should call api with query for f1 filings', () => {
      const f1Filings = [FecFiling.fromJSON({ form_type: 'F1N', pdf_url: 'go here' })];

      service.queryFilings('foo', 'F1').then((filings) => {
        expect(filings[0]).toEqual(f1Filings[0]);
      });

      const req = httpTestingController.expectOne(
        `https://localhost/api/v1/openfec/query_filings/?query=foo&form_type=F1`,
      );

      expect(req.request.method).toEqual('GET');
      req.flush({ results: f1Filings });
    });
  });
});
