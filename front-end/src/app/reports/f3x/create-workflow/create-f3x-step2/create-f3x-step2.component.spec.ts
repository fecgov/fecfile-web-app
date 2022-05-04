import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { UserLoginData } from 'app/shared/models/user.model';

import { CreateF3xStep2Component } from './create-f3x-step2.component';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { environment } from '../../../../../environments/environment';
import { CommitteeAccount } from '../../../../shared/models/committee-account.model';
import { selectCommitteeAccount } from '../../../../store/committee-account.selectors';
import { ValidateService } from '../../../../shared/services/validate.service';
import { F3xSummaryService } from '../../../../shared/services/f3x-summary.service';

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
      ],
      declarations: [CreateF3xStep2Component],
      providers: [
        ValidateService,
        F3xSummary,
        provideMockStore({
          initialState: {
            fecfile_online_committeeAccount: committeeAccount,
            fecfile_online_userLoginData: userLoginData,
          },
          selectors: [
            { selector: selectCommitteeAccount, value: committeeAccount },
            { selector: 'selectUserLoginData', value: userLoginData },
          ],
        }),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ id: 1 }),
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

    component.save('back');
    const req = httpTestingController.expectOne(`${environment.apiUrl}/f3x-summaries/${component.report.id}/`);
    expect(req.request.method).toEqual('PUT');
    req.flush(component.report);
    expect(navigateSpy).toHaveBeenCalledWith('/reports');
  });

  it('#save should continue when save & contineu button clicked', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.report = F3xSummary.fromJSON({
      id: '999',
    });

    component.save('continue');
    const req = httpTestingController.expectOne(`${environment.apiUrl}/f3x-summaries/${component.report.id}/`);
    expect(req.request.method).toEqual('PUT');
    req.flush(component.report);
    expect(navigateSpy).toHaveBeenCalledWith('/reports/f3x/create/step3/999');
  });
});
