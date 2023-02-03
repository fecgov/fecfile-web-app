import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TransactionType } from 'app/shared/models/transaction-types/transaction-type.model';
import { Transaction } from 'app/shared/models/transaction.model';
import {
  NavigationAction,
  NavigationDestination,
  NavigationEvent,
} from 'app/shared/models/transaction-navigation-controls.model';
import { Contact, ContactTypes } from 'app/shared/models/contact.model';
import { AggregationGroups, SchATransaction } from 'app/shared/models/scha-transaction.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { schema as PAC_JF_TRANSFER_MEMO } from 'fecfile-validate/fecfile_validate_js/dist/PAC_JF_TRANSFER_MEMO';
import { Confirmation, ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { environment } from '../../../environments/environment';
import { ScheduleATransactionTypes } from '../../shared/models/scha-transaction.model';
import { SharedModule } from '../../shared/shared.module';
import { TransactionGroupFComponent } from './transaction-group-f.component';
import { ContactService } from 'app/shared/services/contact.service';
import { of } from 'rxjs';

describe('TransactionGroupFComponent', () => {
  let httpTestingController: HttpTestingController;
  let component: TransactionGroupFComponent;
  let fixture: ComponentFixture<TransactionGroupFComponent>;
  let testConfirmationService: ConfirmationService;
  let testContactService: ContactService;

  const transaction = SchATransaction.fromJSON({
    form_type: 'SA15',
    filer_committee_id_number: 'C00000000',
    transaction_type_identifier: 'PAC_JF_TRANSFER_MEMO',
    transaction_id: 'AAAAAAAAAAAAAAAAAAA',
    back_reference_tran_id_number: 'AAAAAAAAAAAAAAAAAAA',
    back_reference_sched_name: 'SA12',
    entity_type: ContactTypes.COMMITTEE,
    contributor_organization_name: 'org name',
    contributor_street_1: '123 Main St',
    contributor_city: 'city',
    contributor_state: 'VA',
    contributor_zip: '20001',
    contribution_date: '2022-08-11',
    contribution_amount: 1,
    contribution_aggregate: 2,
    contribution_purpose_descrip: 'Joint Fundraising Memo: test',
    aggregation_group: AggregationGroups.GENERAL,
    memo_code: true,
    donor_committee_fec_id: 'C00000000',
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        ToastModule,
        SharedModule,
        DividerModule,
        DropdownModule,
        CalendarModule,
        ButtonModule,
        CheckboxModule,
        InputNumberModule,
        InputTextModule,
        InputTextareaModule,
        ConfirmDialogModule,
      ],
      declarations: [TransactionGroupFComponent],
      providers: [MessageService, ConfirmationService, FormBuilder, provideMockStore(testMockStore), FecDatePipe],
    }).compileComponents();
    testContactService = TestBed.inject(ContactService);
    testConfirmationService = TestBed.inject(ConfirmationService);
  });

  beforeEach(() => {
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(TransactionGroupFComponent);
    component = fixture.componentInstance;
    component.transactionType = {
      scheduleId: '',
      componentGroupId: '',
      contact: undefined,
      generatePurposeDescriptionWrapper: () => 'test description',
      getNewTransaction: () => {
        return {} as Transaction;
      },
      title: '',
      schema: PAC_JF_TRANSFER_MEMO,
      transaction: transaction,
      isDependentChild: false,
      updateParentOnSave: false,
      getSchemaName: () => 'foo',
    } as TransactionType;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('#save() should save a new com record', () => {
    const testContact: Contact = new Contact();
    testContact.id = 'testId';
    spyOn(testContactService, 'create').and.returnValue(of(testContact));
    spyOn(testConfirmationService, 'confirm').and.callFake((confirmation: Confirmation) => {
      if (confirmation.accept) {
        return confirmation.accept();
      }
    });

    if (component.transactionType?.transaction) {
      component.transactionType.transaction.id = undefined;
    }
    const testTran = SchATransaction.fromJSON({
      ...transaction,
      contact: new Contact(),
    });
    component.form.patchValue({ ...testTran });
    component.handleNavigate(new NavigationEvent(NavigationAction.SAVE, NavigationDestination.LIST, testTran));
    expect(component.form.invalid).toBe(false);
    const req = httpTestingController.expectOne(`${environment.apiUrl}/transactions/schedule-a/`);
    expect(req.request.method).toEqual('POST');
    httpTestingController.verify();
  });

  it('#save() should update an existing contact', () => {
    const testContact: Contact = new Contact();
    testContact.id = 'testId';
    spyOn(testContactService, 'create').and.returnValue(of(testContact));
    spyOn(testConfirmationService, 'confirm').and.callFake((confirmation: Confirmation) => {
      if (confirmation.accept) {
        return confirmation.accept();
      }
    });

    if (component.transactionType?.transaction) {
      component.transactionType.transaction.id = '10';
    }
    component.form.patchValue({ ...transaction });
    component.save(new NavigationEvent(NavigationAction.SAVE, NavigationDestination.ANOTHER, transaction));
    const req = httpTestingController.expectOne(`${environment.apiUrl}/transactions/schedule-a/10/`);
    expect(req.request.method).toEqual('PUT');
    httpTestingController.verify();
  });

  it('#save() should not save an invalid record', () => {
    component.form.patchValue({ ...transaction, ...{ contributor_state: 'not-valid' } });
    component.save(new NavigationEvent(NavigationAction.SAVE, NavigationDestination.LIST, transaction));
    expect(component.form.invalid).toBe(true);
    httpTestingController.expectNone(
      `${environment.apiUrl}/transactions/schedule-a/1/?schema=PAC_JF_TRANSFER_MEMO&fields_to_validate=`
    );
    httpTestingController.verify();
  });
});
