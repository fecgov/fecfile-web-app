import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EventEmitter } from '@angular/core';
import { of } from 'rxjs';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { SharedModule } from 'app/shared/shared.module';
import { ContactService } from 'app/shared/services/contact.service';
import { testContact, testMockStore } from 'app/shared/utils/unit-test.utils';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DialogModule } from 'primeng/dialog';
import { ContactLookupComponent } from './contact-lookup.component';
import { LabelPipe } from '../../pipes/label.pipe';
import { LabelUtils } from 'app/shared/utils/label.utils';
import {
  CandidateLookupResponse,
  CandidateOfficeTypes,
  CommitteeLookupResponse,
  Contact,
  ContactTypeLabels,
  ContactTypes,
  FecApiCommitteeLookupData,
  FecfileCandidateLookupData,
  FecfileCommitteeLookupData,
  FecfileIndividualLookupData,
  FecfileOrganizationLookupData,
  IndividualLookupResponse,
  OrganizationLookupResponse,
} from 'app/shared/models/contact.model';

describe('ContactLookupComponent', () => {
  let component: ContactLookupComponent;
  let fixture: ComponentFixture<ContactLookupComponent>;

  let testContactService: ContactService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactLookupComponent, LabelPipe],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        DialogModule,
        HttpClientTestingModule,
        DropdownModule,
        AutoCompleteModule,
        SharedModule,
      ],
      providers: [FormBuilder, ContactService, EventEmitter, provideMockStore(testMockStore)],
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

  it('#onDropdownSearch CAN undefined fec_api_candidates', fakeAsync(() => {
    const testCandidateLookupResponse = new CandidateLookupResponse();
    testCandidateLookupResponse.fecfile_candidates = [
      {
        id: 123,
        first_name: 'testFirstName',
        last_na2me: 'testLastName',
      } as unknown as FecfileCandidateLookupData,
    ];
    spyOn(testContactService, 'candidateLookup').and.returnValue(of(testCandidateLookupResponse));
    const testEvent = { query: 'hi' };
    component.contactTypeFormControl.setValue('CAN');
    component.onDropdownSearch(testEvent);
    expect(component.contactLookupList[1].items.length === 0).toBeTrue();
  }));

  it('#onDropdownSearch CAN undefined fecfile_candidates', fakeAsync(() => {
    const testCandidateLookupResponse = new CandidateLookupResponse();
    spyOn(testContactService, 'candidateLookup').and.returnValue(of(testCandidateLookupResponse));
    const testEvent = { query: 'hi' };
    component.contactTypeFormControl.setValue('CAN');
    component.onDropdownSearch(testEvent);
    tick(500);
    expect(component.contactLookupList[0].items.length === 0).toBeTrue();
  }));

  it('#onDropdownSearch CAN happy path', fakeAsync(() => {
    const testCandidateLookupResponse = new CandidateLookupResponse();
    testCandidateLookupResponse.fecfile_candidates = [
      new FecfileCandidateLookupData({
        id: 123,
        last_name: 'testLastName',
        first_name: 'testFirstName',
        type: ContactTypes.CANDIDATE,
      } as unknown as FecfileCandidateLookupData),
    ];
    spyOn(testContactService, 'candidateLookup').and.returnValue(of(testCandidateLookupResponse));
    const testEvent = { query: 'hi' };
    component.contactTypeFormControl.setValue('CAN');
    component.onDropdownSearch(testEvent);
    tick(500);
    expect(
      JSON.stringify(component.contactLookupList) ===
        JSON.stringify(testCandidateLookupResponse.toSelectItemGroups(true))
    ).toBeTrue();
    expect(
      JSON.stringify([
        { label: 'There are no matching candidates', items: [] },
        { label: 'There are no matching registered candidates', items: [] },
      ]) === JSON.stringify(new CandidateLookupResponse().toSelectItemGroups(true))
    ).toBeTrue();
  }));

  it('#onDropdownSearch COM undefined fec_api_committees', fakeAsync(() => {
    const testCommitteeLookupResponse = new CommitteeLookupResponse();
    testCommitteeLookupResponse.fecfile_committees = [
      {
        id: 123,
        name: 'testName',
      } as unknown as FecfileCommitteeLookupData,
    ];
    spyOn(testContactService, 'committeeLookup').and.returnValue(of(testCommitteeLookupResponse));
    const testEvent = { query: 'hi' };
    component.contactTypeFormControl.setValue('COM');
    component.onDropdownSearch(testEvent);
    expect(component.contactLookupList[1].items.length === 0).toBeTrue();
  }));

  it('#onDropdownSearch COM undefined fecfile_committees', fakeAsync(() => {
    const testCommitteeLookupResponse = new CommitteeLookupResponse();
    testCommitteeLookupResponse.fec_api_committees = [
      {
        id: 'testId',
        name: 'testName',
        is_active: true,
      } as FecApiCommitteeLookupData,
    ];
    spyOn(testContactService, 'committeeLookup').and.returnValue(of(testCommitteeLookupResponse));
    const testEvent = { query: 'hi' };
    component.contactTypeFormControl.setValue('COM');
    component.onDropdownSearch(testEvent);
    expect(component.contactLookupList[0].items.length === 0).toBeTrue();
  }));

  it('#onDropdownSearch COM happy path', fakeAsync(() => {
    const testCommitteeLookupResponse = new CommitteeLookupResponse();
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
    spyOn(testContactService, 'committeeLookup').and.returnValue(of(testCommitteeLookupResponse));
    const testEvent = { query: 'hi' };
    component.contactTypeFormControl.setValue('COM');
    component.onDropdownSearch(testEvent);
    expect(
      JSON.stringify(component.contactLookupList) ===
        JSON.stringify(testCommitteeLookupResponse.toSelectItemGroups(true))
    ).toBeTrue();
    expect(
      JSON.stringify([
        { label: 'There are no matching committees', items: [] },
        { label: 'There are no matching registered committees', items: [] },
      ]) === JSON.stringify(new CommitteeLookupResponse().toSelectItemGroups(true))
    ).toBeTrue();
  }));

  it('#onDropdownSearch IND undefined fecfile_individuals', fakeAsync(() => {
    const testIndividualLookupResponse = new IndividualLookupResponse();
    spyOn(testContactService, 'individualLookup').and.returnValue(of(testIndividualLookupResponse));
    const testEvent = { query: 'hi' };
    component.contactTypeFormControl.setValue('IND');
    component.onDropdownSearch(testEvent);
    tick(500);
    expect(component.contactLookupList[0].items.length === 0).toBeTrue();
  }));

  it('#onDropdownSearch IND happy path', fakeAsync(() => {
    const testIndividualLookupResponse = new IndividualLookupResponse();
    testIndividualLookupResponse.fecfile_individuals = [
      new FecfileIndividualLookupData({
        id: 123,
        last_name: 'testLastName',
        first_name: 'testFirstName',
        type: ContactTypes.INDIVIDUAL,
      } as unknown as FecfileIndividualLookupData),
    ];
    spyOn(testContactService, 'individualLookup').and.returnValue(of(testIndividualLookupResponse));
    const testEvent = { query: 'hi' };
    component.contactTypeFormControl.setValue('IND');
    component.onDropdownSearch(testEvent);
    tick(500);
    expect(
      JSON.stringify(component.contactLookupList) === JSON.stringify(testIndividualLookupResponse.toSelectItemGroups())
    ).toBeTrue();
    expect(
      JSON.stringify([
        {
          label: 'There are no matching individuals',
          items: [],
        },
      ]) === JSON.stringify(new IndividualLookupResponse().toSelectItemGroups())
    ).toBeTrue();
  }));

  it('#onDropdownSearch ORG undefined fecfile_organizations', fakeAsync(() => {
    const testOrganizationLookupResponse = new OrganizationLookupResponse();
    spyOn(testContactService, 'organizationLookup').and.returnValue(of(testOrganizationLookupResponse));
    const testEvent = { query: 'hi' };
    component.contactTypeFormControl.setValue('ORG');
    component.onDropdownSearch(testEvent);
    tick(500);
    expect(component.contactLookupList[0].items.length === 0).toBeTrue();
  }));

  it('#onDropdownSearch ORG happy path', fakeAsync(() => {
    const testOrganizationLookupResponse = new OrganizationLookupResponse();
    testOrganizationLookupResponse.fecfile_organizations = [
      new FecfileOrganizationLookupData({
        id: 123,
        name: 'testOrgName',
        type: ContactTypes.ORGANIZATION,
      } as unknown as FecfileOrganizationLookupData),
    ];
    spyOn(testContactService, 'organizationLookup').and.returnValue(of(testOrganizationLookupResponse));
    const testEvent = { query: 'hi' };
    component.contactTypeFormControl.setValue('ORG');
    component.onDropdownSearch(testEvent);
    tick(500);
    expect(
      JSON.stringify(component.contactLookupList) ===
        JSON.stringify(testOrganizationLookupResponse.toSelectItemGroups())
    ).toBeTrue();
    expect(
      JSON.stringify([
        {
          label: 'There are no matching organizations',
          items: [],
        },
      ]) === JSON.stringify(new OrganizationLookupResponse().toSelectItemGroups())
    ).toBeTrue();
  }));

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
