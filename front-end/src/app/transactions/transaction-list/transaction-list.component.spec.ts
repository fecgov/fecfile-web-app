import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { SchATransaction } from 'app/shared/models/scha-transaction.model';
import { UserLoginData } from 'app/shared/models/user.model';
import { TransactionService } from 'app/shared/services/transaction.service';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { selectUserLoginData } from 'app/store/login.selectors';
import { ConfirmationService, MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { RouterTestingModule } from '@angular/router/testing';

import { TransactionListComponent } from './transaction-list.component';

describe('CreateF3xStep4Component', () => {
  let component: TransactionListComponent;
  let fixture: ComponentFixture<TransactionListComponent>;
  const committeeAccount: CommitteeAccount = CommitteeAccount.fromJSON({});

  beforeEach(async () => {
    const userLoginData: UserLoginData = {
      committee_id: 'C00000000',
      email: 'email@fec.com',
      is_allowed: true,
      token: 'jwttokenstring',
    };
    await TestBed.configureTestingModule({
      imports: [ToolbarModule, TableModule, RouterTestingModule],
      declarations: [TransactionListComponent],
      providers: [
        MessageService,
        ConfirmationService,
        provideMockStore({
          initialState: {
            fecfile_online_committeeAccount: committeeAccount,
            fecfile_online_userLoginData: userLoginData,
          },
          selectors: [
            { selector: selectCommitteeAccount, value: committeeAccount },
            { selector: selectUserLoginData, value: userLoginData },
          ],
        }),
        {
          provide: TransactionService,
          useValue: {
            get: (transactionId: number) =>
              of(
                SchATransaction.fromJSON({
                  id: transactionId,
                  transaction_type_identifier: 'OFFSET_TO_OPEX',
                })
              ),
            getTableData: () => of([]),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                report: F3xSummary.fromJSON({}),
              },
              params: {
                reportId: 999,
              },
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
