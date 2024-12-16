import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, QueryParams } from 'app/shared/services/api.service';
import { ReportService } from 'app/shared/services/report.service';
import { Confirmation, ConfirmationService, MessageService, SharedModule } from 'primeng/api';
import { Observable, of } from 'rxjs';
import { SubmitReportStep2Component } from './submit-report-step2.component';
import { provideMockStore } from '@ngrx/store/testing';
import { Form3X } from 'app/shared/models/form-3x.model';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ReportsModule } from '../reports.module';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { Report } from 'app/shared/models/report.model';

describe('SubmitReportStep2Component', () => {
  let component: SubmitReportStep2Component;
  let fixture: ComponentFixture<SubmitReportStep2Component>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockMessageService: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      declarations: [SubmitReportStep2Component],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        DividerModule,
        CheckboxModule,
        RadioButtonModule,
        SharedModule,
        ReportsModule,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        FormBuilder,
        { provide: Router, useValue: mockRouter },
        provideMockStore(testMockStore),
        { provide: MessageService, useValue: mockMessageService },
        ConfirmationService,
        ApiService,
        ReportService,
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

    fixture = TestBed.createComponent(SubmitReportStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with proper controls', () => {
    expect(component.form.contains('treasurer_first_name')).toBeTrue();
    expect(component.form.contains('filingPassword')).toBeTrue();
    expect(component.form.controls['filingPassword'].hasValidator(Validators.required)).toBeFalse();
  });

  it('should add backdoor_code control when backdoorYesNo is true', () => {
    component.form.get('backdoorYesNo')?.setValue(true);
    expect(component.form.contains('backdoor_code')).toBeTrue();
  });

  it('should remove backdoor_code control when backdoorYesNo is false', () => {
    component.form.get('backdoorYesNo')?.setValue(true);
    component.form.get('backdoorYesNo')?.setValue(false);
    expect(component.form.contains('backdoor_code')).toBeFalse();
  });

  it('should not submit when form is invalid', async () => {
    spyOn(component, 'saveAndSubmit');
    component.form.patchValue({ filingPassword: '', userCertified: false });
    component.submitClicked();
    expect(component.saveAndSubmit).not.toHaveBeenCalled();
  });

  describe('saveAndSubmit', () => {
    let confirmSpy: jasmine.Spy<(confirmation: Confirmation) => ConfirmationService>;
    let saveTreasurerSpy: jasmine.Spy<() => Promise<Report | undefined>>;
    let submitSpy: jasmine.Spy<() => Promise<boolean>>;
    let reportSpy: jasmine.Spy<(report: Report, fieldsToValidate?: string[]) => Observable<Report>>;
    let apiSpy: jasmine.Spy<{
      <T>(endpoint: string, payload: unknown, queryParams?: QueryParams): Observable<T>;
      <T>(
        endpoint: string,
        payload: unknown,
        queryParams?: QueryParams,
        allowedErrorCodes?: number[],
      ): Observable<HttpResponse<T>>;
    }>;
    const mockPassword = '12345aA!';

    beforeEach(() => {
      confirmSpy = spyOn(component.confirmationService, 'confirm').and.callFake((confirmation: Confirmation) => {
        if (confirmation.accept) confirmation.accept();
        return component.confirmationService;
      });
      saveTreasurerSpy = spyOn(component, 'saveTreasurerName').and.callThrough();
      submitSpy = spyOn(component, 'submitReport').and.callThrough();
      reportSpy = spyOn(component.reportService, 'update').and.returnValue(of(new Form3X()));
      apiSpy = spyOn(component.apiService, 'post').and.returnValue(of(new HttpResponse()));

      component.form.patchValue({
        treasurer_name_1: 'name1',
        treasurer_name_2: 'name2',
        treasurer_name_middle: 'm',
        treasurer_name_prefix: 'pre.',
        treasurer_name_suffix: 'suf',
        filingPassword: mockPassword,
        userCertified: true,
      });
    });

    it('should call saveAndSubmit when form is valid', fakeAsync(async () => {
      if (component.report) component.report.id = '999';
      component.getContinueUrl = () => `/reports/f3x/submit/status/999/`;
      const saveSepy = spyOn(component, 'saveAndSubmit').and.callThrough();

      component.submitClicked();
      tick(100);
      expect(component.form.invalid).toBeFalse();
      expect(confirmSpy).toHaveBeenCalled();
      expect(saveSepy).toHaveBeenCalled();
      expect(saveTreasurerSpy).toHaveBeenCalled();
      expect(reportSpy).toHaveBeenCalled();
      expect(submitSpy).toHaveBeenCalled();
      expect(apiSpy).toHaveBeenCalledWith('/web-services/submit-to-fec/', {
        report_id: '999',
        password: mockPassword,
        backdoor_code: undefined,
      });
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/reports/f3x/submit/status/999/');
    }));
  });
});
