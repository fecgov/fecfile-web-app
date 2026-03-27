import type { Mock } from 'vitest';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Form3X, Report } from 'app/shared/models/';
import { ApiService } from 'app/shared/services/api.service';
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

  beforeEach(async () => {
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
        MessageService,
        ConfirmationService,
        ApiService,
        ReportService,
        {
          provide: ActivatedRoute,
          useValue: routeMock,
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(SubmitReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with proper controls', () => {
    expect(component.form.contains('treasurer_first_name')).toBe(true);
    expect(component.form.contains('filingPassword')).toBe(true);
    expect(component.form.controls['filingPassword'].hasValidator(Validators.required)).toBe(true);
  });

  it('should add backdoor_code control when backdoorYesNo is true', () => {
    component.form.get('backdoorYesNo')?.setValue(true);
    expect(component.form.contains('backdoor_code')).toBe(true);
  });

  it('should remove backdoor_code control when backdoorYesNo is false', () => {
    component.form.get('backdoorYesNo')?.setValue(true);
    component.form.get('backdoorYesNo')?.setValue(false);
    expect(component.form.contains('backdoor_code')).toBe(false);
  });

  it('should toggle address fields validation on change_of_address toggle', () => {
    component.form.get('change_of_address')?.setValue(true);
    expect(component.form.get('street_1')?.hasValidator(Validators.required)).toBe(true);
    expect(component.form.get('city')?.hasValidator(Validators.required)).toBe(true);
    expect(component.form.get('state')?.hasValidator(Validators.required)).toBe(true);
    expect(component.form.get('zip')?.hasValidator(Validators.required)).toBe(true);

    component.form.get('change_of_address')?.setValue(false);
    expect(component.form.get('street_1')?.hasValidator(Validators.required)).toBe(false);
    expect(component.form.get('city')?.hasValidator(Validators.required)).toBe(false);
    expect(component.form.get('state')?.hasValidator(Validators.required)).toBe(false);
    expect(component.form.get('zip')?.hasValidator(Validators.required)).toBe(false);
  });

  it('should not submit when form is invalid', async () => {
    vi.spyOn(component, 'saveAndSubmit');
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
    const reportServiceUpdateSpy = vi.spyOn(component.reportService, 'update').mockImplementation((payload) => {
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

  it('#updateReport should use committee address when change_of_address is false', async () => {
    const testReport = new Form3X();

    component.form.patchValue({
      change_of_address: false,
    });
    component.form.updateValueAndValidity();

    TestBed.inject(MockStore).overrideSelector(selectActiveReport, testReport);
    TestBed.inject(MockStore).refreshState();
    const reportServiceUpdateSpy = vi.spyOn(component.reportService, 'update').mockImplementation((payload) => {
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
    let confirmSpy: Mock;
    let updateReport: Mock;
    let submitSpy: Mock;
    let reportSpy: Mock;
    let apiSpy: Mock;
    const mockPassword = '12345aA!';

    beforeEach(() => {
      confirmSpy = vi
        .spyOn(component.confirmationService, 'confirm')
        .mockImplementation((confirmation: Confirmation) => {
          if (confirmation.accept) confirmation.accept();
          return component.confirmationService;
        });
      updateReport = vi.spyOn(component, 'updateReport');
      submitSpy = vi.spyOn(component, 'submitReport');
      reportSpy = vi.spyOn(component.reportService, 'update').mockReturnValue(Promise.resolve(new Form3X()));
      apiSpy = vi.spyOn(component.apiService, 'post').mockReturnValue(Promise.resolve(new HttpResponse()));

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
      const saveSpy = vi.spyOn(component, 'saveAndSubmit');
      const navSpy = vi.spyOn(router, 'navigateByUrl');

      await component.submitForm();

      expect(component.form.invalid).toBe(false);
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
      fixture.detectChanges();
      await fixture.whenStable();
      expect(navSpy).toHaveBeenCalledWith('/reports/f3x/submit/status/999');
    });
  });
});
