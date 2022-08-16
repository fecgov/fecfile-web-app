import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { selectReportCodeLabelList } from 'app/store/label-lookup.selectors';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { provideMockStore } from '@ngrx/store/testing';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { SharedModule } from 'app/shared/shared.module';
import { CardModule } from 'primeng/card';
import { UploadSubmission } from '../../../shared/models/upload-submission.model';

import { ReportSummaryComponent } from './report-summary.component';
import { WebPrintSubmission } from '../../../shared/models/webprint-submission.model';


describe('ReportSummaryComponent', () => {
  let component: ReportSummaryComponent;
  let fixture: ComponentFixture<ReportSummaryComponent>;
  const f3x: F3xSummary = F3xSummary.fromJSON({
    id: 999,
    coverage_from_date: '2022-05-25',
    form_type: 'F3XN',
    report_code: 'Q1',
    upload_submission: UploadSubmission.fromJSON({}),
    webprint_submission: WebPrintSubmission.fromJSON({}),
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, CardModule, RouterTestingModule.withRoutes([])],
      declarations: [ReportSummaryComponent],
      providers: [
        ReportSummaryComponent,
        provideMockStore({
          selectors: [
            { selector: selectReportCodeLabelList, value: {} },
            { selector: selectActiveReport, value: f3x },
          ],
        }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
