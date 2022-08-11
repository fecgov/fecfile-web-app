import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ListRestResponse } from '../models/rest-api.model';
import { environment } from '../../../environments/environment';
import { CommitteeUser } from '../models/user.model';
import { UsersService } from './users.service';
import { F3xSummary } from '../models/f3x-summary.model';
import { FECUploadStatus } from '../models/fec-upload-status.model';
import { selectActiveReport } from '../../store/active-report.selectors';

describe('TransactionService', () => {
  let service: UsersService;
  let httpTestingController: HttpTestingController;

  const activeReport: F3xSummary = F3xSummary.fromJSON({
    upload_status: FECUploadStatus.fromJSON({
      status:"ACCEPTED"
    })
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UsersService,
        provideMockStore({
          initialState: { activeReport: activeReport },
          selectors: [{ selector: selectActiveReport, value: activeReport }],
        }),
      ],
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

    const req = httpTestingController.expectOne(`${environment.apiUrl}/committee/users/?page=1`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
    httpTestingController.verify();
  });

  it('should have stubbed out "Delete" methods', () => {
    const cUser = new CommitteeUser();
    expect(service.delete(cUser)).toBeTruthy();
  });
});
