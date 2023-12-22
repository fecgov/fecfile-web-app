import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Form3X } from 'app/shared/models/form-3x.model';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, MessageService, SharedModule } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { RadioButtonModule } from 'primeng/radiobutton';
import { of } from 'rxjs';
import { SubmitReportStep2Component } from './submit-report-step2.component';
import { ReportService } from 'app/shared/services/report.service';
import { ApiService } from 'app/shared/services/api.service';
import { ReportsModule } from '../reports.module';

describe('SubmitReportStep2Component', () => {
  let component: SubmitReportStep2Component;
  let fixture: ComponentFixture<SubmitReportStep2Component>;
  let reportService: ReportService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        DividerModule,
        CheckboxModule,
        RadioButtonModule,
        SharedModule,
        ReportsModule,
      ],
      declarations: [SubmitReportStep2Component],
      providers: [
        FormBuilder,
        ReportService,
        MessageService,
        ConfirmationService,
        ReportService,
        ApiService,
        provideMockStore(testMockStore),
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              report: Form3X.fromJSON({
                report_code: 'Q1',
                id: '999',
              }),
            }),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    reportService = TestBed.inject(ReportService);
    fixture = TestBed.createComponent(SubmitReportStep2Component);
    component = fixture.componentInstance;
    spyOn(reportService, 'get').and.returnValue(of(Form3X.fromJSON({ id: '999' })));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
