import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { selectReportCodeLabelList } from 'app/store/label-lookup.selectors';
import { ActivatedRoute } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { SharedModule } from 'app/shared/shared.module';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ReportWebPrintComponent } from './f3x-web-print.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ReportWebPrintComponent', () => {
  let component: ReportWebPrintComponent;
  let fixture: ComponentFixture<ReportWebPrintComponent>;
  const f3x: F3xSummary = F3xSummary.fromJSON({
    id: 999,
    coverage_from_date: '2022-05-25',
    form_type: 'F3XN',
    report_code: 'Q1',
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, DividerModule, CardModule, RouterTestingModule.withRoutes([]), HttpClientTestingModule],
      declarations: [ReportWebPrintComponent],
      providers: [
        provideMockStore({
          selectors: [{ selector: selectReportCodeLabelList, value: {} }],
        }),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                report: f3x,
              },
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportWebPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Sets the status messages as expected', ()=>{
    component.pollPrintStatus(0, false);
    expect(component.pollingStatusMessage).toBe("This may take a while...");
    component.pollPrintStatus(0, true);
    expect(component.pollingStatusMessage).toBe("Checking Web-Print Status...");
  });
});
