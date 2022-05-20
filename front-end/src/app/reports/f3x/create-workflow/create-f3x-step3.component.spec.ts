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

import { CreateF3xStep3Component } from './create-f3x-step3.component';

describe('CreateF3xStep4Component', () => {
  let component: CreateF3xStep3Component;
  let fixture: ComponentFixture<CreateF3xStep3Component>;
  const committeeAccount: CommitteeAccount = CommitteeAccount.fromJSON({});

  beforeEach(async () => {
    const userLoginData: UserLoginData = {
      committee_id: 'C00000000',
      email: 'email@fec.com',
      is_allowed: true,
      token: 'jwttokenstring',
    };
    await TestBed.configureTestingModule({
      declarations: [CreateF3xStep3Component],
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
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                report: F3xSummary.fromJSON({}),
              },
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateF3xStep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
