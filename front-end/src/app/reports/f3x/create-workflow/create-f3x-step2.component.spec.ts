import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { MessageService, SharedModule } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { UserLoginData } from 'app/shared/models/user.model';
import { CreateF3xStep2Component } from './create-f3x-step2.component';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { environment } from '../../../../environments/environment';
import { CommitteeAccount } from '../../../shared/models/committee-account.model';
import { selectUserLoginData } from 'app/store/login.selectors';
import { selectCommitteeAccount } from '../../../store/committee-account.selectors';
import { ValidateService } from '../../../shared/services/validate.service';
import { F3xSummaryService } from '../../../shared/services/f3x-summary.service';
import { ReportsModule } from '../../reports.module';

describe('CreateF3xStep2Component', () => {
  let component: CreateF3xStep2Component;
  let fixture: ComponentFixture<CreateF3xStep2Component>;
  let router: Router;
  let httpTestingController: HttpTestingController;
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
      declarations: [CreateF3xStep2Component],
      providers: [
        ValidateService,
        FormBuilder,
        F3xSummaryService,
        MessageService,
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
                report: F3xSummary.fromJSON({}),
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
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(CreateF3xStep2Component);
    component = fixture.componentInstance;
    spyOn(reportService, 'get').and.returnValue(of(F3xSummary.fromJSON({})));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#save should go back when back button clicked', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.report = F3xSummary.fromJSON({
      id: '999',
    });
    component.form.patchValue({ change_of_address: true });

    component.save('back');
    let req = httpTestingController.expectOne(
      `${environment.apiUrl}/f3x-summaries/${component.report.id}/?fields_to_validate=change_of_address,street_1,street_2,city,state,zip,memo_checkbox,memo`
    );
    expect(req.request.method).toEqual('PUT');
    req.flush(component.report);
    expect(navigateSpy).toHaveBeenCalledWith('/reports');

    navigateSpy.calls.reset();
    component.save('continue');
    req = httpTestingController.expectOne(
      `${environment.apiUrl}/f3x-summaries/${component.report.id}/?fields_to_validate=change_of_address,street_1,street_2,city,state,zip,memo_checkbox,memo`
    );
    expect(req.request.method).toEqual('PUT');
    req.flush(component.report);
    expect(navigateSpy).toHaveBeenCalledWith('/reports');
  });

  it('#save should not save when form data invalid', () => {
    component.report = F3xSummary.fromJSON({
      id: '999',
      change_of_address: 'A',
      street_1: '123 Main St',
      street_2: 'Apt A',
      city: 'Washington',
      state: 'DC',
      zip: '20001',
    });
    fixture.detectChanges();
    component.form.patchValue({
      id: '999',
      change_of_address: 'A',
      street_1: '123 Main St',
      street_2: 'Apt A',
      city: 'Washington',
      state: 'DC',
      zip: '20001',
    });

    component.save();
    expect(component.form.invalid).toBe(true);
  });
});
