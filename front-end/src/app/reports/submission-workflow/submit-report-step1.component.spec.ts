import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { Form3X } from 'app/shared/models/form-3x.model';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { MessageService, SharedModule } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { RadioButtonModule } from 'primeng/radiobutton';
import { of } from 'rxjs';
import { SubmitReportStep1Component } from './submit-report-step1.component';
import { ReportService } from 'app/shared/services/report.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('SubmitReportStep1Component', () => {
  let component: SubmitReportStep1Component;
  let fixture: ComponentFixture<SubmitReportStep1Component>;
  let reportService: ReportService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        DividerModule,
        CheckboxModule,
        RadioButtonModule,
        SharedModule,
        SubmitReportStep1Component,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        FormBuilder,
        ReportService,
        MessageService,
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
    fixture = TestBed.createComponent(SubmitReportStep1Component);
    component = fixture.componentInstance;
    spyOn(reportService, 'get').and.returnValue(Promise.resolve(Form3X.fromJSON({})));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
