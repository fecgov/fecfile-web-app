import type { Mock } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { EventEmitter, provideZoneChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
import { AutoCompleteCompleteEvent, AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { LabelPipe } from '../../pipes/label.pipe';
import { ContactLookupComponent } from './contact-lookup.component';

const queryEvent = { query: 'hi' } as AutoCompleteCompleteEvent;
const emptyQueryEvent = { query: '' } as AutoCompleteCompleteEvent;

describe('ContactLookupComponent', () => {
  let component: ContactLookupComponent;
  let fixture: ComponentFixture<ContactLookupComponent>;

  let contactService: ContactService;

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
        provideZoneChangeDetection(),
        FormBuilder,
        ContactService,
        EventEmitter,
        provideMockStore(testMockStore()),
        LabelPipe,
      ],
    }).compileComponents();

    contactService = TestBed.inject(ContactService);
    fixture = TestBed.createComponent(ContactLookupComponent);
    component = fixture.componentInstance;
    component.contactTypeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.INDIVIDUAL]);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('#ngOnInit', () => {
    component.candidateOffice = CandidateOfficeTypes.PRESIDENTIAL;
    fixture.detectChanges();
    component.contactTypeFormControl.setValue(ContactTypes.CANDIDATE);
    expect(component.contactTypeFormControl.value).toEqual(ContactTypes.CANDIDATE);
  });

  it('#onDropdownSearch empty search', async () => {
    fixture.detectChanges();
    await component.onDropdownSearch(emptyQueryEvent);
    fixture.detectChanges();
    expect(component.contactLookupList.length === 0).toBe(true);
  });

  describe('onDropdownSearch', () => {
    describe('candidate search', () => {
      let testCandidateLookupResponse: CandidateLookupResponse;
      beforeEach(() => {
        fixture.detectChanges();
        testCandidateLookupResponse = new CandidateLookupResponse();
      });

      it('#onDropdownSearch CAN undefined fec_api_candidates', async () => {
        testCandidateLookupResponse.fecfile_candidates = [
          {
            id: 123,
            first_name: 'testFirstName',
            last_na2me: 'testLastName',
          } as unknown as FecfileCandidateLookupData,
        ];
        vi.spyOn(contactService, 'candidateLookup').mockReturnValue(Promise.resolve(testCandidateLookupResponse));

        component.contactTypeFormControl.setValue(ContactTypes.CANDIDATE);
        await component.onDropdownSearch(queryEvent);
        fixture.detectChanges();
        expect(component.contactLookupList[1].items.length === 0).toBe(true);
      });

      it('#onDropdownSearch CAN undefined fecfile_candidates', async () => {
        vi.spyOn(contactService, 'candidateLookup').mockReturnValue(Promise.resolve(testCandidateLookupResponse));
        component.contactTypeFormControl.setValue(ContactTypes.CANDIDATE);
        await component.onDropdownSearch(queryEvent);
        fixture.detectChanges();
        expect(component.contactLookupList[0].items.length === 0).toBe(true);
      });

      it('#onDropdownSearch CAN happy path', async () => {
        testCandidateLookupResponse.fecfile_candidates = [
          new FecfileCandidateLookupData({
            id: 123,
            last_name: 'testLastName',
            first_name: 'testFirstName',
            type: ContactTypes.CANDIDATE,
          } as unknown as FecfileCandidateLookupData),
        ];
        vi.spyOn(contactService, 'candidateLookup').mockReturnValue(Promise.resolve(testCandidateLookupResponse));
        component.contactTypeFormControl.setValue(ContactTypes.CANDIDATE);
        await component.onDropdownSearch(queryEvent);
        fixture.detectChanges();
        expect(
          JSON.stringify(component.contactLookupList) ===
            JSON.stringify(testCandidateLookupResponse.toSelectItemGroups(true, 'hi')),
        ).toBe(true);
        expect(
          JSON.stringify([
            { label: 'There are no matching candidate contacts', items: [] },
            { label: 'There are no matching registered candidates', items: [] },
          ]) === JSON.stringify(new CandidateLookupResponse().toSelectItemGroups(true, 'hi')),
        ).toBe(true);
      });
    });

    describe('committee search', () => {
      let testCommitteeLookupResponse: CommitteeLookupResponse;
      beforeEach(() => {
        fixture.detectChanges();
        testCommitteeLookupResponse = new CommitteeLookupResponse();
      });

      it('#onDropdownSearch COM undefined fec_api_committees', async () => {
        testCommitteeLookupResponse.fecfile_committees = [
          {
            id: 'testId',
            name: 'testName',
          } as unknown as FecfileCommitteeLookupData,
        ];
        vi.spyOn(contactService, 'committeeLookup').mockReturnValue(Promise.resolve(testCommitteeLookupResponse));
        component.contactTypeFormControl.setValue(ContactTypes.COMMITTEE);
        await component.onDropdownSearch(queryEvent);
        expect(component.contactLookupList[1].items.length === 0).toBe(true);
      });

      it('#onDropdownSearch COM undefined fecfile_committees', async () => {
        testCommitteeLookupResponse.fec_api_committees = [
          {
            id: 'testId',
            name: 'testName',
            is_active: true,
          } as FecApiCommitteeLookupData,
        ];
        vi.spyOn(contactService, 'committeeLookup').mockReturnValue(Promise.resolve(testCommitteeLookupResponse));
        component.contactTypeFormControl.setValue(ContactTypes.COMMITTEE);
        await component.onDropdownSearch(queryEvent);
        expect(component.contactLookupList[0].items.length === 0).toBe(true);
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
            id: 'testId',
            name: 'testName',
          } as unknown as FecfileCommitteeLookupData,
        ];
        vi.spyOn(contactService, 'committeeLookup').mockReturnValue(Promise.resolve(testCommitteeLookupResponse));
        component.contactTypeFormControl.setValue(ContactTypes.COMMITTEE);
        await component.onDropdownSearch(queryEvent);
        expect(
          JSON.stringify(component.contactLookupList) ===
            JSON.stringify(testCommitteeLookupResponse.toSelectItemGroups(true, 'hi')),
        ).toBe(true);
        expect(
          JSON.stringify([
            { label: 'There are no matching committee contacts', items: [] },
            { label: 'There are no matching registered committees', items: [] },
          ]) === JSON.stringify(new CommitteeLookupResponse().toSelectItemGroups(true, 'hi')),
        ).toBe(true);
      });
    });

    describe('individual search', () => {
      let testIndividualLookupResponse: IndividualLookupResponse;
      beforeEach(() => {
        fixture.detectChanges();
        testIndividualLookupResponse = new IndividualLookupResponse();
      });

      it('#onDropdownSearch IND undefined fecfile_individuals', async () => {
        vi.spyOn(contactService, 'individualLookup').mockReturnValue(Promise.resolve(testIndividualLookupResponse));
        component.contactTypeFormControl.setValue(ContactTypes.INDIVIDUAL);
        await component.onDropdownSearch(queryEvent);
        fixture.detectChanges();
        expect(component.contactLookupList[0].items.length === 0).toBe(true);
      });

      it('#onDropdownSearch IND happy path', async () => {
        testIndividualLookupResponse.fecfile_individuals = [
          new FecfileIndividualLookupData({
            id: 123,
            last_name: 'testLastName',
            first_name: 'testFirstName',
            type: ContactTypes.INDIVIDUAL,
          } as unknown as FecfileIndividualLookupData),
        ];
        vi.spyOn(contactService, 'individualLookup').mockReturnValue(Promise.resolve(testIndividualLookupResponse));
        component.contactTypeFormControl.setValue(ContactTypes.INDIVIDUAL);
        await component.onDropdownSearch(queryEvent);
        fixture.detectChanges();
        expect(
          JSON.stringify(component.contactLookupList) ===
            JSON.stringify(testIndividualLookupResponse.toSelectItemGroups('hi')),
        ).toBe(true);
        expect(
          JSON.stringify([
            {
              label: 'There are no matching individuals',
              items: [],
            },
          ]) === JSON.stringify(new IndividualLookupResponse().toSelectItemGroups('hi')),
        ).toBe(true);
      });
    });

    describe('organization search', () => {
      let testOrganizationLookupResponse: OrganizationLookupResponse;
      beforeEach(() => {
        fixture.detectChanges();
        testOrganizationLookupResponse = new OrganizationLookupResponse();
      });

      it('#onDropdownSearch ORG undefined fecfile_organizations', async () => {
        vi.spyOn(contactService, 'organizationLookup').mockResolvedValue(testOrganizationLookupResponse);
        component.contactTypeFormControl.setValue(ContactTypes.ORGANIZATION);
        await component.onDropdownSearch(queryEvent);
        fixture.detectChanges();
        expect(component.contactLookupList[0].items.length === 0).toBe(true);
      });

      it('#onDropdownSearch ORG happy path', async () => {
        testOrganizationLookupResponse.fecfile_organizations = [
          new FecfileOrganizationLookupData({
            id: 123,
            name: 'testOrgName',
            type: ContactTypes.ORGANIZATION,
          } as unknown as FecfileOrganizationLookupData),
        ];
        vi.spyOn(contactService, 'organizationLookup').mockResolvedValue(testOrganizationLookupResponse);
        component.contactTypeFormControl.setValue(ContactTypes.ORGANIZATION);
        await component.onDropdownSearch(queryEvent);
        fixture.detectChanges();
        expect(
          JSON.stringify(component.contactLookupList) ===
            JSON.stringify(testOrganizationLookupResponse.toSelectItemGroups('hi')),
        ).toBe(true);
        expect(
          JSON.stringify([
            {
              label: 'There are no matching organizations',
              items: [],
            },
          ]) === JSON.stringify(new OrganizationLookupResponse().toSelectItemGroups('hi')),
        ).toBe(true);
      });
    });
  });

  it('#onContactSelect Contact happy path', () => {
    fixture.detectChanges();
    const eventEmitterEmitSpy = vi.spyOn(component.contactLookupSelect, 'emit');
    const testContact = Contact.fromJSON({
      id: 123,
      last_name: 'testLastName',
      first_name: 'testFirstName',
      type: ContactTypes.COMMITTEE,
    });
    component.onContactSelect(testContact);
    fixture.detectChanges();
    expect(eventEmitterEmitSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitterEmitSpy).toHaveBeenCalledWith(testContact);
  });

  describe('onFecApiCandidateLookupDataSelect', () => {
    let eventEmitterEmitSpy: Mock;
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
      eventEmitterEmitSpy = vi.spyOn(component.contactLookupSelect, 'emit');
      fixture.detectChanges();
    });

    async function testCandidate(candidate: Candidate) {
      const nameSplit = candidate.name?.split(', ');
      const contact = Contact.fromJSON({
        type: ContactTypes.CANDIDATE,
        candidate_id: candidate.candidate_id,
        last_name:
          candidate.candidate_first_name && candidate.candidate_last_name
            ? candidate.candidate_last_name
            : nameSplit?.[0],
        first_name:
          candidate.candidate_first_name && candidate.candidate_last_name
            ? candidate.candidate_first_name
            : nameSplit?.[1],
        middle_name: candidate.candidate_middle_name,
        prefix: candidate.candidate_prefix,
        suffix: candidate.candidate_suffix,
        street_1: candidate.address_street_1,
        street_2: candidate.address_street_2,
        city: candidate.address_city,
        state: candidate.address_state,
        zip: candidate.address_zip,
        employer: '',
        occupation: '',
        candidate_office: candidate.office,
        candidate_state: candidate.state === 'US' ? '' : candidate.state,
        candidate_district: candidate.state === 'US' || candidate.office === 'S' ? '' : candidate.district,
      });
      vi.spyOn(contactService, 'create').mockResolvedValue(contact);
      const getCandidateDetailsSpy = vi
        .spyOn(component.contactService, 'getCandidateDetails')
        .mockResolvedValue(candidate);

      await component.onContactLookupSelect({ value: testFecApiCandidateLookupData } as AutoCompleteSelectEvent);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(getCandidateDetailsSpy).toHaveBeenCalledTimes(1);
      expect(getCandidateDetailsSpy).toHaveBeenCalledWith(testFecApiCandidateLookupData.candidate_id!);
    }

    it('should work with candidate name only', async () => {
      await testCandidate(
        Candidate.fromJSON({
          candidate_id: 'P80000722',
          name: 'BIDEN, JOSEPH R JR',
        }),
      );

      expect(eventEmitterEmitSpy).toHaveBeenCalledTimes(1);

      expect(eventEmitterEmitSpy).toHaveBeenCalledWith(
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
    });

    it('should work with candidate last_name and first_name', async () => {
      await testCandidate(Candidate.fromJSON(baseCandidate));

      expect(eventEmitterEmitSpy).toHaveBeenCalledTimes(1);

      expect(eventEmitterEmitSpy).toHaveBeenCalledWith(
        Contact.fromJSON({
          ...baseContact,
          candidate_office: undefined,
          candidate_state: undefined,
          candidate_district: undefined,
        }),
      );
    });

    it('should populate house district if state is not US', async () => {
      await testCandidate(
        Candidate.fromJSON(
          Candidate.fromJSON({
            ...baseCandidate,
            office: 'H',
            state: 'WY',
            district: '00',
          }),
        ),
      );

      expect(eventEmitterEmitSpy).toHaveBeenCalledTimes(1);

      expect(eventEmitterEmitSpy).toHaveBeenCalledWith(
        Contact.fromJSON({
          ...baseContact,
          candidate_office: 'H',
          candidate_state: 'WY',
          candidate_district: '00',
        }),
      );
    });

    it('should not populate state or district if state is US', async () => {
      await testCandidate(
        Candidate.fromJSON(
          Candidate.fromJSON({
            ...baseCandidate,
            office: 'H',
            state: 'US',
            district: '00',
          }),
        ),
      );

      expect(eventEmitterEmitSpy).toHaveBeenCalledTimes(1);

      expect(eventEmitterEmitSpy).toHaveBeenCalledWith(
        Contact.fromJSON({
          ...baseContact,
          candidate_office: 'H',
          candidate_state: '',
          candidate_district: '',
        }),
      );
    });

    it('should not populate district if Senate', async () => {
      await testCandidate(
        Candidate.fromJSON(
          Candidate.fromJSON({
            ...baseCandidate,
            office: 'S',
            state: 'AZ',
            district: '00',
          }),
        ),
      );

      expect(eventEmitterEmitSpy).toHaveBeenCalledTimes(1);

      expect(eventEmitterEmitSpy).toHaveBeenCalledWith(
        Contact.fromJSON({
          ...baseContact,
          candidate_office: 'S',
          candidate_state: 'AZ',
          candidate_district: '',
        }),
      );
    });
  });

  it('#onCreateNewContactSelect Contact happy path', () => {
    const eventEmitterEmitSpy = vi.spyOn(component.createNewContactSelect, 'emit');
    fixture.detectChanges();
    component.onCreateNewContactSelect();
    fixture.detectChanges();
    expect(eventEmitterEmitSpy).toHaveBeenCalled();
  });

  it('#isContact happy path', () => {
    const expectedRetval = true;
    const retval = component.isContact(new Contact());

    expect(retval).toEqual(expectedRetval);
  });

  it('#onContactLookupSelect should call proper lookup', () => {
    vi.spyOn(component, 'onContactSelect');
    const contact = testContact();
    component.onContactLookupSelect({ value: contact } as AutoCompleteSelectEvent);
    expect(component.onContactSelect).toHaveBeenCalledWith(contact);
  });
});
