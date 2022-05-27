import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FecApiService } from './fec-api.service';
import { FecApiPaginatedResponse } from 'app/shared/models/fec-api.model';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { environment } from 'environments/environment';
import { FecFiling } from '../models/fec-filing.model';

describe('FecApiService', () => {
  let httpTestingController: HttpTestingController;
  let service: FecApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
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
        api_version: '1.0',
        pagination: {
          page: 1,
          per_page: 20,
          count: 1,
          pages: 1,
        },
        results: [committeeAccount],
      };

      service.getDetails('C00601211').subscribe((committeeAccountData) => {
        expect(committeeAccountData).toEqual(committeeAccount);
      });

      const req = httpTestingController.expectOne(
        'https://api.open.fec.gov/v1/committee/C00601211/?api_key=' + environment.fecApiKey
      );

      expect(req.request.method).toEqual('GET');
      req.flush(response);
    });
  });

  describe('#getCommitteeRecentFiling()', () => {
    it('should return most recent filing from realtime endpoint', () => {
      const f1Filing: FecFiling = FecFiling.fromJSON({ form_type: 'F1N', pdf_url: 'go here' });
      const f2Filing: FecFiling = FecFiling.fromJSON({ form_type: 'F2', pdf_url: 'dont go here' });
      const response: FecApiPaginatedResponse = {
        api_version: '1.0',
        pagination: {
          page: 1,
          per_page: 20,
          count: 1,
          pages: 1,
        },
        results: [f2Filing, f1Filing],
      };

      service.getCommitteeRecentFiling('C00601211').subscribe((mostRecentFiling) => {
        expect(mostRecentFiling).toEqual(f1Filing);
      });

      const req = httpTestingController.expectOne(
        `https://api.open.fec.gov/v1/efile/filings/?api_key=${environment.fecApiKey}&committee_id=C00601211&sort=-receipt_date`
      );

      expect(req.request.method).toEqual('GET');
      req.flush(response);
    });
  });

  it('should return most recent filing from nightly endpoint', () => {
    const f1Filing: FecFiling = FecFiling.fromJSON({ form_type: 'F1N', pdf_url: 'go here' });
    const f2Filing: FecFiling = FecFiling.fromJSON({ form_type: 'F2', pdf_url: 'dont go here' });
    const realtimeResponse: FecApiPaginatedResponse = {
      api_version: '1.0',
      pagination: {
        page: 1,
        per_page: 20,
        count: 1,
        pages: 1,
      },
      results: [f2Filing],
    };

    const nightlyResponse: FecApiPaginatedResponse = {
      api_version: '1.0',
      pagination: {
        page: 1,
        per_page: 20,
        count: 1,
        pages: 1,
      },
      results: [f1Filing],
    };

    service.getCommitteeRecentFiling('C00601211').subscribe((mostRecentFiling) => {
      expect(mostRecentFiling).toEqual(f1Filing);
    });

    const realtimeReq = httpTestingController.expectOne(
      `https://api.open.fec.gov/v1/efile/filings/?api_key=${environment.fecApiKey}&committee_id=C00601211&sort=-receipt_date`
    );
    expect(realtimeReq.request.method).toEqual('GET');
    realtimeReq.flush(realtimeResponse);
    const nightlyReq = httpTestingController.expectOne(
      `https://api.open.fec.gov/v1/filings/?api_key=${environment.fecApiKey}&sort=-receipt_date&per_page=1&page=1&committee_id=C00601211&form_type=F1`
    );
    expect(nightlyReq.request.method).toEqual('GET');
    nightlyReq.flush(nightlyResponse);
  });
});
