import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { JsonSchema } from 'app/shared/interfaces/json-schema.interface';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ContactTypes } from '../../models/contact.model';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';
import { FecInternationalPhoneInputComponent } from '../fec-international-phone-input/fec-international-phone-input.component';
import { ContactFormComponent } from './contact-form.component';

describe('ContactFormComponent', () => {
  let component: ContactFormComponent;
  let fixture: ComponentFixture<ContactFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        DialogModule, FormsModule, ReactiveFormsModule, DropdownModule],
      declarations: [ContactFormComponent, ErrorMessagesComponent,
        FecInternationalPhoneInputComponent],
      providers: [FormBuilder, provideMockStore(testMockStore)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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

  it('changing country from USA should change state', () => {
    component.form.patchValue({
      country: 'USA',
      state: 'VA',
    });
    expect(component.form.get('country')?.value).toBe('USA');
    expect(component.form.get('state')?.value).toBe('VA');
  });

  it('#getSchemaByType should return the correct schema', () => {
    let schema: JsonSchema = component['getSchemaByType'](ContactTypes.COMMITTEE);
    expect(schema.$id).toBe('https://github.com/fecgov/fecfile-validate/blob/main/schema/Contact_Committee.json');

    schema = component['getSchemaByType'](ContactTypes.ORGANIZATION);
    expect(schema.$id).toBe('https://github.com/fecgov/fecfile-validate/blob/main/schema/Contact_Organization.json');
  });
});
