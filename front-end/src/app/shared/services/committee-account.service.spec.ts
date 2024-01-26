import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from '../utils/unit-test.utils';
import { environment } from '../../../environments/environment';
import { CommitteeAccountService } from './committee-account.service';
import { ListRestResponse } from '../models/rest-api.model';
import { CommitteeAccount } from '../models/committee-account.model';

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
});
