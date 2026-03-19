import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { Contact } from 'app/shared/models/contact.model';
import { ListRestResponse } from 'app/shared/models/rest-api.model';
import { TransactionListRecord } from 'app/shared/models/transaction-list-record.model';
import { LabelPipe } from 'app/shared/pipes/label.pipe';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { createTestTransactionListRecord, testContact, testMockStore } from 'app/shared/utils/unit-test.utils';
import { Confirmation, ConfirmationService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SelectModule } from 'primeng/select';
import { ContactLookupComponent } from '../contact-lookup/contact-lookup.component';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';
import { FecInternationalPhoneInputComponent } from '../fec-international-phone-input/fec-international-phone-input.component';
import { ContactDialogComponent } from './contact-dialog.component';
import { TransactionListService } from 'app/shared/services/transaction-list.service';
import { provideZoneChangeDetection } from '@angular/core';
import { ROUTES } from 'app/routes';
import { provideRouter } from '@angular/router';

describe('ContactDialogComponent', () => {
  let component: ContactDialogComponent;
  let fixture: ComponentFixture<ContactDialogComponent>;
  let testConfirmationService: ConfirmationService;
  let transactionService: TransactionListService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SelectModule,
        AutoCompleteModule,
        ContactDialogComponent,
        ErrorMessagesComponent,
        FecInternationalPhoneInputComponent,
        ContactLookupComponent,
        LabelPipe,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZoneChangeDetection(),
        ConfirmationService,
        FormBuilder,
        provideMockStore(testMockStore()),
        provideRouter(ROUTES),
        DatePipe,
      ],
    }).compileComponents();

    testConfirmationService = TestBed.inject(ConfirmationService);
    transactionService = TestBed.inject(TransactionListService);
    fixture = TestBed.createComponent(ContactDialogComponent);
    component = fixture.componentInstance;
    component.contact.set(testContact());

    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open dialog with new or edit contact', () => {
    component.contact()!.id = '123';
    component.openDialog();
    expect(component.isNewItem).toBe(false);
    expect(component.contactLookup().contactTypeFormControl.disabled).toBe(false);

    component.contact()!.id = undefined;
    component.contactTypeOptions = [{ label: 'org', value: 'ORG' }];
    component.contactLookup().contactTypeFormControl.enable();
    component.openDialog();
    expect(component.contactLookup().contactTypeFormControl.disabled).toBe(false);
  });

  it('should close dialog with flags set', () => {
    component.detailVisible = true;
    component.dialogVisible.set(true);
    component.closeDialog();
    expect(component.detailVisible).toBe(false);
    expect(component.dialogVisible()).toBe(false);
  });

  it('should save contact', () => {
    component.formSubmitted = false;
    const fb: FormBuilder = new FormBuilder();
    const form = fb.group({
      test: new SubscriptionFormControl('', Validators.required),
    });
    component.form = form;
    component.saveContact();
    expect(component.formSubmitted).toBe(true);

    vi.spyOn(component.savedContact, 'emit');
    component.form.get('test')?.setValue('abc');
    component.saveContact();
    expect(component.savedContact.emit).toHaveBeenCalledTimes(1);

    component.isNewItem = false;
    component.form.get('test')?.setValue('abc');
    component.saveContact(false);
    expect(component.isNewItem).toBe(true);
  });

  it('should raise confirmation dialog', () => {
    component.contact.set(new Contact());
    const spy = vi.spyOn(testConfirmationService, 'confirm').mockImplementation((confirmation: Confirmation) => {
      if (confirmation.accept) return confirmation?.accept();
    });
    component.confirmPropagation();
    expect(spy).toHaveBeenCalled();
  });

  describe('transactions', () => {
    it('should route to transaction', async () => {
      const spy = vi.spyOn(component.router, 'navigate');
      const testTransactionListRecord = createTestTransactionListRecord();
      testTransactionListRecord.report_ids = ['abc'];
      await component.openTransaction(testTransactionListRecord);
      expect(spy).toHaveBeenCalledWith([
        `reports/transactions/report/${testTransactionListRecord.report_ids?.[0]}/list/${testTransactionListRecord.id}`,
      ]);
    });

    it('should handle pagination', async () => {
      vi.spyOn(transactionService, 'getTableData').mockReturnValue(
        Promise.resolve({ results: [], count: 5, pageNumber: 0, next: '', previous: '' } as ListRestResponse),
      );
      await component.loadTransactions();

      expect(component.transactions).toEqual([]);
    });

    it('should not show Form 24s', async () => {
      const testReportCodeLabel = 'APRIL 15 QUARTERLY REPORT (Q1)';
      const transactionListRecord = new TransactionListRecord();
      transactionListRecord.report_code_label = testReportCodeLabel;
      vi.spyOn(transactionService, 'getTableData').mockReturnValue(
        Promise.resolve({
          results: [transactionListRecord],
          count: 1,
          pageNumber: 1,
          next: '',
          previous: '',
        } as ListRestResponse),
      );
      await component.loadTransactions();

      expect(component.transactions[0].report_code_label).toBe(testReportCodeLabel);
    });

    describe('loadTransactions', () => {
      it('should load even without first in event or pagerState', async () => {
        vi.spyOn(transactionService, 'getTableData').mockReturnValue(
          Promise.resolve({ results: [], count: 5, pageNumber: 0, next: '', previous: '' } as ListRestResponse),
        );
        await component.loadTransactions();

        expect(component.transactions).toEqual([]);
      });

      it('should load even without first in event', async () => {
        vi.spyOn(transactionService, 'getTableData').mockReturnValue(
          Promise.resolve({ results: [], count: 5, pageNumber: 0, next: '', previous: '' } as ListRestResponse),
        );
        await component.loadTransactions();

        expect(component.transactions).toEqual([]);
      });
    });

    it('should get params', () => {
      component.rowsPerPage.set(5);
      component.contact()!.id = '123';
      expect(component.params()!['page_size']).toBe(5);
      expect(component.params()!['contact']).toBe('123');
    });
  });
});
