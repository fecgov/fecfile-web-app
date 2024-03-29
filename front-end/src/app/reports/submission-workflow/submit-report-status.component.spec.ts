import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { Form3X } from 'app/shared/models/form-3x.model';
import { SharedModule } from 'app/shared/shared.module';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { SubmitReportStatusComponent } from './submit-report-status.component';

describe('ReportSummaryComponent', () => {
  let component: SubmitReportStatusComponent;
  let fixture: ComponentFixture<SubmitReportStatusComponent>;
  const f3x: Form3X = Form3X.fromJSON({
    id: '999',
    coverage_from_date: '2022-05-25',
    form_type: 'F3XN',
    report_code: 'Q1',
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, DividerModule, CardModule, RouterTestingModule.withRoutes([])],
      declarations: [SubmitReportStatusComponent],
      providers: [
        provideMockStore(testMockStore),
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
    fixture = TestBed.createComponent(SubmitReportStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
