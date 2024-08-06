import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { JsonSchema } from '../interfaces/json-schema.interface';
import {
  CandidateLookupResponse,
  CommitteeLookupResponse,
  Contact,
  ContactTypes,
  IndividualLookupResponse,
  OrganizationLookupResponse,
} from '../models/contact.model';
import { ListRestResponse } from '../models/rest-api.model';
import { testMockStore } from '../utils/unit-test.utils';
import { ApiService } from './api.service';
import { ContactService, DeletedContactService } from './contact.service';
import { CommitteeAccount } from '../models/committee-account.model';
import { FecApiPaginatedResponse } from '../models/fec-api.model';
import { Candidate } from '../models/candidate.model';

describe('ContactService', () => {
  let httpTestingController: HttpTestingController;
  let service: ContactService;
  let deletedService: DeletedContactService;
  let testApiService: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContactService, DeletedContactService, ApiService, provideMockStore(testMockStore)],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ContactService);
    deletedService = TestBed.inject(DeletedContactService);
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
      pageNumber: 1,
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

  it('#candidateLookup() happy path', async () => {
    const expectedRetval = new CandidateLookupResponse();
    const apiServiceGetSpy = spyOn(testApiService, 'get').and.returnValue(of(expectedRetval) as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    const testSearch = 'testSearch';
    const testMaxFecResults = 1;
    const testMaxFecfileResults = 2;

    const expectedEndpoint = '/contacts/candidate_lookup/';
    const expectedParams = {
      q: testSearch,
      max_fec_results: testMaxFecResults,
      max_fecfile_results: testMaxFecfileResults,
      office: '',
      exclude_fec_ids: 'C000000001,C000000002',
      exclude_ids: '',
    };

    const value = await service.candidateLookup(
      testSearch,
      testMaxFecResults,
      testMaxFecfileResults,
      undefined,
      ['C000000001', 'C000000002'],
      [],
    );
    expect(value).toEqual(expectedRetval);
    expect(apiServiceGetSpy).toHaveBeenCalledOnceWith(expectedEndpoint, expectedParams);
  });

  it('#committeeLookup() happy path', () => {
    const expectedRetval = new CommitteeLookupResponse();
    const testSearch = 'testSearch';
    const testMaxFecResults = 1;
    const testMaxFecfileResults = 2;
    const apiServiceGetSpy = spyOn(testApiService, 'get')
      .withArgs('/contacts/committee_lookup/', {
        q: testSearch,
        max_fec_results: testMaxFecResults,
        max_fecfile_results: testMaxFecfileResults,
        exclude_fec_ids: '',
        exclude_ids: '',
      })
      .and.returnValue(of(expectedRetval) as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    const expectedEndpoint = '/contacts/committee_lookup/';
    const expectedParams = {
      q: testSearch,
      max_fec_results: testMaxFecResults,
      max_fecfile_results: testMaxFecfileResults,
      exclude_fec_ids: '',
      exclude_ids: '',
    };

    service
      .committeeLookup(testSearch, testMaxFecResults, testMaxFecfileResults, [], [])
      .subscribe((value) => expect(value).toEqual(expectedRetval));
    expect(apiServiceGetSpy).toHaveBeenCalledOnceWith(expectedEndpoint, expectedParams);
  });

  it('#individualLookup() happy path', () => {
    const expectedRetval = new IndividualLookupResponse();
    const apiServiceGetSpy = spyOn(testApiService, 'get').and.returnValue(of(expectedRetval) as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    const testSearch = 'testSearch';
    const testMaxFecfileResults = 2;

    const expectedEndpoint = '/contacts/individual_lookup/';
    const expectedParams = {
      q: testSearch,
      max_fecfile_results: testMaxFecfileResults,
      exclude_ids: '',
    };

    service
      .individualLookup(testSearch, testMaxFecfileResults, [])
      .subscribe((value) => expect(value).toEqual(expectedRetval));
    expect(apiServiceGetSpy).toHaveBeenCalledOnceWith(expectedEndpoint, expectedParams);
  });

  it('#organizationLookup() happy path', () => {
    const expectedRetval = new OrganizationLookupResponse();
    const apiServiceGetSpy = spyOn(testApiService, 'get').and.returnValue(of(expectedRetval) as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    const testSearch = 'testSearch';
    const testMaxFecfileResults = 2;

    const expectedEndpoint = '/contacts/organization_lookup/';
    const expectedParams = {
      q: testSearch,
      max_fecfile_results: testMaxFecfileResults,
      exclude_ids: '',
    };

    service
      .organizationLookup(testSearch, testMaxFecfileResults, [])
      .subscribe((value) => expect(value).toEqual(expectedRetval));
    expect(apiServiceGetSpy).toHaveBeenCalledOnceWith(expectedEndpoint, expectedParams);
  });

  it('#getSchemaByType should return the correct schema', () => {
    let schema: JsonSchema = ContactService.getSchemaByType(ContactTypes.COMMITTEE);
    expect(schema.$id).toBe('https://github.com/fecgov/fecfile-validate/blob/main/schema/Contact_Committee.json');

    schema = ContactService.getSchemaByType(ContactTypes.ORGANIZATION);
    expect(schema.$id).toBe('https://github.com/fecgov/fecfile-validate/blob/main/schema/Contact_Organization.json');

    schema = ContactService.getSchemaByType(ContactTypes.CANDIDATE);
    expect(schema.$id).toBe('https://github.com/fecgov/fecfile-validate/blob/main/schema/Contact_Candidate.json');
  });

  it('#deleted.getTableData() should return a list of contacts', () => {
    const mockResponse: ListRestResponse = {
      count: 2,
      next: 'https://next-page',
      previous: 'https://previous-page',
      pageNumber: 1,
      results: [
        Contact.fromJSON({
          id: 'C00000001',
        }),
        Contact.fromJSON({
          id: 'C00000002',
        }),
      ],
    };

    deletedService.getTableData().subscribe((response: ListRestResponse) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/contacts-deleted/?page=1&ordering=name`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
    httpTestingController.verify();
  });

  it('#restore() should POST a payload', () => {
    const mockResponse: string[] = ['1'];
    deletedService.restore([new Contact()]).subscribe((response: string[]) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/contacts-deleted/restore/`);
    expect(req.request.method).toEqual('POST');
    req.flush(mockResponse);
    httpTestingController.verify();
  });

  it('#checkFecIdForUniqueness should return true if contact matches', () => {
    const fecId = 'fecId';
    const contactId = 'contactId';
    spyOn(testApiService, 'get')
      .withArgs('/contacts/get_contact_id/', {
        fec_id: fecId,
      })
      .and.returnValue(of('contactId' as any)); // eslint-disable-line @typescript-eslint/no-explicit-any

    service.checkFecIdForUniqueness(fecId, contactId).subscribe((isUnique) => {
      expect(isUnique).toBeTrue();
    });
  });

  it('#checkFecIdForUniqueness should return false if server comes back with differnt contact id', () => {
    const fecId = 'fecId';
    const contactId = 'contactId';
    spyOn(testApiService, 'get')
      .withArgs('/contacts/get_contact_id/', {
        fec_id: fecId,
      })
      .and.returnValue(of('different id' as any)); // eslint-disable-line @typescript-eslint/no-explicit-any
    service.checkFecIdForUniqueness(fecId, contactId).subscribe((isUnique) => {
      expect(isUnique).toBeFalse();
    });
  });

  it('#checkFecIdForUniqueness should return true if server comes back no id', () => {
    const fecId = 'fecId';
    const contactId = 'contactId';
    spyOn(testApiService, 'get')
      .withArgs('/contacts/get_contact_id/', {
        fec_id: fecId,
      })
      .and.returnValue(of('' as any)); // eslint-disable-line @typescript-eslint/no-explicit-any
    service.checkFecIdForUniqueness(fecId, contactId).subscribe((isUnique) => {
      expect(isUnique).toBeTrue();
    });
  });

  describe('#getCandidateDetails()', () => {
    it('should return candidate details', () => {
      const candidate: Candidate = new Candidate();

      service.getCandidateDetails('P12345678').subscribe((candidateData) => {
        expect(candidateData).toEqual(candidate);
      });

      const req = httpTestingController.expectOne(
        'https://localhost/api/v1/contacts/candidate/?candidate_id=P12345678',
      );

      expect(req.request.method).toEqual('GET');
      req.flush(candidate);
    });
  });

  it('should return committee details', () => {
    const committeeAccount: CommitteeAccount = new CommitteeAccount();
    const response: FecApiPaginatedResponse = {
      api_version: '1.0',
      pagination: {
        page: 1,
        per_page: 20,
        count: 1,
        pages: 1,
      },
      results: [committeeAccount],
    };

    service.getCommitteeDetails('C00601211').subscribe((committeeAccountData) => {
      expect(committeeAccountData).toEqual(committeeAccount);
    });

    const req = httpTestingController.expectOne(`https://localhost/api/v1/openfec/committee/?committee_id=C00601211`);

    expect(req.request.method).toEqual('GET');
    req.flush(response);
  });
});
