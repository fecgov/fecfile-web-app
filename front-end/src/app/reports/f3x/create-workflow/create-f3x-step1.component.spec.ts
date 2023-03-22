import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from '../../../shared/utils/unit-test.utils';
import { of } from 'rxjs';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { F3xSummaryService } from 'app/shared/services/f3x-summary.service';
import { LabelPipe } from 'app/shared/pipes/label.pipe';
import { SharedModule } from 'app/shared/shared.module';
import { MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CreateF3XStep1Component, F3xReportTypeCategories } from './create-f3x-step1.component';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { F3xCoverageDates } from '../../../shared/models/f3x-summary.model';
import { AppSelectButtonComponent } from '../../../shared/components/app-selectbutton';
import { ReportService } from '../../../shared/services/report.service';
import { ListRestResponse } from '../../../shared/models/rest-api.model';
import { F3xReportCodes } from 'app/shared/utils/report-code.utils';

describe('CreateF3XStep1Component', () => {
  let component: CreateF3XStep1Component;
  let router: Router;
  let fixture: ComponentFixture<CreateF3XStep1Component>;
  let f3xSummaryService: F3xSummaryService;
  let reportService: ReportService;
  const f3x: F3xSummary = F3xSummary.fromJSON({
    id: '999',
    coverage_from_date: '2022-05-25',
    coverage_through_date: '2022-06-25',
    form_type: 'F3XN',
    report_code: 'Q1',
  });
  beforeEach(async () => {
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
      declarations: [CreateF3XStep1Component, LabelPipe, AppSelectButtonComponent],
      providers: [F3xSummaryService, FormBuilder, MessageService, FecDatePipe, provideMockStore(testMockStore)],
    }).compileComponents();
  });

  beforeEach(() => {
    router = TestBed.inject(Router);
    f3xSummaryService = TestBed.inject(F3xSummaryService);
    reportService = TestBed.inject(ReportService);
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
    component.form.controls['report_type_category'].setValue(F3xReportTypeCategories.NON_ELECTION_YEAR);
    expect(component.form.controls['report_code'].value).toEqual(F3xReportCodes.MY);
    component.form.controls['report_type_category'].setValue(undefined);
    expect(component.form.controls['report_code'].value).toEqual(undefined);
  });

  it('#save should save a new f3x record', () => {
    const listResponse = {
      count: 0,
      next: '/',
      previous: '/',
      results: [],
    } as ListRestResponse;
    spyOn(f3xSummaryService, 'create').and.returnValue(of(f3x));
    spyOn(reportService, 'getTableData').and.returnValue(of(listResponse));
    const navigateSpy = spyOn(router, 'navigateByUrl');

    component.form.patchValue({ ...f3x });
    component.save();
    expect(navigateSpy).toHaveBeenCalledWith('/reports');

    navigateSpy.calls.reset();
    component.form.patchValue({ ...f3x });
    component.save('continue');
    expect(navigateSpy).toHaveBeenCalledWith('/reports/f3x/create/cash-on-hand/999');
  });

  it('#save should not save with invalid f3x record', () => {
    spyOn(f3xSummaryService, 'create').and.returnValue(of(f3x));
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

  it('#existingCoverageValidator should return errors', () => {
    const existingCoverage = F3xCoverageDates.fromJSON({
      report_code: 'Q1',
      coverage_from_date: new Date('01/02/2023'),
      coverage_through_date: new Date('01/04/2023'),
    });
    const validator = component.existingCoverageValidator([existingCoverage]);
    const control = new FormControl(new Date('01/03/2023'));
    expect(validator(control)).toEqual({
      invaliddate: {
        msg: 'You have entered coverage dates that overlap the coverage dates of the following report: APRIL 15 QUARTERLY REPORT (Q1)  01/02/2023 - 01/04/2023',
      },
    });
  });
});
