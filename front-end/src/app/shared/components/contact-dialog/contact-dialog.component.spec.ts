import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { testContact, testMockStore, testScheduleATransaction } from 'app/shared/utils/unit-test.utils';
import { DropdownModule } from 'primeng/dropdown';
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
import { of } from 'rxjs';
import { TableLazyLoadEvent } from 'primeng/table';
import { ListRestResponse } from 'app/shared/models/rest-api.model';

describe('ContactDialogComponent', () => {
  let component: ContactDialogComponent;
  let fixture: ComponentFixture<ContactDialogComponent>;
  let testConfirmationService: ConfirmationService;
  let transactionService: TransactionService;

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
      providers: [ConfirmationService, FormBuilder, provideMockStore(testMockStore), DatePipe],
    }).compileComponents();

    testConfirmationService = TestBed.inject(ConfirmationService);
    transactionService = TestBed.inject(TransactionService);
    fixture = TestBed.createComponent(ContactDialogComponent);
    component = fixture.componentInstance;
    component.contact = { ...testContact } as Contact;
    component.contactLookup = {
      contactTypeFormControl: new FormControl(),
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

    it('should handle pagination', () => {
      spyOn(transactionService, 'getTableData').and.returnValue(
        of({ results: [], count: 5, pageNumber: 0, next: '', previous: '' } as ListRestResponse),
      );
      component.loadTransactions({ first: 1, rows: 5 } as TableLazyLoadEvent);
      expect(component.transactions).toEqual([]);
    });
  });
});
