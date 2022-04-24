import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MessageService } from 'primeng/api';
import { ContactDetailComponent } from './contact-detail.component';
import { UserLoginData } from '../../shared/models/user.model';
import { FormBuilder } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { CandidateOfficeTypes, Contact, ContactTypes } from '../../shared/models/contact.model';
import { environment } from '../../../environments/environment';

describe('ContactDetailComponent', () => {
  let httpTestingController: HttpTestingController;
  let component: ContactDetailComponent;
  let fixture: ComponentFixture<ContactDetailComponent>;

  const contact: Contact = Contact.fromJSON({
    id: null,
    type: 'IND',
    candidate_id: null,
    committee_id: null,
    name: null,
    last_name: 'Smith',
    first_name: 'Jane',
    middle_name: null,
    prefix: null,
    suffix: null,
    street_1: '123 Main St',
    street_2: null,
    city: 'Anywhere City',
    state: 'VA',
    zip: '22201',
    employer: null,
    occupation: null,
    candidate_office: null,
    candidate_state: null,
    candidate_district: null,
    telephone: null,
    country: 'US',
    created: null,
    updated: null,
    deleted: null,
  });

  beforeEach(async () => {
    const userLoginData: UserLoginData = {
      committee_id: 'C00000000',
      email: 'email@fec.com',
      is_allowed: true,
      token: 'jwttokenstring',
    };
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, DialogModule],
      declarations: [ContactDetailComponent],
      providers: [
        FormBuilder,
        MessageService,
        provideMockStore({
          initialState: { fecfile_online_userLoginData: userLoginData },
          selectors: [{ selector: 'selectUserLoginData', value: userLoginData }],
        }),
      ],
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

  it('#isNewContact getter should get correct value', () => {
    expect(component.isNewContact).toBe(false);
    component.isNewContact = true;
    expect(component.isNewContact).toBe(true);
  });

  it('#CandidateOfficeTypes getter should return the list of office types', () => {
    const officeTypes = component.CandidateOfficeTypes;
    expect(officeTypes.HOUSE).toBe('H');
    expect(officeTypes.SENATE).toBe('S');
    expect(officeTypes.PRESIDENTIAL).toBe('P');
  });

  it('#onOpenDetail should patch values to the form from the contact object', () => {
    let name: string | null = component.form.get('name')?.value;
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
    component.contact.id = 10;
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
});
