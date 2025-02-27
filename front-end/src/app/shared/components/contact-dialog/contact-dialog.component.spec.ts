import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import {
  getTestTransactionByType,
  testActiveReport,
  testContact,
  testMockStore,
  testScheduleATransaction,
} from 'app/shared/utils/unit-test.utils';
import { SelectModule } from 'primeng/select';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';
import { FecInternationalPhoneInputComponent } from '../fec-international-phone-input/fec-international-phone-input.component';
import { ContactDialogComponent, TransactionData } from './contact-dialog.component';
import { ContactLookupComponent } from '../contact-lookup/contact-lookup.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { LabelPipe } from 'app/shared/pipes/label.pipe';
import { CandidateOfficeTypes, Contact } from 'app/shared/models/contact.model';
import { Confirmation, ConfirmationService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { TransactionService } from 'app/shared/services/transaction.service';
import { TableLazyLoadEvent } from 'primeng/table';
import { ListRestResponse } from 'app/shared/models/rest-api.model';
import { Form24 } from 'app/shared/models/form-24.model';
import { ReportTypes } from 'app/shared/models/report.model';
import { SchATransaction, ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ContactDialogComponent', () => {
  let component: ContactDialogComponent;
  let fixture: ComponentFixture<ContactDialogComponent>;
  let testConfirmationService: ConfirmationService;
  let transactionService: TransactionService;

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
        ConfirmationService,
        FormBuilder,
        provideMockStore(testMockStore),
        DatePipe,
      ],
    }).compileComponents();

    testConfirmationService = TestBed.inject(ConfirmationService);
    transactionService = TestBed.inject(TransactionService);
    fixture = TestBed.createComponent(ContactDialogComponent);
    component = fixture.componentInstance;
    component.contact = { ...testContact } as Contact;
    component.contactLookup = {
      contactTypeFormControl: new SubscriptionFormControl(),
    } as ContactLookupComponent;
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return CandidateOfficeTypes when called', () => {
    component.defaultCandidateOffice = CandidateOfficeTypes.PRESIDENTIAL;
    component.ngOnInit();
    component.openDialog();
    expect(component.CandidateOfficeTypes.HOUSE).toBe(CandidateOfficeTypes.HOUSE);
  });

  it('should open dialog with new or edit contact', () => {
    component.contact.id = '123';
    component.openDialog();
    expect(component.isNewItem).toBeFalse();
    expect(component.contactLookup.contactTypeFormControl.disabled).toBeFalse();

    component.contact.id = undefined;
    component.contactTypeOptions = [{ label: 'org', value: 'ORG' }];
    component.contactLookup.contactTypeFormControl.enable();
    component.openDialog();
    expect(component.contactLookup.contactTypeFormControl.disabled).toBeFalse();
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
      test: new SubscriptionFormControl('', Validators.required),
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

  it('should raise confirmation dialog', () => {
    component.contact = new Contact();
    const spy = spyOn(testConfirmationService, 'confirm').and.callFake((confirmation: Confirmation) => {
      if (confirmation.accept) return confirmation?.accept();
    });
    component.confirmPropagation();
    expect(spy).toHaveBeenCalled();
  });

  describe('transactions', () => {
    it('should route to transaction', () => {
      const spy = spyOn(component.router, 'navigate');
      const transaction = testScheduleATransaction;
      component.openTransaction(new TransactionData(transaction));
      expect(spy).toHaveBeenCalledWith([
        `reports/transactions/report/${transaction.report_ids?.[0]}/list/${transaction.id}`,
      ]);
    });

    it('should handle pagination', async () => {
      spyOn(transactionService, 'getTableData').and.returnValue(
        Promise.resolve({ results: [], count: 5, pageNumber: 0, next: '', previous: '' } as ListRestResponse),
      );
      await component.loadTransactions({ first: 1, rows: 5 } as TableLazyLoadEvent);

      expect(component.transactions).toEqual([]);
    });

    it('should not show Form 24s', async () => {
      const transaction: SchATransaction = getTestTransactionByType(
        ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
      ) as SchATransaction;
      transaction.reports = [testActiveReport];
      transaction.reports?.push(Form24.fromJSON({ id: '1', report_type: ReportTypes.F24 }));
      spyOn(transactionService, 'getTableData').and.returnValue(
        Promise.resolve({
          results: [transaction],
          count: 1,
          pageNumber: 1,
          next: '',
          previous: '',
        } as ListRestResponse),
      );
      await component.loadTransactions({ first: 1, rows: 5 } as TableLazyLoadEvent);

      expect(component.transactions[0].report_code_label).toBe('APRIL 15 QUARTERLY REPORT (Q1)');
    });

    describe('loadTransactions', () => {
      it('should load even without first in event or pagerState', async () => {
        component.pagerState = undefined;
        spyOn(transactionService, 'getTableData').and.returnValue(
          Promise.resolve({ results: [], count: 5, pageNumber: 0, next: '', previous: '' } as ListRestResponse),
        );
        await component.loadTransactions({ rows: 5 } as TableLazyLoadEvent);

        expect(component.transactions).toEqual([]);
      });

      it('should load even without first in event', async () => {
        component.pagerState = { rows: 5 } as TableLazyLoadEvent;
        spyOn(transactionService, 'getTableData').and.returnValue(
          Promise.resolve({ results: [], count: 5, pageNumber: 0, next: '', previous: '' } as ListRestResponse),
        );
        await component.loadTransactions({ rows: 5 } as TableLazyLoadEvent);

        expect(component.transactions).toEqual([]);
      });
    });

    it('should get params', () => {
      component.rowsPerPage = 5;
      component.contact.id = '123';
      const params = component.getParams();
      expect(params['page_size']).toBe(5);
      expect(params['contact']).toBe('123');
    });
  });
});
