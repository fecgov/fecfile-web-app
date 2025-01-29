import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from '../utils/unit-test.utils';
import { environment } from '../../../environments/environment';
import { CommitteeAccountService } from './committee-account.service';
import { ListRestResponse } from '../models/rest-api.model';
import { CommitteeAccount } from '../models/committee-account.model';
import { provideHttpClient } from '@angular/common/http';

describe('CommitteeAccountService', () => {
  let service: CommitteeAccountService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        CommitteeAccountService,
        provideMockStore(testMockStore),
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);

    service = TestBed.inject(CommitteeAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get committees', () => {
    const committees = [
      CommitteeAccount.fromJSON({
        id: 1,
      }),
      CommitteeAccount.fromJSON({
        id: 2,
      }),
    ];
    const mockResponse: ListRestResponse = {
      count: 2,
      next: 'https://next-page',
      previous: 'https://previous-page',
      pageNumber: 1,
      results: committees,
    };
    service.getCommittees().then((response: CommitteeAccount[]) => {
      expect(response).toEqual(committees);
    });
    const req = httpTestingController.expectOne(`${environment.apiUrl}/committees/`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
    httpTestingController.verify();
  });

  it('should call api to activate', async () => {
    const committeeId = '123';
    const resultPromise = service.activateCommittee(committeeId);
    const request = httpTestingController.expectOne(`${environment.apiUrl}/committees/${committeeId}/activate/`);
    expect(request.request.method).toEqual('POST');
    request.flush(true);
    const result = await resultPromise;
    expect(result).toBeTrue();

    httpTestingController.verify();
  });

  it('should call api get active committee', waitForAsync(() => {
    const committeeId = '123';
    service.getActiveCommittee().then((committee) => {
      expect(committee.id).toBe(committeeId);
    });
    const request = httpTestingController.expectOne(`${environment.apiUrl}/committees/active/`);
    expect(request.request.method).toEqual('GET');
    request.flush({ id: committeeId });
    httpTestingController.verify();
  }));

  it('should calle api to create committee account', waitForAsync(() => {
    const committeeId = '123';
    service.createCommitteeAccount(committeeId).then((committee) => {
      expect(committee.committee_id).toBe(committeeId);
    });
    const request = httpTestingController.expectOne(`${environment.apiUrl}/committees/create_account/`);
    expect(request.request.method).toEqual('POST');
    expect(request.request.body).toEqual({ committee_id: '123' });
    request.flush({ id: 1, committee_id: committeeId });
    httpTestingController.verify();
  }));
});
