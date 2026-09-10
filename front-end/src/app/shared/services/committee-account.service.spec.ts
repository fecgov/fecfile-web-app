import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { environment } from '../../../environments/environment';
import { CommitteeAccount } from '../models/committee-account.model';
import { ListRestResponse } from '../models/rest-api.model';
import { testMockStore } from '../utils/unit-test.utils';
import { CommitteeAccountService } from './committee-account.service';
import { CommitteeMemberService } from './committee-member.service';

describe('CommitteeAccountService', () => {
  let committeeAccountService: CommitteeAccountService;
  let committeeMemberService: CommitteeMemberService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        CommitteeAccountService,
        provideMockStore(testMockStore()),
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);

    committeeAccountService = TestBed.inject(CommitteeAccountService);
    committeeMemberService = TestBed.inject(CommitteeMemberService);
  });

  it('should be created', () => {
    expect(committeeAccountService).toBeTruthy();
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
    committeeAccountService.getCommittees().then((response: CommitteeAccount[]) => {
      expect(response).toEqual(committees);
    });
    const req = httpTestingController.expectOne(`${environment.apiUrl}/committees/`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
    httpTestingController.verify();
  });

  it('should call api to activate', async () => {
    vi.spyOn(committeeMemberService, 'updateCommitteeCounts').mockResolvedValue();
    const testCommitteeAccount = new CommitteeAccount();
    testCommitteeAccount.committee_id = '123';
    const resultPromise = committeeAccountService.activateCommittee(testCommitteeAccount.committee_id);
    const request = httpTestingController.expectOne(
      `${environment.apiUrl}/committees/${testCommitteeAccount.committee_id}/activate/`,
    );
    expect(request.request.method).toEqual('POST');
    request.flush(testCommitteeAccount);
    const result = await resultPromise;
    expect(result.committee_id).toBe('123');

    httpTestingController.verify();
  });

  it('should calle api to create committee account', () => {
    const committeeId = '123';
    committeeAccountService.createCommitteeAccount(committeeId).then((committee) => {
      expect(committee.committee_id).toBe(committeeId);
    });
    const request = httpTestingController.expectOne(`${environment.apiUrl}/committees/create_account/`);
    expect(request.request.method).toEqual('POST');
    expect(request.request.body).toEqual({ committee_id: '123' });
    request.flush({ id: 1, committee_id: committeeId });
    httpTestingController.verify();
  });
});
