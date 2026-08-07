import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, EventEmitter, provideZoneChangeDetection, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { LabelPipe } from 'app/shared/pipes/label.pipe';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { testMockStore, testScheduleATransaction } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { ContactDialogComponent } from '../contact-dialog/contact-dialog.component';
import { ContactLookupComponent } from '../contact-lookup/contact-lookup.component';
import { ContactProperty, TransactionContactLookupComponent } from './transaction-contact-lookup.component';
import { Transaction } from 'app/shared/models/transaction/transaction.model';
import { ContactTypeLabels } from 'app/shared/models/contacts/contact-types.model';

@Component({
  imports: [TransactionContactLookupComponent],
  standalone: true,
  template: `<app-transaction-contact-lookup
    [form]="form"
    [contactProperty]="contactProperty"
    [transaction]="transaction"
    [contactTypeOptions]="contactTypeOptions"
  />`,
})
class TestHostComponent {
  component = viewChild.required(TransactionContactLookupComponent);
  form = new FormGroup({});
  contactProperty: ContactProperty = 'contact_1';
  transaction?: Transaction;
  contactTypeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels);
}

describe('TransactionContactLookupComponent', () => {
  let host: TestHostComponent;
  let component: TransactionContactLookupComponent;
  let fixture: ComponentFixture<TestHostComponent>;

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
        provideZoneChangeDetection(),
        ConfirmationService,
        FormBuilder,
        EventEmitter,
        MessageService,
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
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    component = host.component();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  for (let i = 2; i <= 5; i++) {
    it(`should create a component for contact_${i}`, () => {
      testContactLookupByProperty(`contact_${i}` as ContactProperty, `contact_${i}_lookup`);
    });
  }

  it('selecting create new contact should open the contact dialog', () => {
    component.detailVisible.set(false);
    component.createNewContactSelected();
    expect(component.detailVisible()).toBe(true);
  });

  function testContactLookupByProperty(contactProperty: ContactProperty, lookup: string) {
    host.contactProperty = contactProperty;
    host.transaction = testScheduleATransaction();
    fixture.detectChanges();
    expect(component.form().get(lookup)).toBeTruthy();
  }
});
