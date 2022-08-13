import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { MessageService, SharedModule, ConfirmationService } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { UserLoginData } from 'app/shared/models/user.model';
import { SubmitF3xStep2Component } from './submit-f3x-step2.component';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { CommitteeAccount } from '../../../shared/models/committee-account.model';
import { selectUserLoginData } from 'app/store/login.selectors';
import { selectCommitteeAccount } from '../../../store/committee-account.selectors';
import { ValidateService } from '../../../shared/services/validate.service';
import { F3xSummaryService } from '../../../shared/services/f3x-summary.service';
import { ReportsModule } from '../../reports.module';

describe('SubmitF3xStep2Component', () => {
  let component: SubmitF3xStep2Component;
  let fixture: ComponentFixture<SubmitF3xStep2Component>;
  let router: Router;
  let reportService: F3xSummaryService;
  const committeeAccount: CommitteeAccount = CommitteeAccount.fromJSON({});

  beforeEach(async () => {
    const userLoginData: UserLoginData = {
      committee_id: 'C00000000',
      email: 'email@fec.com',
      is_allowed: true,
      token: 'jwttokenstring',
    };
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
        ValidateService,
        FormBuilder,
        F3xSummaryService,
        MessageService,
        ConfirmationService,
        provideMockStore({
          initialState: {
            fecfile_online_committeeAccount: committeeAccount,
            fecfile_online_userLoginData: userLoginData,
          },
          selectors: [
            { selector: selectCommitteeAccount, value: committeeAccount },
            { selector: selectUserLoginData, value: userLoginData },
          ],
        }),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                report: F3xSummary.fromJSON({
                  report_code: 'Q1',
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
    reportService = TestBed.inject(F3xSummaryService);
    fixture = TestBed.createComponent(SubmitF3xStep2Component);
    component = fixture.componentInstance;
    spyOn(reportService, 'get').and.returnValue(of(F3xSummary.fromJSON({})));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should set the default form values with the committee's values", () => {
    component.report = F3xSummary.fromJSON({});
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

    component.report = F3xSummary.fromJSON({
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

    component.report = F3xSummary.fromJSON({
      treasurer_first_name: 'Required',
      treasurer_last_name: 'Fields',
    });

    component.setDefaultFormValues(testCommitteeAccount);
    expect(component.form.value['treasurer_first_name']).toBe('Required');
    expect(component.form.value['treasurer_last_name']).toBe('Fields');
    expect(component.form.value['treasurer_middle_name']).toBe(null);
    expect(component.form.value['treasurer_prefix']).toBe(null);
    expect(component.form.value['treasurer_suffix']).toBe(null);
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
    component.report = F3xSummary.fromJSON({
      id: 999,
      treasurer_last_name: 'McTest',
      treasurer_first_name: 'Test',
    });
    component.form.patchValue({
      treasurer_last_name: 'McTest',
      treasurer_first_name: 'Test',
    });

    expect(component.treasurerNameChanged()).toBe(false);

    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.onConfirm();
    setTimeout(() => {
      expect(navigateSpy).toHaveBeenCalledWith(`/reports/submit/status/999`);
    }, 5000);
  });

  it('#submit should not submit when form data invalid', () => {
    component.report = F3xSummary.fromJSON({
      id: '999',
    });
    component.setDefaultFormValues({
      street_1: '3 Oak St',
      street_2: null,
      city: 'Pheonix',
      state: 'AZ',
      zip: '12345',
    } as CommitteeAccount);

    component.submit();
    expect(component.form.invalid).toBe(true);
  });
});
