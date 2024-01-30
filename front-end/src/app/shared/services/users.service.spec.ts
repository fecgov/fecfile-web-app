import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from '../utils/unit-test.utils';
import { ListRestResponse } from '../models/rest-api.model';
import { environment } from '../../../environments/environment';
import { CommitteeUser } from '../models/user.model';
import { UsersService } from './users.service';
import { CommitteeAccountService } from './committee-account.service';
import { of } from 'rxjs';
import { CommitteeAccount } from '../models/committee-account.model';

describe('UserService', () => {
  let service: UsersService;
  let httpTestingController: HttpTestingController;
  let committeeAccountService: CommitteeAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsersService, provideMockStore(testMockStore), CommitteeAccountService],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(UsersService);

    committeeAccountService = TestBed.inject(CommitteeAccountService);
    spyOn(committeeAccountService, 'getCommittees').and.callFake(() => of([{ id: '123' }] as CommitteeAccount[]));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getTableData() should return a list of contacts', () => {
    const mockResponse: ListRestResponse = {
      count: 2,
      next: 'https://next-page',
      previous: 'https://previous-page',
      pageNumber: 1,
      results: [
        CommitteeUser.fromJSON({
          first_name: 'John',
          last_name: 'Smith',
          email: 'john_smith@test.com',
          role: 'C_ADMIN',
          is_active: true,
          id: 1,
        }),
        CommitteeUser.fromJSON({
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'jane_smith@test.com',
          role: 'C_ADMIN',
          is_active: true,
          id: 2,
        }),
      ],
    };

    service.getTableData().subscribe((response: ListRestResponse) => {
      expect(response).toEqual(mockResponse);
    });
    const req = httpTestingController.expectOne(`${environment.apiUrl}/committees/123/users/?page=1`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
    httpTestingController.verify();
  });

  it('should have stubbed out "Delete" methods', () => {
    const cUser = new CommitteeUser();
    expect(service.delete(cUser)).toBeTruthy();
  });
});
