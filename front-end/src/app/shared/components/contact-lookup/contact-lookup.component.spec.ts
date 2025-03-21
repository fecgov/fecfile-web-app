import { provideHttpClient } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { Candidate } from 'app/shared/models/candidate.model';
import {
  CandidateLookupResponse,
  CandidateOfficeTypes,
  CommitteeLookupResponse,
  Contact,
  ContactTypeLabels,
  ContactTypes,
  FecApiCandidateLookupData,
  FecApiCommitteeLookupData,
  FecfileCandidateLookupData,
  FecfileCommitteeLookupData,
  FecfileIndividualLookupData,
  FecfileOrganizationLookupData,
  IndividualLookupResponse,
  OrganizationLookupResponse,
} from 'app/shared/models/contact.model';
import { ContactService } from 'app/shared/services/contact.service';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { testContact, testMockStore } from 'app/shared/utils/unit-test.utils';
import { SelectItem } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { LabelPipe } from '../../pipes/label.pipe';
import { ContactLookupComponent } from './contact-lookup.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ContactLookupComponent', () => {
  let component: ContactLookupComponent;
  let fixture: ComponentFixture<ContactLookupComponent>;

  let testContactService: ContactService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        DialogModule,
        SelectModule,
        AutoCompleteModule,
        ContactLookupComponent,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        FormBuilder,
        ContactService,
        EventEmitter,
        provideMockStore(testMockStore),
        LabelPipe,
      ],
    }).compileComponents();

    testContactService = TestBed.inject(ContactService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactLookupComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit', () => {
    component.contactTypeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.INDIVIDUAL]);
    component.candidateOffice = CandidateOfficeTypes.PRESIDENTIAL;
    component.ngOnInit();
    component.contactTypeFormControl.setValue(ContactTypes.CANDIDATE);
    expect(component.contactTypeFormControl.value).toEqual(ContactTypes.CANDIDATE);
  });

  it('#onDropdownSearch empty search', fakeAsync(() => {
    const testEvent = { query: null };
    component.onDropdownSearch(testEvent);
    tick(500);
    expect(component.contactLookupList.length === 0).toBeTrue();
  }));

  describe('onDropdownSearch', () => {
    describe('candidate search', () => {
      let testCandidateLookupResponse: CandidateLookupResponse;
      beforeEach(() => {
        testCandidateLookupResponse = new CandidateLookupResponse();
      });

      it('#onDropdownSearch CAN undefined fec_api_candidates', fakeAsync(() => {
        testCandidateLookupResponse.fecfile_candidates = [
          {
            id: 123,
            first_name: 'testFirstName',
            last_na2me: 'testLastName',
          } as unknown as FecfileCandidateLookupData,
        ];
        spyOn(testContactService, 'candidateLookup').and.returnValue(Promise.resolve(testCandidateLookupResponse));
        const testEvent = { query: 'hi' };
        component.contactTypeFormControl.setValue(ContactTypes.CANDIDATE);
        component.onDropdownSearch(testEvent);
        tick(500);
        expect(component.contactLookupList[1].items.length === 0).toBeTrue();
      }));

      it('#onDropdownSearch CAN undefined fecfile_candidates', fakeAsync(() => {
        spyOn(testContactService, 'candidateLookup').and.returnValue(Promise.resolve(testCandidateLookupResponse));
        const testEvent = { query: 'hi' };
        component.contactTypeFormControl.setValue(ContactTypes.CANDIDATE);
        component.onDropdownSearch(testEvent);
        tick(500);
        expect(component.contactLookupList[0].items.length === 0).toBeTrue();
      }));

      it('#onDropdownSearch CAN happy path', fakeAsync(() => {
        testCandidateLookupResponse.fecfile_candidates = [
          new FecfileCandidateLookupData({
            id: 123,
            last_name: 'testLastName',
            first_name: 'testFirstName',
            type: ContactTypes.CANDIDATE,
          } as unknown as FecfileCandidateLookupData),
        ];
        spyOn(testContactService, 'candidateLookup').and.returnValue(Promise.resolve(testCandidateLookupResponse));
        const testEvent = { query: 'hi' };
        component.contactTypeFormControl.setValue(ContactTypes.CANDIDATE);
        component.onDropdownSearch(testEvent);
        tick(500);
        expect(
          JSON.stringify(component.contactLookupList) ===
            JSON.stringify(testCandidateLookupResponse.toSelectItemGroups(true)),
        ).toBeTrue();
        expect(
          JSON.stringify([
            { label: 'There are no matching candidate contacts', items: [] },
            { label: 'There are no matching registered candidates', items: [] },
          ]) === JSON.stringify(new CandidateLookupResponse().toSelectItemGroups(true)),
        ).toBeTrue();
      }));
    });

    describe('committee search', () => {
      let testCommitteeLookupResponse: CommitteeLookupResponse;
      beforeEach(() => {
        testCommitteeLookupResponse = new CommitteeLookupResponse();
      });

      it('#onDropdownSearch COM undefined fec_api_committees', async () => {
        testCommitteeLookupResponse.fecfile_committees = [
          {
            id: 123,
            name: 'testName',
          } as unknown as FecfileCommitteeLookupData,
        ];
        spyOn(testContactService, 'committeeLookup').and.returnValue(Promise.resolve(testCommitteeLookupResponse));
        const testEvent = { query: 'hi' };
        component.contactTypeFormControl.setValue(ContactTypes.COMMITTEE);
        await component.onDropdownSearch(testEvent);
        expect(component.contactLookupList[1].items.length === 0).toBeTrue();
      });

      it('#onDropdownSearch COM undefined fecfile_committees', async () => {
        testCommitteeLookupResponse.fec_api_committees = [
          {
            id: 'testId',
            name: 'testName',
            is_active: true,
          } as FecApiCommitteeLookupData,
        ];
        spyOn(testContactService, 'committeeLookup').and.returnValue(Promise.resolve(testCommitteeLookupResponse));
        const testEvent = { query: 'hi' };
        component.contactTypeFormControl.setValue(ContactTypes.COMMITTEE);
        await component.onDropdownSearch(testEvent);
        expect(component.contactLookupList[0].items.length === 0).toBeTrue();
      });

      it('#onDropdownSearch COM happy path', async () => {
        testCommitteeLookupResponse.fec_api_committees = [
          {
            id: 'testId',
            name: 'testName',
            is_active: true,
          } as FecApiCommitteeLookupData,
        ];
        testCommitteeLookupResponse.fecfile_committees = [
          {
            id: 123,
            name: 'testName',
          } as unknown as FecfileCommitteeLookupData,
        ];
        spyOn(testContactService, 'committeeLookup').and.returnValue(Promise.resolve(testCommitteeLookupResponse));
        const testEvent = { query: 'hi' };
        component.contactTypeFormControl.setValue(ContactTypes.COMMITTEE);
        await component.onDropdownSearch(testEvent);
        expect(
          JSON.stringify(component.contactLookupList) ===
            JSON.stringify(testCommitteeLookupResponse.toSelectItemGroups(true)),
        ).toBeTrue();
        expect(
          JSON.stringify([
            { label: 'There are no matching committee contacts', items: [] },
            { label: 'There are no matching registered committees', items: [] },
          ]) === JSON.stringify(new CommitteeLookupResponse().toSelectItemGroups(true)),
        ).toBeTrue();
      });
    });

    describe('individual search', () => {
      let testIndividualLookupResponse: IndividualLookupResponse;
      beforeEach(() => {
        testIndividualLookupResponse = new IndividualLookupResponse();
      });

      it('#onDropdownSearch IND undefined fecfile_individuals', fakeAsync(() => {
        spyOn(testContactService, 'individualLookup').and.returnValue(Promise.resolve(testIndividualLookupResponse));
        const testEvent = { query: 'hi' };
        component.contactTypeFormControl.setValue(ContactTypes.INDIVIDUAL);
        component.onDropdownSearch(testEvent);
        tick(500);
        expect(component.contactLookupList[0].items.length === 0).toBeTrue();
      }));

      it('#onDropdownSearch IND happy path', fakeAsync(() => {
        testIndividualLookupResponse.fecfile_individuals = [
          new FecfileIndividualLookupData({
            id: 123,
            last_name: 'testLastName',
            first_name: 'testFirstName',
            type: ContactTypes.INDIVIDUAL,
          } as unknown as FecfileIndividualLookupData),
        ];
        spyOn(testContactService, 'individualLookup').and.returnValue(Promise.resolve(testIndividualLookupResponse));
        const testEvent = { query: 'hi' };
        component.contactTypeFormControl.setValue(ContactTypes.INDIVIDUAL);
        component.onDropdownSearch(testEvent);
        tick(500);
        expect(
          JSON.stringify(component.contactLookupList) ===
            JSON.stringify(testIndividualLookupResponse.toSelectItemGroups()),
        ).toBeTrue();
        expect(
          JSON.stringify([
            {
              label: 'There are no matching individuals',
              items: [],
            },
          ]) === JSON.stringify(new IndividualLookupResponse().toSelectItemGroups()),
        ).toBeTrue();
      }));
    });

    describe('organization search', () => {
      let testOrganizationLookupResponse: OrganizationLookupResponse;
      beforeEach(() => {
        testOrganizationLookupResponse = new OrganizationLookupResponse();
      });

      it('#onDropdownSearch ORG undefined fecfile_organizations', fakeAsync(() => {
        spyOn(testContactService, 'organizationLookup').and.returnValue(
          Promise.resolve(testOrganizationLookupResponse),
        );
        const testEvent = { query: 'hi' };
        component.contactTypeFormControl.setValue(ContactTypes.ORGANIZATION);
        component.onDropdownSearch(testEvent);
        tick(500);
        expect(component.contactLookupList[0].items.length === 0).toBeTrue();
      }));

      it('#onDropdownSearch ORG happy path', fakeAsync(() => {
        testOrganizationLookupResponse.fecfile_organizations = [
          new FecfileOrganizationLookupData({
            id: 123,
            name: 'testOrgName',
            type: ContactTypes.ORGANIZATION,
          } as unknown as FecfileOrganizationLookupData),
        ];
        spyOn(testContactService, 'organizationLookup').and.returnValue(
          Promise.resolve(testOrganizationLookupResponse),
        );
        const testEvent = { query: 'hi' };
        component.contactTypeFormControl.setValue(ContactTypes.ORGANIZATION);
        component.onDropdownSearch(testEvent);
        tick(500);
        expect(
          JSON.stringify(component.contactLookupList) ===
            JSON.stringify(testOrganizationLookupResponse.toSelectItemGroups()),
        ).toBeTrue();
        expect(
          JSON.stringify([
            {
              label: 'There are no matching organizations',
              items: [],
            },
          ]) === JSON.stringify(new OrganizationLookupResponse().toSelectItemGroups()),
        ).toBeTrue();
      }));
    });
  });

  it('#onContactSelect Contact happy path', fakeAsync(() => {
    const eventEmitterEmitSpy = spyOn(component.contactLookupSelect, 'emit');
    const testContact = Contact.fromJSON({
      id: 123,
      last_name: 'testLastName',
      first_name: 'testFirstName',
      type: ContactTypes.COMMITTEE,
    });
    component.onContactSelect(testContact);
    tick(500);
    expect(eventEmitterEmitSpy).toHaveBeenCalledOnceWith(testContact);
  }));

  describe('onFecApiCandidateLookupDataSelect', () => {
    let eventEmitterEmitSpy: jasmine.Spy<(value?: Contact | undefined) => void>;
    const testFecApiCandidateLookupData: FecApiCandidateLookupData = {
      candidate_id: 'P80000722',
      office: 'P',
      name: 'BIDEN, JOSEPH R JR',
      toSelectItem(): SelectItem<FecApiCandidateLookupData> {
        return {
          label: `${this.name} (${this.candidate_id})`,
          value: this,
        };
      },
    };

    const baseCandidate = {
      candidate_id: 'P80000722',
      candidate_first_name: 'test_candidate_first_name',
      candidate_last_name: 'test_candidate_last_name',
      candidate_middle_name: 'test_candidate_middle_name',
      candidate_prefix: 'test_candidate_prefix',
      candidate_suffix: 'test_candidate_suffix',
    };

    const baseContact = {
      type: ContactTypes.CANDIDATE,
      candidate_id: 'P80000722',
      last_name: 'test_candidate_last_name',
      first_name: 'test_candidate_first_name',
      middle_name: 'test_candidate_middle_name',
      prefix: 'test_candidate_prefix',
      suffix: 'test_candidate_suffix',
      street_1: undefined,
      street_2: undefined,
      city: undefined,
      state: undefined,
      zip: undefined,
      employer: '',
      occupation: '',
    };

    beforeEach(() => {
      eventEmitterEmitSpy = spyOn(component.contactLookupSelect, 'emit');
    });

    async function testCandidate(candidate: Candidate) {
      const getCandidateDetailsSpy = spyOn(component.contactService, 'getCandidateDetails').and.returnValue(
        Promise.resolve(candidate),
      );

      component.onFecApiCandidateLookupDataSelect(testFecApiCandidateLookupData);
      tick(500);
      expect(getCandidateDetailsSpy).toHaveBeenCalledOnceWith(testFecApiCandidateLookupData.candidate_id!);
    }

    it('should work with candidate name only', fakeAsync(() => {
      testCandidate(
        Candidate.fromJSON({
          candidate_id: 'P80000722',
          name: 'BIDEN, JOSEPH R JR',
        }),
      );

      expect(eventEmitterEmitSpy).toHaveBeenCalledOnceWith(
        Contact.fromJSON({
          type: ContactTypes.CANDIDATE,
          candidate_id: 'P80000722',
          last_name: 'BIDEN',
          first_name: 'JOSEPH R JR',
          middle_name: undefined,
          prefix: undefined,
          suffix: undefined,
          street_1: undefined,
          street_2: undefined,
          city: undefined,
          state: undefined,
          zip: undefined,
          employer: '',
          occupation: '',
          candidate_office: undefined,
          candidate_state: undefined,
          candidate_district: undefined,
        }),
      );
    }));

    it('should work with candidate last_name and first_name', fakeAsync(() => {
      testCandidate(Candidate.fromJSON(baseCandidate));

      expect(eventEmitterEmitSpy).toHaveBeenCalledOnceWith(
        Contact.fromJSON({
          ...baseContact,
          candidate_office: undefined,
          candidate_state: undefined,
          candidate_district: undefined,
        }),
      );
    }));

    it('should populate house district if state is not US', fakeAsync(() => {
      testCandidate(
        Candidate.fromJSON(
          Candidate.fromJSON({
            ...baseCandidate,
            office: 'H',
            state: 'WY',
            district: '00',
          }),
        ),
      );

      expect(eventEmitterEmitSpy).toHaveBeenCalledOnceWith(
        Contact.fromJSON({
          ...baseContact,
          candidate_office: 'H',
          candidate_state: 'WY',
          candidate_district: '00',
        }),
      );
    }));

    it('should not populate state or district if state is US', fakeAsync(() => {
      testCandidate(
        Candidate.fromJSON(
          Candidate.fromJSON({
            ...baseCandidate,
            office: 'H',
            state: 'US',
            district: '00',
          }),
        ),
      );

      expect(eventEmitterEmitSpy).toHaveBeenCalledOnceWith(
        Contact.fromJSON({
          ...baseContact,
          candidate_office: 'H',
          candidate_state: '',
          candidate_district: '',
        }),
      );
    }));

    it('should not populate district if Senate', fakeAsync(() => {
      testCandidate(
        Candidate.fromJSON(
          Candidate.fromJSON({
            ...baseCandidate,
            office: 'S',
            state: 'AZ',
            district: '00',
          }),
        ),
      );

      expect(eventEmitterEmitSpy).toHaveBeenCalledOnceWith(
        Contact.fromJSON({
          ...baseContact,
          candidate_office: 'S',
          candidate_state: 'AZ',
          candidate_district: '',
        }),
      );
    }));
  });

  it('#onCreateNewContactSelect Contact happy path', fakeAsync(() => {
    const eventEmitterEmitSpy = spyOn(component.createNewContactSelect, 'emit');
    component.onCreateNewContactSelect();
    tick(500);
    expect(eventEmitterEmitSpy).toHaveBeenCalled();
  }));

  it('#isContact happy path', () => {
    const expectedRetval = true;
    const retval = component.isContact(new Contact());

    expect(retval).toEqual(expectedRetval);
  });

  it('#onContactLookupSelect should call proper lookup', fakeAsync(() => {
    spyOn(component, 'onContactSelect');
    component.onContactLookupSelect({ value: testContact });
    expect(component.onContactSelect).toHaveBeenCalledWith(testContact);
  }));
});
