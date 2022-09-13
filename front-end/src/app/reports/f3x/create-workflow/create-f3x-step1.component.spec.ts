import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from '../../../shared/utils/unit-test.utils';
import { of } from 'rxjs';
import { F3xReportCodes, F3xSummary } from 'app/shared/models/f3x-summary.model';
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

describe('CreateF3XStep1Component', () => {
  let component: CreateF3XStep1Component;
  let router: Router;
  let fixture: ComponentFixture<CreateF3XStep1Component>;
  let f3xSummaryService: F3xSummaryService;
  let reportService: ReportService;
  const f3x: F3xSummary = F3xSummary.fromJSON({
    id: 999,
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

  it('should catch date overlaps', () => {
    //New dates inside of existing report
    const fromDate = new Date('12/01/2012');
    const throughDate = new Date('12/31/2012');
    let fieldDate = fromDate;
    let targetDate = F3xCoverageDates.fromJSON({
      coverage_from_date: new Date('11/01/2012'),
      coverage_through_date: new Date('1/01/2013'),
    });
    expect(component.checkForDateOverlap(fieldDate, fromDate, throughDate, targetDate)).toBe(true);

    //New dates start inside of existing report - FromDate
    targetDate = F3xCoverageDates.fromJSON({
      coverage_from_date: new Date('11/01/2012'),
      coverage_through_date: new Date('12/15/2012'),
    });
    expect(component.checkForDateOverlap(fieldDate, fromDate, throughDate, targetDate)).toBe(true);

    //New dates start inside of existing report - ThroughDate
    fieldDate = throughDate;
    targetDate = F3xCoverageDates.fromJSON({
      coverage_from_date: new Date('11/01/2012'),
      coverage_through_date: new Date('12/15/2012'),
    });
    expect(component.checkForDateOverlap(fieldDate, fromDate, throughDate, targetDate)).toBe(false);

    //New dates end inside of existing report - FromDate
    fieldDate = fromDate;
    targetDate = F3xCoverageDates.fromJSON({
      coverage_from_date: new Date('12/15/2012'),
      coverage_through_date: new Date('1/15/2013'),
    });
    expect(component.checkForDateOverlap(fieldDate, fromDate, throughDate, targetDate)).toBe(false);

    //New dates end inside of existing report - ThroughDate
    fieldDate = throughDate;
    targetDate = F3xCoverageDates.fromJSON({
      coverage_from_date: new Date('12/15/2012'),
      coverage_through_date: new Date('1/15/2013'),
    });
    expect(component.checkForDateOverlap(fieldDate, fromDate, throughDate, targetDate)).toBe(true);

    //New dates encompass existing report
    targetDate = F3xCoverageDates.fromJSON({
      coverage_from_date: new Date('12/05/2012'),
      coverage_through_date: new Date('12/25/2012'),
    });
    expect(component.checkForDateOverlap(fieldDate, fromDate, throughDate, targetDate)).toBe(true);

    //New dates do not overlap with existing report
    targetDate = F3xCoverageDates.fromJSON({
      coverage_from_date: new Date('12/05/2015'),
      coverage_through_date: new Date('12/25/2015'),
    });
    expect(component.checkForDateOverlap(fieldDate, fromDate, throughDate, targetDate)).toBe(false);
  });

  it('setCoverageOverlapError should set an error', () => {
    const formValue: AbstractControl = component.form.controls['coverage_from_date'];
    const overlap: F3xCoverageDates = F3xCoverageDates.fromJSON({
      coverage_from_date: '10/10/2010',
      coverage_through_date: '11/10/2010',
    });
    component.setCoverageOverlapError(formValue, overlap);
    expect(component.form.controls['coverage_from_date'].errors).not.toBe(null);
  });

  it('The coverage date validator does not explode if passed an AbstractControl instead of a FormGroup', () => {
    const validatorFn = component.buildCoverageDatesValidator();
    const field = component.form.controls['coverage_from_date'];
    expect(validatorFn(field)).toBe(null);
  });

  it('Should catch an overlap in dates with the constructed validator function', () => {
    const validatorFn = component.buildCoverageDatesValidator();
    component.form.controls['coverage_from_date'].setValue(new Date('12/15/2010'));
    component.form.controls['coverage_through_date'].setValue(new Date('1/01/2011'));
    component.f3xCoverageDatesList = [
      F3xCoverageDates.fromJSON({
        coverage_from_date: new Date('12/01/2010'),
        coverage_through_date: new Date('12/31/2010'),
      }),
    ];

    validatorFn(component.form);
    expect(component.form.controls['coverage_from_date'].errors).not.toEqual(null);
  });
});
