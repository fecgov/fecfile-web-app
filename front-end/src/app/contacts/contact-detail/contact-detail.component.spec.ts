import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { MessageService } from 'primeng/api';
import { ContactDetailComponent } from './contact-detail.component';
import { FormBuilder } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { CandidateOfficeTypes, Contact, ContactTypes } from '../../shared/models/contact.model';
import { environment } from '../../../environments/environment';
import { JsonSchema } from 'app/shared/interfaces/json-schema.interface';

describe('ContactDetailComponent', () => {
  let httpTestingController: HttpTestingController;
  let component: ContactDetailComponent;
  let fixture: ComponentFixture<ContactDetailComponent>;

  const contact: Contact = Contact.fromJSON({
    id: undefined,
    type: 'IND',
    candidate_id: undefined,
    committee_id: undefined,
    name: undefined,
    last_name: 'Smith',
    first_name: 'Jane',
    middle_name: undefined,
    prefix: undefined,
    suffix: undefined,
    street_1: '123 Main St',
    street_2: undefined,
    city: 'Anywhere City',
    state: 'VA',
    zip: '22201',
    employer: undefined,
    occupation: undefined,
    candidate_office: undefined,
    candidate_state: undefined,
    candidate_district: undefined,
    telephone: undefined,
    country: 'US',
    created: undefined,
    updated: undefined,
    deleted: undefined,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, DialogModule],
      declarations: [ContactDetailComponent],
      providers: [FormBuilder, MessageService, provideMockStore(testMockStore)],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#isNewItem getter should get correct value', () => {
    expect(component.isNewItem).toBe(false);
    component.isNewItem = true;
    expect(component.isNewItem).toBe(true);
  });

  it('#CandidateOfficeTypes getter should return the list of office types', () => {
    const officeTypes = component.CandidateOfficeTypes;
    expect(officeTypes.HOUSE).toBe('H');
    expect(officeTypes.SENATE).toBe('S');
    expect(officeTypes.PRESIDENTIAL).toBe('P');
  });

  it('#onOpenDetail should patch values to the form from the contact object', () => {
    let name: string | undefined = component.form.get('name')?.value;
    expect(name).toBe('');
    component.contact.name = 'ABC Inc';
    component.onOpenDetail();
    name = component.form.get('name')?.value;
    expect(name).toBe('ABC Inc');
  });

  it('#saveItem should save a new contact record', () => {
    component.form.patchValue({ ...contact });
    component.saveItem(false);
    const req = httpTestingController.expectOne(`${environment.apiUrl}/contacts/`);
    expect(req.request.method).toEqual('POST');
    httpTestingController.verify();
  });

  it('#saveItem should update an existing contact record', () => {
    component.contact.id = '10';
    component.form.patchValue({ ...contact });
    component.saveItem(true);
    const req = httpTestingController.expectOne(`${environment.apiUrl}/contacts/10/`);
    expect(req.request.method).toEqual('PUT');
    httpTestingController.verify();
  });

  it('#saveItem should not save an invalid contact record', () => {
    const badContact: Contact = Contact.fromJSON({ ...contact });
    badContact.telephone = 'bad number';
    component.form.patchValue({ ...badContact });
    component.saveItem();
    expect(component.form.invalid).toBe(true);
    httpTestingController.expectNone(`${environment.apiUrl}/contacts/`);
    httpTestingController.verify();
  });

  it('changing candidate office should set district and state options', () => {
    component.contact.type = ContactTypes.CANDIDATE;
    component.contact.candidate_office = CandidateOfficeTypes.HOUSE;
    component.contact.candidate_state = 'VA';
    component.contact.candidate_district = '01';
    component.form.patchValue({ ...component.contact });
    expect(component.form.get('candidate_state')?.value).toBe('VA');
    expect(component.form.get('candidate_district')?.value).toBe('01');

    component.form.patchValue({
      candidate_office: CandidateOfficeTypes.PRESIDENTIAL,
    });
    expect(component.form.get('candidate_state')?.value).toBe('');
    expect(component.form.get('candidate_district')?.value).toBe('');

    component.contact.candidate_office = CandidateOfficeTypes.HOUSE;
    component.contact.candidate_state = 'VA';
    component.contact.candidate_district = '01';
    component.form.patchValue({ ...component.contact });
    component.form.patchValue({
      candidate_office: CandidateOfficeTypes.SENATE,
    });
    expect(component.form.get('candidate_state')?.value).toBe('VA');
    expect(component.form.get('candidate_district')?.value).toBe('');
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
  });
});
