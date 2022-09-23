import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { environment } from '../../../environments/environment';
import { Contact } from '../../shared/models/contact.model';
import { ContactDetailComponent } from './contact-detail.component';

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
    component.contact.id = '10';
    component.form.patchValue({ ...contact });
    component.saveItem(true);
    const req = httpTestingController.expectOne(`${environment.apiUrl}/contacts/10/`);
    expect(req.request.method).toEqual('PUT');
    httpTestingController.verify();
  });

  xit('#saveItem should not save an invalid contact record', () => {
    const badContact: Contact = Contact.fromJSON({ ...contact });
    badContact.telephone = 'bad number';
    component.form.patchValue({ ...badContact });
    component.saveItem();
    expect(component.form.invalid).toBe(true);
    httpTestingController.expectNone(`${environment.apiUrl}/contacts/`);
    httpTestingController.verify();
  });

});
