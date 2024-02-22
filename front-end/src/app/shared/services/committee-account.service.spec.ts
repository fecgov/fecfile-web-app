import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from '../utils/unit-test.utils';
import { environment } from '../../../environments/environment';
import { CommitteeAccountService, CommitteeMemberService } from './committee-account.service';
import { ListRestResponse } from '../models/rest-api.model';
import { CommitteeAccount } from '../models/committee-account.model';
import { of } from 'rxjs';
import { CommitteeMember } from '../models/committee-member.model';

describe('CommitteeAccountService', () => {
  let service: CommitteeAccountService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommitteeAccountService, provideMockStore(testMockStore)],
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
    service.getCommittees().subscribe((response: CommitteeAccount[]) => {
      expect(response).toEqual(committees);
    });
    const req = httpTestingController.expectOne(`${environment.apiUrl}/committees/`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
    httpTestingController.verify();
  });

  it('should call api to activate', () => {
    const committeeId = '123';
    service.activateCommittee(committeeId).subscribe((result) => {
      expect(result).toBeTrue();
    });

    const request = httpTestingController.expectOne(`${environment.apiUrl}/committees/${committeeId}/activate/`);
    expect(request.request.method).toEqual('POST');
    request.flush(true);
    httpTestingController.verify();
  });

  it('should call api get active committee', waitForAsync(() => {
    const committeeId = '123';
    service.getActiveCommittee().subscribe((committee) => {
      expect(committee.id).toBe(committeeId);
    });
    const request = httpTestingController.expectOne(`${environment.apiUrl}/committees/active/`);
    expect(request.request.method).toEqual('GET');
    request.flush({ id: committeeId });
    httpTestingController.verify();
  }));
});

describe('CommitteeMemberService', () => {
  let service: CommitteeMemberService;
  let httpTestingController: HttpTestingController;
  let committeeAccountService: CommitteeAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommitteeMemberService, provideMockStore(testMockStore), CommitteeAccountService],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(CommitteeMemberService);

    committeeAccountService = TestBed.inject(CommitteeAccountService);
    spyOn(committeeAccountService, 'getCommittees').and.callFake(() => of([{ id: '123' }] as CommitteeAccount[]));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getTableData() should return a list of members', () => {
    const mockResponse: ListRestResponse = {
      count: 2,
      next: 'https://next-page',
      previous: 'https://previous-page',
      pageNumber: 1,
      results: [
        CommitteeMember.fromJSON({
          first_name: 'John',
          last_name: 'Smith',
          email: 'john_smith@test.com',
          role: 'COMMITTEE_ADMINISTRATOR',
          is_active: true,
        }),
        CommitteeMember.fromJSON({
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'jane_smith@test.com',
          role: 'REVIEWER',
          is_active: true,
        }),
      ],
    };

    service.getTableData().subscribe((response: ListRestResponse) => {
      expect(response).toEqual(mockResponse);
    });
    const req = httpTestingController.expectOne(`${environment.apiUrl}/committee-members/?page=1`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
    httpTestingController.verify();
  });

  it('should have stubbed out "Delete" methods', () => {
    const member = new CommitteeMember();
    expect(service.delete(member)).toBeTruthy();
  });
});
