import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Form3X } from 'app/shared/models/form-3x.model';
import { ApiService } from 'app/shared/services/api.service';
import { ReportService } from 'app/shared/services/report.service';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { Confirmation, ConfirmationService, MessageService, SharedModule } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { RadioButtonModule } from 'primeng/radiobutton';
import { of } from 'rxjs';
import { ReportsModule } from '../reports.module';
import { SubmitReportStep2Component } from './submit-report-step2.component';

describe('SubmitReportStep2Component', () => {
  let component: SubmitReportStep2Component;
  let fixture: ComponentFixture<SubmitReportStep2Component>;
  let reportService: ReportService;
  let apiService: ApiService;
  let testConfirmationService: ConfirmationService;
  let confirmSpy: jasmine.Spy;

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
    apiService = TestBed.inject(ApiService);
    fixture = TestBed.createComponent(SubmitReportStep2Component);
    component = fixture.componentInstance;

    testConfirmationService = TestBed.inject(ConfirmationService);
    component = fixture.componentInstance;
    confirmSpy = spyOn(testConfirmationService, 'confirm');
    confirmSpy.and.callFake((confirmation: Confirmation) => {
      if (confirmation.accept) return confirmation?.accept();
    });
    spyOn(reportService, 'get').and.returnValue(of(Form3X.fromJSON({ id: '999' })));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save and submti', async () => {
    component.form.patchValue({
      treasurer_name_1: 'name1',
      treasurer_name_2: 'name2',
      treasurer_name_middle: 'm',
      treasurer_name_prefix: 'pre.',
      treasurer_name_suffix: 'suf',
      filingPassword: '12345aA!',
      userCertified: true,
    });
    const updateSpy = spyOn(reportService, 'update').and.returnValue(of(Form3X.fromJSON({ id: '999' })));
    const submtiSpy = spyOn(apiService, 'post').and.returnValue(of());
    component.submitClicked();

    expect(updateSpy).toHaveBeenCalled();
    expect(submtiSpy).toHaveBeenCalled();
  });
});
