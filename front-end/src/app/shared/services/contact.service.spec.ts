import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { JsonSchema } from '../interfaces/json-schema.interface';
import { CommitteeLookupResponse, Contact, ContactTypes, IndividualLookupResponse, OrganizationLookupResponse } from '../models/contact.model';
import { ListRestResponse } from '../models/rest-api.model';
import { testMockStore } from '../utils/unit-test.utils';
import { ApiService } from './api.service';
import { ContactService } from './contact.service';

describe('ContactService', () => {
  let httpTestingController: HttpTestingController;
  let service: ContactService;
  let testApiService: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContactService, ApiService, provideMockStore(testMockStore)],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ContactService);
    testApiService = TestBed.inject(ApiService);
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

    const req = httpTestingController.expectOne(`${environment.apiUrl}/contacts/?page=1&ordering=name`);
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
    contact.id = '1';

    service.update(contact).subscribe((response: Contact) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/contacts/${contact.id}/`);
    expect(req.request.method).toEqual('PUT');
    req.flush(mockResponse);
    httpTestingController.verify();
  });

  it('#delete() should DELETE a record', () => {
    const mockResponse = null;
    const contact: Contact = new Contact();
    contact.id = '1';

    service.delete(contact).subscribe((response: null) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/contacts/1`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(mockResponse);
    httpTestingController.verify();
  });

  it('#committeeLookup() happy path', () => {
    const expectedRetval = new CommitteeLookupResponse();
    const apiServiceGetSpy = spyOn(testApiService, 'get').and.returnValue(of(expectedRetval));
    const testSearch = 'testSearch';
    const testMaxFecResults = 1;
    const testMaxFecfileResults = 2;

    const expectedEndpoint = '/contacts/committee_lookup/';
    const expectedParams = {
      q: testSearch,
      max_fec_results: testMaxFecResults,
      max_fecfile_results: testMaxFecfileResults
    }

    service
      .committeeLookup(testSearch, testMaxFecResults, testMaxFecfileResults)
      .subscribe((value) => expect(value).toEqual(expectedRetval));
    expect(apiServiceGetSpy).toHaveBeenCalledOnceWith(expectedEndpoint, expectedParams);
  });

  it('#individualLookup() happy path', () => {
    const expectedRetval = new IndividualLookupResponse();
    const apiServiceGetSpy = spyOn(testApiService, 'get').and.returnValue(of(expectedRetval));
    const testSearch = 'testSearch';
    const testMaxFecfileResults = 2;

    const expectedEndpoint = '/contacts/individual_lookup/';
    const expectedParams = {
      q: testSearch,
      max_fecfile_results: testMaxFecfileResults
    }

    service
      .individualLookup(testSearch, testMaxFecfileResults)
      .subscribe((value) => expect(value).toEqual(expectedRetval));
    expect(apiServiceGetSpy).toHaveBeenCalledOnceWith(expectedEndpoint, expectedParams);
  });

  it('#organizationLookup() happy path', () => {
    const expectedRetval = new OrganizationLookupResponse();
    const apiServiceGetSpy = spyOn(testApiService, 'get').and.returnValue(of(expectedRetval));
    const testSearch = 'testSearch';
    const testMaxFecfileResults = 2;

    const expectedEndpoint = '/contacts/organization_lookup/';
    const expectedParams = {
      q: testSearch,
      max_fecfile_results: testMaxFecfileResults
    }

    service
      .organizationLookup(testSearch, testMaxFecfileResults)
      .subscribe((value) => expect(value).toEqual(expectedRetval));
    expect(apiServiceGetSpy).toHaveBeenCalledOnceWith(expectedEndpoint, expectedParams);
  });

  it('#getSchemaByType should return the correct schema', () => {
    let schema: JsonSchema = service.getSchemaByType(ContactTypes.COMMITTEE);
    expect(schema.$id).toBe('https://github.com/fecgov/fecfile-validate/blob/main/schema/Contact_Committee.json');

    schema = service.getSchemaByType(ContactTypes.ORGANIZATION);
    expect(schema.$id).toBe('https://github.com/fecgov/fecfile-validate/blob/main/schema/Contact_Organization.json');

    schema = service.getSchemaByType(ContactTypes.CANDIDATE);
    expect(schema.$id).toBe('https://github.com/fecgov/fecfile-validate/blob/main/schema/Contact_Candidate.json');
  });

});
