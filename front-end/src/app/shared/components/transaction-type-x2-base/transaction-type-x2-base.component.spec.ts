import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TransactionType } from 'app/shared/interfaces/transaction-type.interface';
import { Transaction } from 'app/shared/interfaces/transaction.interface';
import { Contact, ContactTypes } from 'app/shared/models/contact.model';
import { TransactionService } from 'app/shared/services/transaction.service';
import { ValidateService } from 'app/shared/services/validate.service';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { Message, MessageService, SelectItem } from 'primeng/api';
import { of } from 'rxjs';
import { TransactionTypeX2BaseComponent } from './transaction-type-x2-base.component';

class TestTransactionTypeX2BaseComponent extends TransactionTypeX2BaseComponent {
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
    'contributor_employer',
    'contributor_occupation',
    'contribution_date',
    'contribution_amount',
    'contribution_aggregate',
    'contribution_purpose_descrip',
    'memo_code',
    'memo_text_description',
  ];

  childFormProperties: string[] = [
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
    'contributor_employer',
    'contributor_occupation',
    'contribution_date',
    'contribution_amount',
    'contribution_aggregate',
    'contribution_purpose_descrip',
    'memo_code',
    'memo_text_description',
  ];
}

const testTransaction = {
  id: '123',
  report_id: '999',
  form_type: null,
  filer_committee_id_number: null,
  transaction_id: null,
  transaction_type_identifier: 'test',
  contribution_purpose_descrip: null,
  parent_transaction_id: null,
};

describe('TransactionTypeBaseComponent', () => {
  let component: TestTransactionTypeX2BaseComponent;
  let fixture: ComponentFixture<TestTransactionTypeX2BaseComponent>;
  let testMessageService: MessageService;
  let testRouter: Router;
  let testTransactionService: TransactionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestTransactionTypeX2BaseComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [MessageService, FormBuilder, ValidateService, TransactionService, provideMockStore(testMockStore)],
    }).compileComponents();

    testMessageService = TestBed.inject(MessageService);
    testRouter = TestBed.inject(Router);
    testTransactionService = TestBed.inject(TransactionService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestTransactionTypeX2BaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
