import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { UserLoginData } from 'app/shared/models/user.model';
import { selectUserLoginData } from 'app/store/login.selectors';
import { ContactService } from './contact.service';
import { Contact } from '../models/contact.model';
import { ListRestResponse } from '../models/rest-api.model';
import { environment } from '../../../environments/environment';

describe('ContactService', () => {
  let httpTestingController: HttpTestingController;
  let service: ContactService;
  const userLoginData: UserLoginData = {
    committee_id: 'C00000000',
    email: 'email@fec.com',
    is_allowed: true,
    token: 'jwttokenstring',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ContactService,
        provideMockStore({
          initialState: { fecfile_online_userLoginData: userLoginData },
          selectors: [{ selector: selectUserLoginData, value: userLoginData }],
        }),
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ContactService);
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
        Contact.fromJSON({
          id: 'C00000001',
        }),
        Contact.fromJSON({
          id: 'C00000002',
        }),
      ],
    };

    service.getTableData().subscribe((response: ListRestResponse) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/contacts/?page=1`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
    httpTestingController.verify();
  });

  it('#create() should POST a payload', () => {
    const mockResponse: Contact = new Contact();
    const contact: Contact = mockResponse;

    service.create(contact).subscribe((response: Contact) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/contacts/`);
    expect(req.request.method).toEqual('POST');
    req.flush(mockResponse);
    httpTestingController.verify();
  });

  it('#update() should PUT a payload', () => {
    const mockResponse: Contact = new Contact();
    const contact: Contact = mockResponse;
    contact.id = 1;

    service.update(contact).subscribe((response: Contact) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/contacts/${contact.id}/`);
    expect(req.request.method).toEqual('PUT');
    req.flush(mockResponse);
    httpTestingController.verify();
  });

  it('#delete() should DELETE a record', () => {
    const mockResponse: null = null;
    const contact: Contact = new Contact();
    contact.id = 1;

    service.delete(contact).subscribe((response: null) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/contacts/1`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(mockResponse);
    httpTestingController.verify();
  });
});
