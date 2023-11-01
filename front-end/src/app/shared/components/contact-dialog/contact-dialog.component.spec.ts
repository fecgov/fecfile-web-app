import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { testContact, testMockStore } from 'app/shared/utils/unit-test.utils';
import { DropdownModule } from 'primeng/dropdown';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';
import { FecInternationalPhoneInputComponent } from '../fec-international-phone-input/fec-international-phone-input.component';
import { ContactDialogComponent } from './contact-dialog.component';
import { ContactLookupComponent } from '../contact-lookup/contact-lookup.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { LabelPipe } from 'app/shared/pipes/label.pipe';
import { CandidateOfficeTypes, Contact } from 'app/shared/models/contact.model';

describe('ContactDialogComponent', () => {
  let component: ContactDialogComponent;
  let fixture: ComponentFixture<ContactDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, ReactiveFormsModule, DropdownModule, AutoCompleteModule],
      declarations: [
        ContactDialogComponent,
        ErrorMessagesComponent,
        FecInternationalPhoneInputComponent,
        ContactLookupComponent,
        LabelPipe,
      ],
      providers: [FormBuilder, provideMockStore(testMockStore)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactDialogComponent);
    component = fixture.componentInstance;
    component.contact = { ...testContact } as Contact;
    component.contactLookup = {
      contactTypeReadOnly: false,
      contactTypeFormControl: new FormControl(),
    } as ContactLookupComponent;
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return CandidateOfficeTypes when called', () => {
    expect(component.CandidateOfficeTypes.HOUSE).toBe(CandidateOfficeTypes.HOUSE);
    component.defaultCandidateOffice = CandidateOfficeTypes.PRESIDENTIAL;
    component.ngOnInit();
  });

  it('should open dialog with new or edit contact', () => {
    component.contact.id = '123';
    component.openDialog();
    expect(component.isNewItem).toBeFalse();
    expect(component.contactLookup.contactTypeReadOnly).toBeTrue();

    component.contact.id = undefined;
    component.contactTypeOptions = [{ label: 'org', value: 'ORG' }];
    component.contactLookup.contactTypeReadOnly = false;
    component.openDialog();
    expect(component.contactLookup.contactTypeReadOnly).toBeTrue();
  });

  it('should close dialog with flags set', () => {
    component.detailVisible = true;
    component.dialogVisible = true;
    component.closeDialog();
    expect(component.detailVisible).toBeFalse();
    expect(component.dialogVisible).toBeFalse();
  });

  it('should save contact', () => {
    component.formSubmitted = false;
    const fb: FormBuilder = new FormBuilder();
    const form = fb.group({
      test: new FormControl('', Validators.required),
    });
    component.form = form;
    component.saveContact();
    expect(component.formSubmitted).toBeTrue();

    spyOn(component.savedContact, 'emit');
    component.form.get('test')?.setValue('abc');
    component.saveContact();
    expect(component.savedContact.emit).toHaveBeenCalledTimes(1);

    component.isNewItem = false;
    component.form.get('test')?.setValue('abc');
    component.saveContact(false);
    expect(component.isNewItem).toBeTrue();
  });
});
