import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { JsonSchema } from 'app/shared/interfaces/json-schema.interface';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { CandidateOfficeTypes, Contact, ContactTypes, FecApiCommitteeLookupData } from 'app/shared/models/contact.model';
import { FecApiService } from 'app/shared/services/fec-api.service';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { DropdownModule } from 'primeng/dropdown';
import { of } from 'rxjs';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';
import { FecInternationalPhoneInputComponent } from '../fec-international-phone-input/fec-international-phone-input.component';
import { ContactFormComponent } from './contact-form.component';

describe('ContactFormComponent', () => {
  let component: ContactFormComponent;
  let fixture: ComponentFixture<ContactFormComponent>;
  let httpTestingController: HttpTestingController;
  let testFecApiService: FecApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        DropdownModule,
      ],
      declarations: [ContactFormComponent, ErrorMessagesComponent,
        FecInternationalPhoneInputComponent],
      providers: [FormBuilder, provideMockStore(testMockStore)],
    }).compileComponents();
    httpTestingController = TestBed.inject(HttpTestingController);
    testFecApiService = TestBed.inject(FecApiService);
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
    expect(component.form.get('candidate_state')?.value).toBe('');
    expect(component.form.get('candidate_district')?.value).toBe('');

    component.form.get('candidate_office')?.setValue(CandidateOfficeTypes.SENATE);
    component.form.get('candidate_state')?.setValue('VA');
    expect(component.form.get('candidate_state')?.value).toBe('VA');
    expect(component.form.get('candidate_district')?.value).toBe('');

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

  it('#getSchemaByType should return the correct schema', () => {
    let schema: JsonSchema = component['getSchemaByType'](ContactTypes.COMMITTEE);
    expect(schema.$id).toBe('https://github.com/fecgov/fecfile-validate/blob/main/schema/Contact_Committee.json');

    schema = component['getSchemaByType'](ContactTypes.ORGANIZATION);
    expect(schema.$id).toBe('https://github.com/fecgov/fecfile-validate/blob/main/schema/Contact_Organization.json');

    schema = component['getSchemaByType'](ContactTypes.CANDIDATE);
    expect(schema.$id).toBe('https://github.com/fecgov/fecfile-validate/blob/main/schema/Contact_Candidate.json');
  });

  it('#onContactLookupSelect CANDIDATE Contact happy path', () => {
    const testContact = new Contact();
    const testLastName = "testLastName";
    const testZip = "12345";
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
    const testCommitteeId = "C1234568";
    const testZip = "12345";
    testContact.type = ContactTypes.COMMITTEE;
    testContact.committee_id = testCommitteeId;
    testContact.zip = testZip;

    component.onContactLookupSelect({ value: testContact });

    expect(component.form.get('committee_id')?.value).toBe(testCommitteeId);
    expect(component.form.get('zip')?.value).toBe(testZip);

    component.form = new FormGroup({});
    component.onContactLookupSelect({ value: testContact });
  });

  it('#onContactLookupSelect FecApiCommitteeLookupData happy path', () => {
    const testId = 'C12345678'
    const testIsActive = true;
    const testName = 'testName';
    const testPhone = '1234567890';
    const testFecApiCommitteeLookupData = new FecApiCommitteeLookupData({
      id: testId,
      is_active: testIsActive,
      name: testName
    } as FecApiCommitteeLookupData);
    const testResponse = new CommitteeAccount();
    testResponse.committee_id = testId;
    testResponse.treasurer_phone = testPhone;

    spyOn(testFecApiService, 'getDetails').and.returnValue(of(testResponse));

    component.onContactLookupSelect({ value: testFecApiCommitteeLookupData });

    expect(component.form.get('type')?.value).toBe(ContactTypes.COMMITTEE);
    expect(component.form.get('committee_id')?.value).toBe(testId);
    expect(component.form.get('telephone')?.value).toBe('+1 ' + testPhone);

    component.form = new FormGroup({});
    component.onContactLookupSelect({ value: testFecApiCommitteeLookupData });
  });

});
