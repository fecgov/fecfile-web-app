import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { selectCommitteeAccount } from '../../store/committee-account.selectors';
import { selectUserLoginData } from '../../store/login.selectors';
import { CommitteeAccount } from '../models/committee-account.model';
import { F3xSummary } from '../models/f3x-summary.model';
import { UserLoginData } from '../models/user.model';
import { WebPrintService } from './web-print.service';

describe('WebPrintService', () => {
  let service: WebPrintService;
  const committeeAccount: CommitteeAccount = CommitteeAccount.fromJSON({});
  const userLoginData: UserLoginData = {
    committee_id: 'C00000000',
    email: 'email@fec.com',
    is_allowed: true,
    token: 'jwttokenstring',
  };
  const f3x: F3xSummary = F3xSummary.fromJSON({
    id: 999,
    coverage_from_date: '2022-05-25',
    form_type: 'F3XN',
    report_code: 'Q1',
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        WebPrintService,
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
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                report: F3xSummary.fromJSON({
                  report_code: 'Q1',
                }),
              },
            },
          },
        },
      ],
    }).compileComponents();


    TestBed.inject(HttpTestingController);
    service = TestBed.inject(WebPrintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
