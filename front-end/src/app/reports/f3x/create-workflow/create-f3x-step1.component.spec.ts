import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { F3xReportCodes, F3xSummary } from 'app/shared/models/f3x-summary.model';
import { UserLoginData } from 'app/shared/models/user.model';
import { LabelPipe } from 'app/shared/pipes/label.pipe';
import { SharedModule } from 'app/shared/shared.module';
import { environment } from 'environments/environment';
import { MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CreateF3XStep1Component, F3xReportTypeCategories } from './create-f3x-step1.component';
import { F3xSummaryService } from 'app/shared/services/f3x-summary.service';

describe('CreateF3XStep1Component', () => {
  let httpTestingController: HttpTestingController;
  let component: CreateF3XStep1Component;
  let router: Router;
  let fixture: ComponentFixture<CreateF3XStep1Component>;
  const f3x: F3xSummary = F3xSummary.fromJSON({
    coverage_from_date: '20220525',
    form_type: 'F3XN',
    report_code: 'Q1',
  });
  beforeEach(async () => {
    const userLoginData: UserLoginData = {
      committee_id: 'C00000000',
      email: 'email@fec.com',
      is_allowed: true,
      token: 'jwttokenstring',
    };
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SelectButtonModule,
        SharedModule,
        RadioButtonModule,
        CalendarModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
      ],
      declarations: [CreateF3XStep1Component, LabelPipe],
      providers: [
        FormBuilder,
        MessageService,
        provideMockStore({
          initialState: { fecfile_online_userLoginData: userLoginData },
          selectors: [{ selector: 'selectUserLoginData', value: userLoginData }],
        }),
      ],
    }).compileComponents();
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(CreateF3XStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update form when filing frequency changes', () => {
    component.form.controls['filing_frequency'].setValue('M');
    expect(component.form.controls['report_type_category'].value).toEqual(F3xReportTypeCategories.ELECTION_YEAR);
  });

  it('should update codes when report_type_category changes', () => {
    component.form.controls['filing_frequency'].setValue('Q');
    component.form.controls['report_type_category'].setValue(F3xReportTypeCategories.SPECIAL);
    expect(component.form.controls['report_code'].value).toEqual(F3xReportCodes.TwelveP);
    component.form.controls['report_type_category'].setValue(F3xReportTypeCategories.NON_ELECTION_YEAR);
    expect(component.form.controls['report_code'].value).toEqual(F3xReportCodes.Q1);
    component.form.controls['report_type_category'].setValue(undefined);
    expect(component.form.controls['report_code'].value).toEqual(undefined);
  });

  it('#save should save a new f3x record', () => {
    component.form.patchValue({ ...f3x });
    component.save();
    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/f3x-summaries/?fields_to_validate=filing_frequency,report_type_category,report_code,coverage_from_date,coverage_through_date,date_of_election,state_of_election,form_type`
    );
    expect(req.request.method).toEqual('POST');
    httpTestingController.verify();
  });

  it('#save should not save with invalid f3x record', () => {
    component.form.patchValue({ ...f3x });
    component.form.patchValue({ form_type: 'NO-GOOD' });
    component.save();
    expect(component.form.invalid).toBe(true);
  });

  it('back button should go back to report list page', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.goBack();
    expect(navigateSpy).toHaveBeenCalledWith('/reports');
  });
});
