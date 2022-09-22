import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TransactionGroupBComponent } from './transaction-group-b.component';
import { ToastModule } from 'primeng/toast';
import { SharedModule } from '../../shared/shared.module';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ContactTypes } from 'app/shared/models/contact.model';
import { SchATransaction } from 'app/shared/models/scha-transaction.model';
import { environment } from '../../../environments/environment';
import { schema as OFFSET_TO_OPEX } from 'fecfile-validate/fecfile_validate_js/dist/OFFSET_TO_OPEX';
import { InputNumberModule } from 'primeng/inputnumber';
import { TransactionType } from 'app/shared/interfaces/transaction-type.interface';
import { Transaction } from 'app/shared/interfaces/transaction.interface';

describe('TransactionGroupBComponent', () => {
  let httpTestingController: HttpTestingController;
  let component: TransactionGroupBComponent;
  let fixture: ComponentFixture<TransactionGroupBComponent>;

  const transaction = SchATransaction.fromJSON({
    form_type: 'SA15',
    filer_committee_id_number: 'C00000000',
    transaction_type_identifier: 'OFFSET_TO_OPEX',
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
        InputNumberModule,
        InputTextModule,
        InputTextareaModule,
      ],
      declarations: [TransactionGroupBComponent],
      providers: [MessageService, FormBuilder, provideMockStore(testMockStore)],
    }).compileComponents();
  });

  beforeEach(() => {
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(TransactionGroupBComponent);
    component = fixture.componentInstance;
    component.transactionType = {
      scheduleId: '',
      componentGroupId: '',
      contributionPurposeDescripReadonly: () => '',
      getNewTransaction: () => {
        return {} as Transaction;
      },
      title: '',
      parent: undefined,
      schema: OFFSET_TO_OPEX,
      transaction: transaction,
    } as TransactionType;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset form values when the entity_type changes', () => {
    component.form.patchValue({
      contributor_organization_name: 'org name',
      contributor_last_name: 'last name',
      contributor_first_name: 'first name',
    });
    component.form.patchValue({
      entity_type: ContactTypes.INDIVIDUAL,
    });
    expect(component.form.get('contributor_organization_name')?.value).toBe(null);
    expect(component.form.get('contributor_last_name')?.value).toBe('last name');
    expect(component.form.get('contributor_first_name')?.value).toBe('first name');

    component.form.patchValue({
      contributor_organization_name: 'org name',
      contributor_last_name: 'last name',
      contributor_first_name: 'first name',
    });
    component.form.patchValue({
      entity_type: ContactTypes.ORGANIZATION,
    });
    expect(component.form.get('contributor_organization_name')?.value).toBe('org name');
    expect(component.form.get('contributor_last_name')?.value).toBe(null);
    expect(component.form.get('contributor_first_name')?.value).toBe(null);
  });

  it('#save() should save a new record', () => {
    if (component.transaction) {
      component.transaction.id = undefined;
    }
    component.form.patchValue({ ...transaction });
    component.save('list');
    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/sch-a-transactions/?schema=OFFSET_TO_OPEX&fields_to_validate=form_type,filer_committee_id_number,transaction_type_identifier,back_reference_tran_id_number,back_reference_sched_name,entity_type,contributor_organization_name,contributor_last_name,contributor_first_name,contributor_middle_name,contributor_prefix,contributor_suffix,contributor_street_1,contributor_street_2,contributor_city,contributor_state,contributor_zip,contribution_date,contribution_amount,contribution_aggregate,contribution_purpose_descrip,memo_code,memo_text_description`
    );
    expect(req.request.method).toEqual('POST');
    httpTestingController.verify();
  });

  it('#save() should update an existing record', () => {
    if (component.transaction) {
      component.transaction.id = '10';
    }
    component.form.patchValue({ ...transaction });
    component.save('add another');
    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/sch-a-transactions/10/?schema=OFFSET_TO_OPEX&fields_to_validate=form_type,filer_committee_id_number,transaction_type_identifier,back_reference_tran_id_number,back_reference_sched_name,entity_type,contributor_organization_name,contributor_last_name,contributor_first_name,contributor_middle_name,contributor_prefix,contributor_suffix,contributor_street_1,contributor_street_2,contributor_city,contributor_state,contributor_zip,contribution_date,contribution_amount,contribution_aggregate,contribution_purpose_descrip,memo_code,memo_text_description`
    );
    expect(req.request.method).toEqual('PUT');
    httpTestingController.verify();
  });

  it('#save() should not save an invalid record', () => {
    component.form.patchValue({ ...transaction, ...{ contributor_state: 'not-valid' } });
    component.save('list');
    expect(component.form.invalid).toBe(true);
    httpTestingController.expectNone(
      `${environment.apiUrl}/sch-a-transactions/1/?schema=OFFSET_TO_OPEX&fields_to_validate=`
    );
    httpTestingController.verify();
  });
});
