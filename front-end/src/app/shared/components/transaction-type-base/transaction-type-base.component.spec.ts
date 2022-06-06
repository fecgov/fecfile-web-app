import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { selectUserLoginData } from '../../../store/login.selectors';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TransactionService } from 'app/shared/services/transaction.service';
import { ValidateService } from 'app/shared/services/validate.service';
import { UserLoginData } from 'app/shared/models/user.model';
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
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestTransactionTypeBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
