import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from '../utils/unit-test.utils';
import { environment } from '../../../environments/environment';
import { CommitteeMemberService } from './committee-member.service';
import { provideHttpClient } from '@angular/common/http';
import { ListRestResponse, CommitteeMember } from '../models';

describe('CommitteeMemberService', () => {
  let service: CommitteeMemberService;
  let httpTestingController: HttpTestingController;

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
});
