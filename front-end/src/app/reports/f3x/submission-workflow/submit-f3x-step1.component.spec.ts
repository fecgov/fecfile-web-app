import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { F3xReport } from 'app/shared/models/report-types/f3x-report.model';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { MessageService, SharedModule } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { RadioButtonModule } from 'primeng/radiobutton';
import { of } from 'rxjs';
import { CommitteeAccount } from '../../../shared/models/committee-account.model';
import { F3xReportService } from '../../../shared/services/f3x-report.service';
import { ReportsModule } from '../../reports.module';
import { SubmitF3xStep1Component } from './submit-f3x-step1.component';

describe('SubmitF3xStep1Component', () => {
  let component: SubmitF3xStep1Component;
  let fixture: ComponentFixture<SubmitF3xStep1Component>;
  let reportService: F3xReportService;

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
      declarations: [SubmitF3xStep1Component],
      providers: [
        FormBuilder,
        F3xReportService,
        MessageService,
        provideMockStore(testMockStore),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                report: F3xReport.fromJSON({ report_code: 'Q1' }),
              },
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    reportService = TestBed.inject(F3xReportService);
    fixture = TestBed.createComponent(SubmitF3xStep1Component);
    component = fixture.componentInstance;
    spyOn(reportService, 'get').and.returnValue(of(F3xReport.fromJSON({})));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the default form values as expected', () => {
    component.report = F3xReport.fromJSON({});
    const testCommitteeAccount = CommitteeAccount.fromJSON({
      street_1: 'Test St',
      street_2: 'Unit 11b',
      state: 'AK',
      city: 'Testville',
      zip: '12345',
      email: 'test@committee.net',
    });

    component.setDefaultFormValues(testCommitteeAccount);
    expect(component.form.value['street_1']).toBe('Test St');
    expect(component.form.value['street_2']).toBe('Unit 11b');
    expect(component.form.value['state']).toBe('AK');
    expect(component.form.value['city']).toBe('Testville');
    expect(component.form.value['zip']).toBe('12345');
    expect(component.form.value['confirmation_email_1']).toBe('test@committee.net');

    component.report = F3xReport.fromJSON({
      street_1: 'Test Ln',
      street_2: 'Apt. 22',
      state: 'CA',
      city: 'Testopolis',
      zip: '54321',
      confirmation_email_1: 'test@report.com',
      confirmation_email_2: 'test2@report.com',
    });
    component.setDefaultFormValues(testCommitteeAccount);
    expect(component.form.value['street_1']).toBe('Test Ln');
    expect(component.form.value['street_2']).toBe('Apt. 22');
    expect(component.form.value['state']).toBe('CA');
    expect(component.form.value['city']).toBe('Testopolis');
    expect(component.form.value['zip']).toBe('54321');
    expect(component.form.value['confirmation_email_1']).toBe('test@report.com');
    expect(component.form.value['confirmation_email_2']).toBe('test2@report.com');

    component.report = F3xReport.fromJSON({
      street_1: 'Test Ln',
      state: 'CA',
      city: 'Testopolis',
      zip: '54321',
      confirmation_email_1: 'test@report.com',
    });
    component.setDefaultFormValues(testCommitteeAccount);
    expect(component.form.value['street_1']).toBe('Test Ln');
    expect(component.form.value['street_2']).toBe(undefined);
    expect(component.form.value['state']).toBe('CA');
    expect(component.form.value['city']).toBe('Testopolis');
    expect(component.form.value['zip']).toBe('54321');
    expect(component.form.value['confirmation_email_1']).toBe('test@report.com');
    expect(component.form.value['confirmation_email_2']).toBe(undefined);
  });

  it('Should build the email validator', () => {
    component.form.patchValue({
      confirmation_email_1: 'test@test.com',
      confirmation_email_2: 'test2@test.com',
    });

    const emailValidatorA = component.buildEmailValidator('confirmation_email_1');
    const emailValidatorB = component.buildEmailValidator('confirmation_email_2');
    expect(emailValidatorA).toBeTruthy();
    expect(emailValidatorB).toBeTruthy();
  });

  it('Should catch identical email errors', () => {
    component.form.patchValue({
      confirmation_email_1: 'test@test.com',
      confirmation_email_2: 'test@test.com',
    });
    expect(component.checkIdenticalEmails()).toBe(true);

    component.form.patchValue({ confirmation_email_1: 'test@test.net' });
    expect(component.checkIdenticalEmails()).toBe(false);

    component.form.patchValue({
      confirmation_email_1: '',
      confirmation_email_2: '',
    });
    expect(component.checkIdenticalEmails()).toBe(false);
  });

  it('Should catch invalid emails', () => {
    expect(component.checkInvalidEmail('test')).toBe(true);
    expect(component.checkInvalidEmail('test@')).toBe(true);
    expect(component.checkInvalidEmail('test@test')).toBe(true);
    expect(component.checkInvalidEmail('test@test.')).toBe(true);
    expect(component.checkInvalidEmail('test@test.c')).toBe(true);
    expect(component.checkInvalidEmail('test@test.com')).toBe(false);
  });

  it('#save should not save when form data invalid', () => {
    component.report = F3xReport.fromJSON({
      id: '999',
      confirmation_email_1: 'test@test.com',
      change_of_address: 'A',
      street_1: '123 Main St',
      street_2: 'Apt A',
      city: 'Washington',
      state: 'DC',
      zip: '20001',
    });
    component.setDefaultFormValues({
      street_1: '3 Oak St',
      city: 'Pheonix',
      state: 'AZ',
      zip: '12345',
    } as CommitteeAccount);

    component.save();
    expect(component.form.invalid).toBe(true);
  });
});
