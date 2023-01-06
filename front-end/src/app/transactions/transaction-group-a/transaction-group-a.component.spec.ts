import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TransactionType } from 'app/shared/interfaces/transaction-type.interface';
import { Transaction } from 'app/shared/models/transaction.model';
import { ContactTypes } from 'app/shared/models/contact.model';
import { SchATransaction, ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { NavigationDestination } from 'app/shared/models/transaction-navigation-controls.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { environment } from 'environments/environment';
import { schema as INDIVIDUAL_JF_TRANSFER_MEMO } from 'fecfile-validate/fecfile_validate_js/dist/INDIVIDUAL_JF_TRANSFER_MEMO';
import { ConfirmationService, MessageService } from 'primeng/api';
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
import { SharedModule } from '../../shared/shared.module';
import { TransactionGroupAComponent } from './transaction-group-a.component';

describe('TransactionGroupAComponent', () => {
  let httpTestingController: HttpTestingController;
  let component: TransactionGroupAComponent;
  let fixture: ComponentFixture<TransactionGroupAComponent>;

  const transaction = SchATransaction.fromJSON({
    form_type: 'SA11AI',
    filer_committee_id_number: 'C00000000',
    transaction_type_identifier: ScheduleATransactionTypes.INDIVIDUAL_JF_TRANSFER_MEMO,
    transaction_id: 'AAAAAAAAAAAAAAAAAAA',
    entity_type: ContactTypes.ORGANIZATION,
    contributor_organization_name: 'org name',
    contributor_street_1: '123 Main St',
    contributor_city: 'city',
    contributor_state: 'VA',
    contributor_zip: '20001',
    contribution_date: '2022-08-11',
    contribution_amount: 1,
    contribution_aggregate: 2,
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
        InputTextModule,
        InputTextareaModule,
        InputNumberModule,
        ConfirmDialogModule,
      ],
      declarations: [TransactionGroupAComponent],
      providers: [MessageService, ConfirmationService, FormBuilder, provideMockStore(testMockStore), FecDatePipe],
    }).compileComponents();
  });

  beforeEach(() => {
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(TransactionGroupAComponent);
    component = fixture.componentInstance;
    component.transactionType = {
      scheduleId: '',
      componentGroupId: '',
      contact: undefined,
      generatePurposeDescription: () => 'test description',
      getNewTransaction: () => {
        return {} as Transaction;
      },
      title: '',
      schema: INDIVIDUAL_JF_TRANSFER_MEMO,
      transaction: transaction,
      isDependentChild: false,
    } as TransactionType;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#save() should not save an invalid record', () => {
    component.form.patchValue({ ...transaction, ...{ contributor_state: 'not-valid' } });
    component.save(NavigationDestination.LIST);
    expect(component.form.invalid).toBe(true);
    httpTestingController.expectNone(
      `${environment.apiUrl}/sch-a-transactions/1/?schema=INDIVIDUAL_JF_TRANSFER_MEMO&fields_to_validate=`
    );
    httpTestingController.verify();
  });
});
