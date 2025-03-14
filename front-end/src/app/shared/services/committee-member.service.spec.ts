import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { testCommitteeAdminLoginData, testMockStore } from '../utils/unit-test.utils';
import { environment } from '../../../environments/environment';
import { CommitteeMemberService } from './committee-member.service';
import { provideHttpClient } from '@angular/common/http';
import { ListRestResponse, CommitteeMember, Roles } from '../models';
import { selectUserLoginData } from 'app/store/user-login-data.selectors';

describe('CommitteeMemberService', () => {
  let service: CommitteeMemberService;
  let httpTestingController: HttpTestingController;
  let mockStore: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        CommitteeMemberService,
        provideMockStore(testMockStore),
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(CommitteeMemberService);
    mockStore = TestBed.inject(MockStore);
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
          role: 'MANAGER',
          is_active: true,
        }),
      ],
    };

    service.getTableData().then((response: ListRestResponse) => {
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

  it('should add a new member with addMember()', async () => {
    const newMember = CommitteeMember.fromJSON({ email: 'new_member@test.com', role: 'MANAGER' });

    const addMemberPromise = service.addMember('new_member@test.com', 'MANAGER' as unknown as typeof Roles);

    const req = httpTestingController.expectOne(`${environment.apiUrl}/committee-members/add-member/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'new_member@test.com', role: 'MANAGER' });

    req.flush(newMember);

    const member = await addMemberPromise;
    expect(member).toEqual(newMember);
  });

  it('should return true for isOnlyOne() if only one committee admin exists', () => {
    spyOn(service.members$, 'value').and.returnValue([
      CommitteeMember.fromJSON({ email: 'admin@test.com', role: 'COMMITTEE_ADMINISTRATOR' }),
    ]);
    mockStore.overrideSelector(selectUserLoginData, testCommitteeAdminLoginData);
    mockStore.refreshState();

    expect(service.isOnlyOne()).toBeTrue();
  });

  it('should return false for isOnlyOne() if more than one committee admin exists', () => {
    mockStore.overrideSelector(selectUserLoginData, testCommitteeAdminLoginData);
    mockStore.refreshState();
    spyOn(service.members$, 'value').and.returnValue([
      CommitteeMember.fromJSON({ email: 'admin1@test.com', role: 'COMMITTEE_ADMINISTRATOR' }),
      CommitteeMember.fromJSON({ email: 'admin2@test.com', role: 'COMMITTEE_ADMINISTRATOR' }),
    ]);

    expect(service.isOnlyOne()).toBeFalse();
  });

  it('should return false for isOnlyOne() if user is not a committee admin', () => {
    spyOn(service.members$, 'value').and.returnValue([
      CommitteeMember.fromJSON({ email: 'admin@test.com', role: 'COMMITTEE_ADMINISTRATOR' }),
    ]);

    expect(service.isOnlyOne()).toBeFalse();
  });
});
