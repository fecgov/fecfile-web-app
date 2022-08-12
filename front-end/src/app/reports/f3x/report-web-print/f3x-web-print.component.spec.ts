import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { selectReportCodeLabelList } from 'app/store/label-lookup.selectors';
import { ActivatedRoute, Router } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { SharedModule } from 'app/shared/shared.module';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ReportWebPrintComponent } from './f3x-web-print.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommitteeAccount } from '../../../shared/models/committee-account.model';
import { UserLoginData } from '../../../shared/models/user.model';
import { selectCommitteeAccount } from '../../../store/committee-account.selectors';
import { selectUserLoginData } from 'app/store/login.selectors';
import { F3xSummaryService } from '../../../shared/services/f3x-summary.service';
import { of } from 'rxjs';
import { selectActiveReport } from '../../../store/active-report.selectors';
import { WebPrintService } from '../../../shared/services/web-print.service';

describe('ReportWebPrintComponent', () => {
  let component: ReportWebPrintComponent;
  let fixture: ComponentFixture<ReportWebPrintComponent>;
  let reportService: F3xSummaryService;
  let webPrintService: WebPrintService;
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
    webprint_submission: {
      fec_email: "test@test.com",
      fec_batch_id: "1234",
      fec_image_url: "image.test.com",
      fec_submission_id: "FEC-1234567",
      fec_message: "Message Goes Here",
      fec_status: "COMPLETED",
      fecfile_error: "",
      fecfile_task_state:"COMPLETED",
      id: 0,
      created: "10/10/2010",
      updated: "10/12/2010",
    }
  });

  beforeEach(() => {
    
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        DividerModule,
        SharedModule,
      ],
      declarations: [ReportWebPrintComponent],
      providers: [
        provideMockStore({
          initialState: {
            fecfile_online_committeeAccount: committeeAccount,
            fecfile_online_userLoginData: userLoginData,
          },
          selectors: [
            { selector: selectCommitteeAccount, value: committeeAccount },
            { selector: selectUserLoginData, value: userLoginData },
            { selector: selectActiveReport, value: f3x },
          ],
        }),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                report: f3x
              },
            },
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ReportWebPrintComponent);
    TestBed.inject(Router);
    reportService = TestBed.inject(F3xSummaryService);
    webPrintService = TestBed.inject(WebPrintService);
    component = fixture.componentInstance;
    spyOn(reportService, 'get').and.returnValue(of(F3xSummary.fromJSON({})));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Sets the status messages as expected', ()=>{
    component.pollPrintStatus();
    expect(component.pollingStatusMessage).toBe("This may take a while...");
  });

  it('refreshes the active report', ()=>{
    const refresh = spyOn(webPrintService, 'getStatus');
    component.refreshReportStatus();
    expect(refresh).toHaveBeenCalled();
  });

  it('#submitPrintJob() calls the service', ()=>{
    const submit = spyOn(webPrintService, "submitPrintJob");
    component.submitPrintJob();
    expect(submit).toHaveBeenCalled();
  })
});
