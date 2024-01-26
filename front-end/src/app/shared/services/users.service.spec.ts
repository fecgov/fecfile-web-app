import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from '../utils/unit-test.utils';
import { ListRestResponse } from '../models/rest-api.model';
import { environment } from '../../../environments/environment';
import { CommitteeUser } from '../models/user.model';
import { UsersService } from './users.service';

describe('TransactionService', () => {
  let service: UsersService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsersService, provideMockStore(testMockStore)],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(UsersService);
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

    const req = httpTestingController.expectOne(`${environment.apiUrl}/committees//users/?page=1`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
    httpTestingController.verify();
  });

  it('should have stubbed out "Delete" methods', () => {
    const cUser = new CommitteeUser();
    expect(service.delete(cUser)).toBeTruthy();
  });
});
