import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { ContactTypeLabels, ContactTypes } from 'app/shared/models/contact.model';
import { LabelPipe } from 'app/shared/pipes/label.pipe';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { testContact, testMockStore, testScheduleATransaction } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { ContactDialogComponent } from '../contact-dialog/contact-dialog.component';
import { ContactLookupComponent } from '../contact-lookup/contact-lookup.component';
import { TransactionContactLookupComponent } from './transaction-contact-lookup.component';

describe('TransactionContactLookupComponent', () => {
  let component: TransactionContactLookupComponent;
  let fixture: ComponentFixture<TransactionContactLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        DialogModule,
        SelectModule,
        AutoCompleteModule,
        TransactionContactLookupComponent,
        ContactLookupComponent,
        ContactDialogComponent,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ConfirmationService,
        FormBuilder,
        EventEmitter,
        provideMockStore(testMockStore()),
        DatePipe,
        LabelPipe,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { reportId: '99' } },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionContactLookupComponent);
    component = fixture.componentInstance;
    component.contactTypeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a component for "contact_2" or "contact_3', () => {
    component.contactProperty = 'contact_2';
    component.transaction = testScheduleATransaction();
    component.ngOnInit();
    expect(component.form.get('contact_2_lookup')).toBeTruthy();

    component.contactProperty = 'contact_3';
    component.ngOnInit();
    expect(component.form.get('contact_3_lookup')).toBeTruthy();

    component.contactProperty = 'contact_4';
    component.ngOnInit();
    expect(component.form.get('contact_4_lookup')).toBeTruthy();

    component.contactProperty = 'contact_5';
    component.ngOnInit();
    expect(component.form.get('contact_5_lookup')).toBeTruthy();
  });

  it('selecting a contactType should emit its value', () => {
    spyOn(component.contactTypeSelect, 'emit');
    component.contactTypeSelected(ContactTypes.COMMITTEE);
    expect(component.contactTypeSelect.emit).toHaveBeenCalledWith(ContactTypes.COMMITTEE);
  });

  it('selecting a contactLookup should emit the contact or update the contact dialog', () => {
    component.detailVisible = false;
    const contact = testContact();
    component.contactLookupSelected(contact);
    contact.id = undefined;
    component.contactLookupSelected(contact);
    expect(component.detailVisible).toBeTrue();
  });

  it('selecting create new contact should open the contact dialog', () => {
    component.detailVisible = false;
    component.createNewContactSelected();
    expect(component.detailVisible).toBeTrue();
  });

  it('saving a contact should emit the contact', () => {
    spyOn(component.contactSelect, 'emit');
    const contact = testContact();
    component.saveContact(contact);
    expect(component.contactSelect.emit).toHaveBeenCalledWith({ value: contact });
  });
});
