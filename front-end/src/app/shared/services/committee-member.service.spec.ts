import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectUserLoginData } from 'app/store/user-login-data.selectors';
import type { Mock } from 'vitest';
import { environment } from '../../../environments/environment';
import { CommitteeMember, ListRestResponse, Roles } from '../models';
import { testCommitteeAdminLoginData, testMockStore, testUserLoginData } from '../utils/unit-test.utils';
import { ApiService } from './api.service';
import { CommitteeMemberService } from './committee-member.service';

describe('CommitteeMemberService', () => {
  let service: CommitteeMemberService;
  let httpTestingController: HttpTestingController;
  let mockStore: MockStore;
  let apiService: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        CommitteeMemberService,
        ApiService,
        provideMockStore(testMockStore()),
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(CommitteeMemberService);
    apiService = TestBed.inject(ApiService);
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
    vi.spyOn(service, 'getMemberCount').mockReturnValue(Promise.resolve({ count: 1 }));
    vi.spyOn(service, 'getAdminCount').mockReturnValue(Promise.resolve({ count: 1 }));

    const newMember = CommitteeMember.fromJSON({ email: 'new_member@test.com', role: 'MANAGER' });

    const addMemberPromise = service.addMember('new_member@test.com', 'MANAGER' as unknown as typeof Roles);

    const req = httpTestingController.expectOne(`${environment.apiUrl}/committee-members/add-member/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'new_member@test.com', role: 'MANAGER' });

    req.flush(newMember);

    const member = await addMemberPromise;
    expect(member).toEqual(newMember);
  });

  it('should return true for needsSecondAdmin() if only one committee admin exists', async () => {
    vi.spyOn(service, 'getMemberCount').mockReturnValue(Promise.resolve({ count: 1 }));
    vi.spyOn(service, 'getAdminCount').mockReturnValue(Promise.resolve({ count: 1 }));
    mockStore.overrideSelector(selectUserLoginData, testCommitteeAdminLoginData());
    mockStore.refreshState();
    await service.updateCommitteeCounts();

    const needSecondAdmin = await service.needsSecondAdmin();

    expect(needSecondAdmin).toBe(true);
  });

  it('should return false for needsSecondAdmin() if more than one committee admin exists', () => {
    vi.spyOn(service, 'getMemberCount').mockReturnValue(Promise.resolve({ count: 1 }));
    vi.spyOn(service, 'getAdminCount').mockReturnValue(Promise.resolve({ count: 2 }));
    mockStore.overrideSelector(selectUserLoginData, testCommitteeAdminLoginData());
    mockStore.refreshState();
    expect(service.needsSecondAdmin()).toBe(false);
  });

  it('should return false for needsSecondAdmin() if user is not a committee admin', () => {
    vi.spyOn(service, 'getMemberCount').mockReturnValue(Promise.resolve({ count: 1 }));
    vi.spyOn(service, 'getAdminCount').mockReturnValue(Promise.resolve({ count: 1 }));
    mockStore.overrideSelector(selectUserLoginData, {
      ...testUserLoginData(),
      role: 'MANAGER',
    });
    expect(service.needsSecondAdmin()).toBe(false);
  });

  it('should update the member signal when updating', async () => {
    const getMemberCountSpy = vi.spyOn(service, 'getMemberCount').mockReturnValue(Promise.resolve({ count: 1 }));
    const getAdminCountSpy = vi.spyOn(service, 'getAdminCount').mockReturnValue(Promise.resolve({ count: 1 }));
    const member = CommitteeMember.fromJSON({ id: '1', email: 'admin1@test.com', role: 'COMMITTEE_ADMINISTRATOR' });
    const apiSpy: Mock = vi.spyOn(apiService, 'put');
    apiSpy.mockResolvedValue({ id: '1', email: 'admin1@test.com', role: 'MANAGER' } as CommitteeMember);

    await service.update({ ...member, role: 'MANAGER' } as CommitteeMember);
    expect(getMemberCountSpy).toHaveBeenCalledOnce();
    expect(getAdminCountSpy).toHaveBeenCalledOnce();
  });
});
