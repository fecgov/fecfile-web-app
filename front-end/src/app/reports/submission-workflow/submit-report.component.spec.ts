import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Form3X, Report } from 'app/shared/models/';
import { ApiService, QueryParams } from 'app/shared/services/api.service';
import { ReportService } from 'app/shared/services/report.service';
import { testCommitteeAccount, testMockStore } from 'app/shared/utils/unit-test.utils';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { Confirmation, ConfirmationService, MessageService, SharedModule } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { RadioButtonModule } from 'primeng/radiobutton';
import { BehaviorSubject } from 'rxjs';
import { F3X_ROUTES } from '../f3x/routes';
import { SubmitReportComponent } from './submit-report.component';

const routeDataSubject = new BehaviorSubject<{
  report: Report;
  getBackUrl: (report?: Report) => string;
  getContinueUrl: (report?: Report) => string;
}>({
  report: Form3X.fromJSON({
    report_code: 'Q1',
    id: '999',
  }),
  getBackUrl: (report?: Report) => '/reports/f3x/memo/' + report?.id,
  getContinueUrl: (report?: Report) => '/reports/f3x/submit/status/' + report?.id,
});

const routeMock = {
  data: routeDataSubject.asObservable(),
  snapshot: {
    params: {
      reportId: '999',
    },
  },
};

describe('SubmitReportComponent', () => {
  let router: Router;
  let component: SubmitReportComponent;
  let fixture: ComponentFixture<SubmitReportComponent>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockStore: MockStore;

  beforeEach(async () => {
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        DividerModule,
        CheckboxModule,
        RadioButtonModule,
        SharedModule,
        SubmitReportComponent,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        FormBuilder,
        provideRouter(F3X_ROUTES),
        provideMockStore(testMockStore()),
        { provide: MessageService, useValue: mockMessageService },
        ConfirmationService,
        ApiService,
        ReportService,
        {
          provide: ActivatedRoute,
          useValue: routeMock,
        },
      ],
    }).compileComponents();

    mockStore = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(SubmitReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with proper controls', () => {
    expect(component.form.contains('treasurer_first_name')).toBeTrue();
    expect(component.form.contains('filingPassword')).toBeTrue();
    expect(component.form.controls['filingPassword'].hasValidator(Validators.required)).toBeTrue();
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

  it('should remove address fields when change_of_address is not true', () => {
    component.form.get('change_of_address')?.setValue(true);
    expect(component.form.get('street_1')?.hasValidator(Validators.required)).toBeTrue();
    expect(component.form.get('city')?.hasValidator(Validators.required)).toBeTrue();
    expect(component.form.get('state')?.hasValidator(Validators.required)).toBeTrue();
    expect(component.form.get('zip')?.hasValidator(Validators.required)).toBeTrue();

    component.form.get('change_of_address')?.setValue(false);
    expect(component.form.get('street_1')?.hasValidator(Validators.required)).toBeFalse();
    expect(component.form.get('city')?.hasValidator(Validators.required)).toBeFalse();
    expect(component.form.get('state')?.hasValidator(Validators.required)).toBeFalse();
    expect(component.form.get('zip')?.hasValidator(Validators.required)).toBeFalse();
  });

  it('should remove address fields when change_of_address is not true', () => {
    component.form.get('change_of_address')?.setValue(true);
    expect(component.form.get('street_1')?.hasValidator(Validators.required)).toBeTrue();
    expect(component.form.get('city')?.hasValidator(Validators.required)).toBeTrue();
    expect(component.form.get('state')?.hasValidator(Validators.required)).toBeTrue();
    expect(component.form.get('zip')?.hasValidator(Validators.required)).toBeTrue();

    component.form.get('change_of_address')?.setValue(false);
    expect(component.form.get('street_1')?.hasValidator(Validators.required)).toBeFalse();
    expect(component.form.get('city')?.hasValidator(Validators.required)).toBeFalse();
    expect(component.form.get('state')?.hasValidator(Validators.required)).toBeFalse();
    expect(component.form.get('zip')?.hasValidator(Validators.required)).toBeFalse();
  });

  it('should not submit when form is invalid', async () => {
    spyOn(component, 'saveAndSubmit');
    component.form.patchValue({ filingPassword: '', userCertified: false });
    component.submitForm();
    expect(component.saveAndSubmit).not.toHaveBeenCalled();
  });

  it('#updateReport should uses form address when change_of_address is true', async () => {
    const testReport = new Form3X();
    testReport.street_1 = 'test_street_1';
    testReport.street_2 = 'test_street_2';
    testReport.city = 'test_city';
    testReport.state = 'AL';
    testReport.zip = '12345';

    component.form.patchValue({
      change_of_address: true,
      street_1: 'new_street_1',
      street_2: 'new_street_2',
      city: 'new_city',
      state: 'NY',
      zip: '54321',
    });
    component.form.updateValueAndValidity();

    TestBed.inject(MockStore).overrideSelector(selectActiveReport, testReport);
    TestBed.inject(MockStore).refreshState();
    const reportServiceUpdateSpy = spyOn(component.reportService, 'update').and.callFake((payload, formProperties) => {
      return payload;
    });

    const retval = await component.updateReport();
    expect(reportServiceUpdateSpy).toHaveBeenCalled();
    expect(retval?.street_1).toEqual(component.form.value.street_1);
    expect(retval?.street_2).toEqual(component.form.value.street_2);
    expect(retval?.city).toEqual(component.form.value.city);
    expect(retval?.state).toEqual(component.form.value.state);
    expect(retval?.zip).toEqual(component.form.value.zip);
  });

  it('#updateReport should uses report address when change_of_address is false', async () => {
    const testReport = new Form3X();
    testReport.street_1 = 'test_street_1';
    testReport.street_2 = 'test_street_2';
    testReport.city = 'test_city';
    testReport.state = 'AL';
    testReport.zip = '12345';

    component.form.patchValue({
      change_of_address: false,
      street_1: 'new_street_1',
      street_2: 'new_street_2',
      city: 'new_city',
      state: 'NY',
      zip: '54321',
    });
    component.form.updateValueAndValidity();

    TestBed.inject(MockStore).overrideSelector(selectActiveReport, testReport);
    TestBed.inject(MockStore).refreshState();
    const reportServiceUpdateSpy = spyOn(component.reportService, 'update').and.callFake((payload, formProperties) => {
      return payload;
    });

    const retval = await component.updateReport();
    expect(reportServiceUpdateSpy).toHaveBeenCalled();
    expect(retval?.street_1).toEqual(testReport.street_1);
    expect(retval?.street_2).toEqual(testReport.street_2);
    expect(retval?.city).toEqual(testReport.city);
    expect(retval?.state).toEqual(testReport.state);
    expect(retval?.zip).toEqual(testReport.zip);
  });

  it('#updateReport should uses committee address when change_of_address is false and report address not populated', async () => {
    const testReport = new Form3X();
    testReport.street_1 = undefined;
    testReport.street_2 = undefined;
    testReport.city = undefined;
    testReport.state = undefined;
    testReport.zip = undefined;

    component.form.patchValue({
      change_of_address: false,
      street_1: 'new_street_1',
      street_2: 'new_street_2',
      city: 'new_city',
      state: 'NY',
      zip: '54321',
    });
    component.form.updateValueAndValidity();

    TestBed.inject(MockStore).overrideSelector(selectActiveReport, testReport);
    TestBed.inject(MockStore).refreshState();
    const reportServiceUpdateSpy = spyOn(component.reportService, 'update').and.callFake((payload, formProperties) => {
      return payload;
    });

    const retval = await component.updateReport();
    const testCommitteeAccountObject = testCommitteeAccount();
    expect(reportServiceUpdateSpy).toHaveBeenCalled();
    expect(retval?.street_1).toEqual(testCommitteeAccountObject.street_1);
    expect(retval?.street_2).toEqual(testCommitteeAccountObject.street_2);
    expect(retval?.city).toEqual(testCommitteeAccountObject.city);
    expect(retval?.state).toEqual(testCommitteeAccountObject.state);
    expect(retval?.zip).toEqual(testCommitteeAccountObject.zip);
  });

  describe('saveAndSubmit', () => {
    let confirmSpy: jasmine.Spy<(confirmation: Confirmation) => ConfirmationService>;
    let updateReport: jasmine.Spy<() => Promise<Report | undefined>>;
    let submitSpy: jasmine.Spy<() => Promise<boolean>>;
    let reportSpy: jasmine.Spy<(report: Report, fieldsToValidate?: string[]) => Promise<Report>>;
    let apiSpy: jasmine.Spy<{
      <T>(endpoint: string, payload: unknown, queryParams?: QueryParams): Promise<T>;
      <T>(
        endpoint: string,
        payload: unknown,
        queryParams?: QueryParams,
        allowedErrorCodes?: number[],
      ): Promise<HttpResponse<T>>;
    }>;
    const mockPassword = '12345aA!';

    beforeEach(() => {
      confirmSpy = spyOn(component.confirmationService, 'confirm').and.callFake((confirmation: Confirmation) => {
        if (confirmation.accept) confirmation.accept();
        return component.confirmationService;
      });
      updateReport = spyOn(component, 'updateReport').and.callThrough();
      submitSpy = spyOn(component, 'submitReport').and.callThrough();
      reportSpy = spyOn(component.reportService, 'update').and.returnValue(Promise.resolve(new Form3X()));
      apiSpy = spyOn(component.apiService, 'post').and.returnValue(Promise.resolve(new HttpResponse()));

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

    it('should call saveAndSubmit when form is valid', async () => {
      const saveSpy = spyOn(component, 'saveAndSubmit').and.callThrough();
      const navSpy = spyOn(router, 'navigateByUrl').and.callThrough();

      await component.submitForm();

      expect(component.form.invalid).toBeFalse();
      expect(confirmSpy).toHaveBeenCalled();
      expect(saveSpy).toHaveBeenCalled();
      expect(updateReport).toHaveBeenCalled();
      expect(reportSpy).toHaveBeenCalled();
      expect(submitSpy).toHaveBeenCalled();
      expect(apiSpy).toHaveBeenCalledWith('/web-services/submit-to-fec/', {
        report_id: '999',
        password: mockPassword,
        backdoor_code: undefined,
      });
      fakeAsync(() => {
        tick(100);
        expect(navSpy).toHaveBeenCalledWith('/reports/f3x/submit/status/999');
      });
    });
  });
});
