import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Transaction } from 'app/shared/interfaces/transaction.interface';
import { UserLoginData } from 'app/shared/models/user.model';
import { TransactionService } from 'app/shared/services/transaction.service';
import { ValidateService } from 'app/shared/services/validate.service';
import { Message, MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { selectUserLoginData } from '../../../store/login.selectors';
import { TransactionTypeBaseComponent } from './transaction-type-base.component';

class TestTransactionTypeBaseComponent extends TransactionTypeBaseComponent {
  formProperties: string[] = [
    'entity_type',
    'contributor_organization_name',
    'contributor_last_name',
    'contributor_first_name',
    'contributor_middle_name',
    'contributor_prefix',
    'contributor_suffix',
    'contributor_street_1',
    'contributor_street_2',
    'contributor_city',
    'contributor_state',
    'contributor_zip',
    'contribution_date',
    'contribution_amount',
    'contribution_aggregate',
    'contribution_purpose_descrip',
    'memo_code',
    'memo_text_description',
  ];
}

const userLoginData: UserLoginData = {
  committee_id: 'C00000000',
  email: 'email@fec.com',
  is_allowed: true,
  token: 'jwttokenstring',
};

describe('TransactionTypeBaseComponent', () => {
  let component: TestTransactionTypeBaseComponent;
  let fixture: ComponentFixture<TestTransactionTypeBaseComponent>;
  let testMessageService: MessageService;
  let testRouter: Router;
  let testTransactionService: TransactionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestTransactionTypeBaseComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        MessageService,
        FormBuilder,
        ValidateService,
        TransactionService,
        provideMockStore({
          initialState: { fecfile_online_userLoginData: userLoginData },
          selectors: [{ selector: selectUserLoginData, value: userLoginData }],
        }),
      ],
    }).compileComponents();

    testMessageService = TestBed.inject(MessageService);
    testRouter = TestBed.inject(Router);
    testTransactionService = TestBed.inject(TransactionService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestTransactionTypeBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#save should navigate for create', () => {
    const testTransaction: Transaction = {
      id: null,
      report_id: null,
      form_type: null,
      filer_committee_id_number: null,
      transaction_id: null,
      transaction_type_identifier: null,
      contribution_purpose_descrip: null,
      parent_transaction: null,
    };
    spyOn(testTransactionService, 'create').and.returnValue(of(testTransaction));
    const componentNavigateToSpy = spyOn(component, 'navigateTo');
    component.transaction = {
      id: null,
      report_id: null,
      form_type: null,
      filer_committee_id_number: null,
      transaction_id: null,
      transaction_type_identifier: 'test',
      contribution_purpose_descrip: null,
      parent_transaction: null,
    };

    component.save('list');
    expect(componentNavigateToSpy).toHaveBeenCalledTimes(1);
  });

  it('#save should navigate for update', () => {
    const testTransaction: Transaction = {
      id: 123,
      report_id: null,
      form_type: null,
      filer_committee_id_number: null,
      transaction_id: null,
      transaction_type_identifier: null,
      contribution_purpose_descrip: null,
      parent_transaction: null,
    };
    spyOn(testTransactionService, 'update').and.returnValue(of(testTransaction));
    const componentNavigateToSpy = spyOn(component, 'navigateTo');
    component.transaction = {
      id: 123,
      report_id: null,
      form_type: null,
      filer_committee_id_number: null,
      transaction_id: null,
      transaction_type_identifier: 'test',
      contribution_purpose_descrip: null,
      parent_transaction: null,
    };

    component.save('list');
    expect(componentNavigateToSpy).toHaveBeenCalledTimes(1);
  });

  it("#navigateTo 'add another' should show popup", () => {
    const expectedMessage: Message = {
      severity: 'success',
      summary: 'Successful',
      detail: 'Transaction Saved',
      life: 3000,
    };
    const messageServiceAddSpy = spyOn(testMessageService, 'add');
    component.navigateTo('add another');
    expect(messageServiceAddSpy).toHaveBeenCalledOnceWith(expectedMessage);
  });

  it("#navigateTo 'add-sub-tran' should show popup + navigate", () => {
    const testTransactionId = 1;
    const testTransactionTypeToAdd = 'testTransactionTypeToAdd';

    const expectedMessage: Message = {
      severity: 'success',
      summary: 'Successful',
      detail: 'Parent Transaction Saved',
      life: 3000,
    };
    const expectedRoute = `transactions/edit/` + `${testTransactionId}/create-sub-transaction/${testTransactionTypeToAdd}`;

    const messageServiceAddSpy = spyOn(testMessageService, 'add');
    const routerNavigateByUrlSpy = spyOn(testRouter, 'navigateByUrl');

    component.navigateTo('add-sub-tran', testTransactionId, testTransactionTypeToAdd);
    expect(messageServiceAddSpy).toHaveBeenCalledOnceWith(expectedMessage);
    expect(routerNavigateByUrlSpy).toHaveBeenCalledOnceWith(expectedRoute);
  });

  it("#navigateTo 'list' should navigate", () => {
    const expectedRoute = '/reports';
    const routerNavigateByUrlSpy = spyOn(testRouter, 'navigateByUrl');
    component.navigateTo('list');
    expect(routerNavigateByUrlSpy).toHaveBeenCalledOnceWith(expectedRoute);
  });
});
