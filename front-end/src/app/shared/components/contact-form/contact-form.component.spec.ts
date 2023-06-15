import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { Candidate } from 'app/shared/models/candidate.model';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import {
  CandidateOfficeTypes,
  Contact,
  ContactTypes,
  FecApiCandidateLookupData,
  FecApiCommitteeLookupData,
} from 'app/shared/models/contact.model';
import { FecApiService } from 'app/shared/services/fec-api.service';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { DropdownModule } from 'primeng/dropdown';
import { of } from 'rxjs';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';
import { FecInternationalPhoneInputComponent } from '../fec-international-phone-input/fec-international-phone-input.component';
import { ContactFormComponent } from './contact-form.component';
import { ContactLookupComponent } from '../contact-lookup/contact-lookup.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ContactService } from 'app/shared/services/contact.service';

describe('ContactFormComponent', () => {
  let component: ContactFormComponent;
  let fixture: ComponentFixture<ContactFormComponent>;
  let testFecApiService: FecApiService;
  let testContactService: ContactService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, ReactiveFormsModule, DropdownModule, AutoCompleteModule],
      declarations: [
        ContactFormComponent,
        ErrorMessagesComponent,
        FecInternationalPhoneInputComponent,
        ContactLookupComponent,
        ContactService,
      ],
      providers: [FormBuilder, provideMockStore(testMockStore)],
    }).compileComponents();
    testFecApiService = TestBed.inject(FecApiService);
    testContactService = TestBed.inject(ContactService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactFormComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#CandidateOfficeTypes getter should return the list of office types', () => {
    const officeTypes = component.CandidateOfficeTypes;
    expect(officeTypes.HOUSE).toBe('H');
    expect(officeTypes.SENATE).toBe('S');
    expect(officeTypes.PRESIDENTIAL).toBe('P');
  });

  it('changing candidate office should set district and state options', () => {
    component.form.get('type')?.setValue(ContactTypes.CANDIDATE);
    component.form.get('candidate_office')?.setValue(CandidateOfficeTypes.HOUSE);
    component.form.get('candidate_state')?.setValue('VA');
    component.form.get('candidate_district')?.setValue('01');
    expect(component.form.get('candidate_state')?.value).toBe('VA');
    expect(component.form.get('candidate_district')?.value).toBe('01');

    component.form.patchValue({
      candidate_office: CandidateOfficeTypes.PRESIDENTIAL,
    });
    fixture.detectChanges();

    fixture
      .whenStable()
      .then(() => {
        expect(component.form.get('candidate_state')?.value).toBe('');
        expect(component.form.get('candidate_district')?.value).toBe('');

        component.form.get('candidate_office')?.setValue(CandidateOfficeTypes.SENATE);
        component.form.get('candidate_state')?.setValue('VA');
        expect(component.form.get('candidate_state')?.value).toBe('VA');
        expect(component.form.get('candidate_district')?.value).toBe('');
      })
      .catch(() => {
        fail('fixture should stablize');
      });

    component.form.get('type')?.setValue(ContactTypes.COMMITTEE);
  });

  it('changing country from USA should change state', () => {
    component.form.patchValue({
      country: 'USA',
      state: 'VA',
    });
    expect(component.form.get('country')?.value).toBe('USA');
    expect(component.form.get('state')?.value).toBe('VA');

    component.form.patchValue({
      country: 'CANADA',
    });
    expect(component.form.get('country')?.value).toBe('CANADA');
    expect(component.form.get('state')?.value).toBe('ZZ');
  });

  it('#onContactLookupSelect CANDIDATE Contact happy path', () => {
    const testContact = new Contact();
    const testLastName = 'testLastName';
    const testZip = '12345';
    testContact.type = ContactTypes.CANDIDATE;
    testContact.last_name = testLastName;
    testContact.zip = testZip;

    component.onContactLookupSelect({ value: testContact });

    expect(component.form.get('last_name')?.value).toBe(testLastName);
    expect(component.form.get('zip')?.value).toBe(testZip);

    component.form = new FormGroup({});
    component.onContactLookupSelect({ value: testContact });
  });

  it('#onContactLookupSelect COMMITTEE Contact happy path', () => {
    const testContact = new Contact();
    const testCommitteeId = 'C1234568';
    const testZip = '12345';
    testContact.type = ContactTypes.COMMITTEE;
    testContact.committee_id = testCommitteeId;
    testContact.zip = testZip;

    component.onContactLookupSelect({ value: testContact });

    expect(component.form.get('committee_id')?.value).toBe(testCommitteeId);
    expect(component.form.get('zip')?.value).toBe(testZip);

    component.form = new FormGroup({});
    component.onContactLookupSelect({ value: testContact });
  });

  it('#onContactLookupSelect FecApiCandidateLookupData happy path', () => {
    const testId = 'P12345678';
    const testOfficeSought = 'P';
    const testName = 'testName';
    const testAddressCity = 'testAddressCity';
    const testFecApiCandidateLookupData = new FecApiCandidateLookupData({
      id: testId,
      office_sought: testOfficeSought,
      name: testName,
    } as FecApiCandidateLookupData);
    const testResponse = new Candidate();
    testResponse.candidate_id = testId;
    testResponse.address_city = testAddressCity;

    spyOn(testFecApiService, 'getCandidateDetails').and.returnValue(of(testResponse));

    component.onContactLookupSelect({ value: testFecApiCandidateLookupData });

    expect(component.form.get('type')?.value).toBe(ContactTypes.CANDIDATE);
    expect(component.form.get('candidate_id')?.value).toBe(testId);
    expect(component.form.get('city')?.value).toBe(testAddressCity);

    component.form = new FormGroup({});
    component.onContactLookupSelect({ value: testFecApiCandidateLookupData });
  });

  it('#onContactLookupSelect FecApiCommitteeLookupData happy path', () => {
    const testId = 'C12345678';
    const testIsActive = true;
    const testName = 'testName';
    const testPhone = '1234567890';
    const testFecApiCommitteeLookupData = new FecApiCommitteeLookupData({
      id: testId,
      is_active: testIsActive,
      name: testName,
    } as FecApiCommitteeLookupData);
    const testResponse = new CommitteeAccount();
    testResponse.committee_id = testId;
    testResponse.treasurer_phone = testPhone;

    spyOn(testFecApiService, 'getCommitteeDetails').and.returnValue(of(testResponse));

    component.onContactLookupSelect({ value: testFecApiCommitteeLookupData });

    expect(component.form.get('type')?.value).toBe(ContactTypes.COMMITTEE);
    expect(component.form.get('committee_id')?.value).toBe(testId);
    expect(component.form.get('telephone')?.value).toBe('+1 ' + testPhone);

    component.form = new FormGroup({});
    component.onContactLookupSelect({ value: testFecApiCommitteeLookupData });
  });
});
