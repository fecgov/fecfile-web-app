import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { ContactService } from './contact.service';
import { UserLoginData } from 'app/shared/models/user.model';
import { Contact } from '../models/contact.model';
import { ListRestResponse } from 'app/shared/models/rest-api.model';
import { environment } from 'environments/environment';

describe('ContactService', () => {
  let service: ContactService;
  const userLoginData: UserLoginData = {
    committee_id: 'C00101212',
    email: 'test@fec.gov',
    role: null,
    token: null,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideMockStore({
          initialState: { fecfile_online_userLoginData: userLoginData },
          selectors: [{ selector: 'selectUserLoginData', value: userLoginData }],
        }),
      ],
    });

    // httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ContactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // describe('#getTableData()', () => {
  //   it('should return a list of contacts', () => {
  //     const mockResponse: ListRestResponse = {
  //       count: 1,
  //       next: 'http://next-page',
  //       previous: 'http://previous-page',
  //       results: [
  //         Contact.fromJSON({
  //           id: 'C00000001'
  //         }),
  //         Contact.fromJSON({
  //           id: 'C00000002'
  //         }),
  //       ];
  //     };

  //     service.getTableData().subscribe((response: ListRestResponse) => {
  //       expect(response).toEqual(mockResponse);
  //     });

  //     const req = httpTestingController.expectOne(
  //       `${environment.apiUrl}/contacts/?page=1`

  //     expect(req.request.method).toEqual('GET');
  //     req.flush(response);
  //   });
  // });
});
