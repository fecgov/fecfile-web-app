import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TransactionType } from 'app/shared/interfaces/transaction-type.interface';
import { Transaction } from 'app/shared/interfaces/transaction.interface';
import { ContactTypes } from 'app/shared/models/contact.model';
import { SchATransaction } from 'app/shared/models/scha-transaction.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { schema as PAC_JF_TRANSFER_MEMO } from 'fecfile-validate/fecfile_validate_js/dist/PAC_JF_TRANSFER_MEMO';
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
import { environment } from '../../../environments/environment';
import { ScheduleATransactionTypes } from '../../shared/models/scha-transaction.model';
import { SharedModule } from '../../shared/shared.module';
import { TransactionGroupFComponent } from './transaction-group-f.component';

describe('TransactionGroupFComponent', () => {
  let httpTestingController: HttpTestingController;
  let component: TransactionGroupFComponent;
  let fixture: ComponentFixture<TransactionGroupFComponent>;

  const transaction = SchATransaction.fromJSON({
    form_type: 'SA11AI',
    filer_committee_id_number: 'C00000000',
    transaction_type_identifier: ScheduleATransactionTypes.PAC_JF_TRANSFER_MEMO,
    transaction_id: 'AAAAAAAAAAAAAAAAAAA',
    entity_type: ContactTypes.ORGANIZATION,
    contributor_organization_name: 'org name',
    contributor_street_1: '123 Main St',
    contributor_city: 'city',
    contributor_state: 'VA',
    contributor_zip: '20001',
    contribution_date: '20220811',
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
        InputNumberModule,
        InputTextModule,
        InputTextareaModule,
        ConfirmDialogModule,
      ],
      declarations: [TransactionGroupFComponent],
      providers: [MessageService, ConfirmationService,
        FormBuilder, provideMockStore(testMockStore), FecDatePipe],
    }).compileComponents();
  });

  beforeEach(() => {
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(TransactionGroupFComponent);
    component = fixture.componentInstance;
    component.transactionType = {
      scheduleId: '',
      componentGroupId: '',
      contact: undefined,
      contributionPurposeDescripReadonly: () => '',
      getNewTransaction: () => {
        return {} as Transaction;
      },
      title: '',
      parentTransaction: undefined,
      schema: PAC_JF_TRANSFER_MEMO,
      transaction: transaction,
      childTransactionType: undefined,
    } as TransactionType;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#save() should not save an invalid record', () => {
    component.form.patchValue({ ...transaction, ...{ contributor_state: 'not-valid' } });
    component.save('list');
    expect(component.form.invalid).toBe(true);
    httpTestingController.expectNone(
      `${environment.apiUrl}/sch-a-transactions/1/?schema=PAC_JF_TRANSFER_MEMO&fields_to_validate=`
    );
    httpTestingController.verify();
  });
});
