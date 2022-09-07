import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TransactionGroupFComponent } from './transaction-group-f.component';
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
import { schema as JF_TRAN_PAC_MEMO } from 'fecfile-validate/fecfile_validate_js/dist/JF_TRAN_PAC_MEMO';
import { InputNumberModule } from 'primeng/inputnumber';
import { ScheduleATransactionTypes } from '../../shared/models/scha-transaction.model';

describe('TransactionGroupFComponent', () => {
  let httpTestingController: HttpTestingController;
  let component: TransactionGroupFComponent;
  let fixture: ComponentFixture<TransactionGroupFComponent>;

  const transaction = SchATransaction.fromJSON({
    form_type: 'SA11AI',
    filer_committee_id_number: 'C00000000',
    transaction_type_identifier: ScheduleATransactionTypes.JF_TRAN_PAC_MEMO,
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
      ],
      declarations: [TransactionGroupFComponent],
      providers: [MessageService, FormBuilder, provideMockStore(testMockStore)],
    }).compileComponents();
  });

  beforeEach(() => {
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(TransactionGroupFComponent);
    component = fixture.componentInstance;
    component.schema = JF_TRAN_PAC_MEMO;
    component.transaction = transaction;
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
      `${environment.apiUrl}/sch-a-transactions/1/?schema=JF_TRAN_PAC_MEMO&fields_to_validate=`
    );
    httpTestingController.verify();
  });
});
