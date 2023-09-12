import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { F3xReport } from 'app/shared/models/report-types/f3x-report.model';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, MessageService, SharedModule } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { RadioButtonModule } from 'primeng/radiobutton';
import { of } from 'rxjs';
import { CommitteeAccount } from '../../../shared/models/committee-account.model';
import { F3xReportService } from '../../../shared/services/f3x-report.service';
import { ReportService } from '../../../shared/services/report.service';
import { ApiService } from '../../../shared/services/api.service';
import { ReportsModule } from '../../reports.module';
import { SubmitF3xStep2Component } from './submit-f3x-step2.component';

describe('SubmitF3xStep2Component', () => {
  let component: SubmitF3xStep2Component;
  let fixture: ComponentFixture<SubmitF3xStep2Component>;
  let router: Router;
  let reportService: F3xReportService;
  let apiService: ApiService;

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
      declarations: [SubmitF3xStep2Component],
      providers: [
        FormBuilder,
        F3xReportService,
        MessageService,
        ConfirmationService,
        ReportService,
        ApiService,
        provideMockStore(testMockStore),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                report: F3xReport.fromJSON({
                  report_code: 'Q1',
                  id: '999',
                }),
              },
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    router = TestBed.inject(Router);
    reportService = TestBed.inject(F3xReportService);
    fixture = TestBed.createComponent(SubmitF3xStep2Component);
    apiService = TestBed.inject(ApiService);
    component = fixture.componentInstance;
    spyOn(reportService, 'get').and.returnValue(of(F3xReport.fromJSON({ id: '999' })));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should set the default form values with the committee's values", () => {
    component.report = F3xReport.fromJSON({ id: '999' });
    const testCommitteeAccount = CommitteeAccount.fromJSON({
      treasurer_name_1: 'Test',
      treasurer_name_2: 'McTest',
      treasurer_name_middle: 'T',
      treasurer_name_prefix: 'Mr.',
      treasurer_name_suffix: 'IV',
    });

    component.setDefaultFormValues(testCommitteeAccount);
    expect(component.form.value['treasurer_first_name']).toBe('Test');
    expect(component.form.value['treasurer_last_name']).toBe('McTest');
    expect(component.form.value['treasurer_middle_name']).toBe('T');
    expect(component.form.value['treasurer_prefix']).toBe('Mr.');
    expect(component.form.value['treasurer_suffix']).toBe('IV');

    component.report = F3xReport.fromJSON({
      treasurer_first_name: 'Samantha',
      treasurer_last_name: 'Testfield',
      treasurer_middle_name: 'Antoinette',
      treasurer_prefix: 'Mrs.',
      treasurer_suffix: 'III',
    });

    component.setDefaultFormValues(testCommitteeAccount);
    expect(component.form.value['treasurer_first_name']).toBe('Samantha');
    expect(component.form.value['treasurer_last_name']).toBe('Testfield');
    expect(component.form.value['treasurer_middle_name']).toBe('Antoinette');
    expect(component.form.value['treasurer_prefix']).toBe('Mrs.');
    expect(component.form.value['treasurer_suffix']).toBe('III');

    component.report = F3xReport.fromJSON({
      treasurer_first_name: 'Required',
      treasurer_last_name: 'Fields',
    });

    component.setDefaultFormValues(testCommitteeAccount);
    expect(component.form.value['treasurer_first_name']).toBe('Required');
    expect(component.form.value['treasurer_last_name']).toBe('Fields');
    expect(component.form.value['treasurer_middle_name']).toBe(undefined);
    expect(component.form.value['treasurer_prefix']).toBe(undefined);
    expect(component.form.value['treasurer_suffix']).toBe(undefined);
  });

  it('should catch a change in the Treasurer Name', () => {
    component.form.patchValue({
      treasurer_first_name: 'Bill',
      treasurer_last_name: 'Testerson',
    });

    expect(component.treasurerNameChanged()).toBe(true);

    component.onConfirm();
  });

  it("should catch when there's no change in Treasurer Name", () => {
    component.report = F3xReport.fromJSON({
      id: '999',
      treasurer_last_name: 'McTest',
      treasurer_first_name: 'Test',
    });
    component.form.patchValue({
      treasurer_last_name: 'McTest',
      treasurer_first_name: 'Test',
    });

    expect(component.treasurerNameChanged()).toBe(false);

    const navigateSpy = spyOn(router, 'navigateByUrl').and.returnValue(Promise.resolve(true));
    spyOn(apiService, 'post').and.returnValue(of(true));
    component.onConfirm().subscribe(() => {
      expect(navigateSpy).toHaveBeenCalledWith(`/reports/f3x/submit/status/999`);
    });
  });

  it('#submit should not submit when form data invalid', () => {
    component.report = F3xReport.fromJSON({
      id: '999',
    });
    component.setDefaultFormValues({
      street_1: '3 Oak St',
      city: 'Pheonix',
      state: 'AZ',
      zip: '12345',
    } as CommitteeAccount);

    component.submit();
    expect(component.form.invalid).toBe(true);
  });
});
