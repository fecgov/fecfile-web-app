import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from '../../../shared/utils/unit-test.utils';
import { F3xReport } from 'app/shared/models/report-types/f3x-report.model';
import { F3xReportService } from 'app/shared/services/f3x-report.service';
import { LabelPipe } from 'app/shared/pipes/label.pipe';
import { SharedModule } from 'app/shared/shared.module';
import { MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CreateF3XStep1Component, F3xReportTypeCategories } from './create-f3x-step1.component';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { F3xCoverageDates } from '../../../shared/models/report-types/f3x-report.model';
import { AppSelectButtonComponent } from '../../../shared/components/app-selectbutton.component';
import { ReportService } from '../../../shared/services/report.service';
import { ListRestResponse } from '../../../shared/models/rest-api.model';
import { F3xReportCodes } from 'app/shared/utils/report-code.utils';
import { of } from 'rxjs';

describe('CreateF3XStep1Component', () => {
  let component: CreateF3XStep1Component;
  let router: Router;
  let fixture: ComponentFixture<CreateF3XStep1Component>;
  let F3xReportService: F3xReportService;
  let reportService: ReportService;
  const f3x: F3xReport = F3xReport.fromJSON({
    id: '999',
    coverage_from_date: '2022-05-25',
    coverage_through_date: '2022-06-25',
    form_type: 'F3XN',
    report_code: 'Q1',
  });

  const first = new Date('01/01/2023');
  const second = new Date('01/02/2023');
  const third = new Date('01/03/2023');
  const fourth = new Date('01/04/2023');
  const fifth = new Date('01/05/2023');
  const sixth = new Date('01/06/2023');
  const seventh = new Date('01/07/2023');
  const ninth = new Date('01/09/2023');
  const eigth = new Date('01/08/2023');
  const tenth = new Date('01/10/2023');
  const thirdThroughFifth = F3xCoverageDates.fromJSON({
    report_code: 'Q1',
    coverage_from_date: third,
    coverage_through_date: fifth,
  });
  const seventhThroughNinth = F3xCoverageDates.fromJSON({
    report_code: 'Q2',
    coverage_from_date: seventh,
    coverage_through_date: ninth,
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
      providers: [F3xReportService, FormBuilder, MessageService, FecDatePipe, provideMockStore(testMockStore)],
    }).compileComponents();

    router = TestBed.inject(Router);
    F3xReportService = TestBed.inject(F3xReportService);
    F3xReportService.getF3xCoverageDates = () => of([]);
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

  describe('with existing coverage', () => {
    beforeEach(async () => {
      router = TestBed.inject(Router);
      F3xReportService = TestBed.inject(F3xReportService);
      F3xReportService.getF3xCoverageDates = () => of([thirdThroughFifth]);
      reportService = TestBed.inject(ReportService);
      fixture = TestBed.createComponent(CreateF3XStep1Component);
      component = fixture.componentInstance;

      fixture.detectChanges();
    });
    it('should pick first unused report code', () => {
      component.form.controls['filing_frequency'].setValue('Q');
      component.form.controls['report_type_category'].setValue(F3xReportTypeCategories.ELECTION_YEAR);
      expect(component.form.controls['report_code'].value).toEqual(F3xReportCodes.Q2);
    });
  });

  it('#save should save a new f3x record', () => {
    const listResponse = {
      count: 0,
      next: '/',
      previous: '/',
      results: [],
    } as ListRestResponse;
    spyOn(F3xReportService, 'create').and.returnValue(of(f3x));
    spyOn(reportService, 'getTableData').and.returnValue(of(listResponse));
    const navigateSpy = spyOn(router, 'navigateByUrl');

    component.form.patchValue({ ...f3x });
    component.save();
    expect(component.form.invalid).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith('/reports');

    navigateSpy.calls.reset();
    component.form.patchValue({ ...f3x });
    component.save('continue');
    expect(navigateSpy).toHaveBeenCalledWith('/reports/f3x/create/cash-on-hand/999');
  });

  it('#save should not save with invalid f3x record', () => {
    spyOn(F3xReportService, 'create').and.returnValue(of(f3x));
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
    const foo = (
      existingCoverage: F3xCoverageDates[],
      controlFromDate: Date,
      controlThroughDate: Date,
      expectedFromMessage: string | null,
      expectedThroughMessage: string | null
    ) => {
      const validator = component.existingCoverageValidator(existingCoverage);
      const group = new FormGroup({
        coverage_from_date: new FormControl(controlFromDate),
        coverage_through_date: new FormControl(controlThroughDate),
      });
      validator(group);
      expect(group.get('coverage_from_date')?.errors).toEqual(
        expectedFromMessage ? { invaliddate: { msg: expectedFromMessage } } : null
      );
      expect(group.get('coverage_through_date')?.errors).toEqual(
        expectedThroughMessage ? { invaliddate: { msg: expectedThroughMessage } } : null
      );
    };
    const hitsQ1Msg =
      'You have entered coverage dates that overlap the coverage dates of the following report: APRIL 15 QUARTERLY REPORT (Q1)  01/03/2023 - 01/05/2023';
    const hitsQ2Msg =
      'You have entered coverage dates that overlap the coverage dates of the following report: JULY 15 QUARTERLY REPORT (Q2)  01/07/2023 - 01/09/2023';

    /**
     * FC, TC: from/through control
     * [1--1]: existing coverage
     * FC--[1--1]--TC--[2--2]
     */
    foo([thirdThroughFifth, seventhThroughNinth], first, tenth, hitsQ1Msg, hitsQ1Msg);

    //FC--[1--TC--1]--[2--2]
    foo([thirdThroughFifth, seventhThroughNinth], first, fourth, null, hitsQ1Msg);

    //FC--[1--1]--[2--TC--2]
    foo([thirdThroughFifth, seventhThroughNinth], first, eigth, hitsQ1Msg, hitsQ1Msg);

    //[1--FC--1]--[2--TC--2]
    foo([thirdThroughFifth, seventhThroughNinth], fourth, eigth, hitsQ1Msg, hitsQ2Msg);

    //[1--1]--FC--[2--TC--2]
    foo([thirdThroughFifth, seventhThroughNinth], sixth, eigth, null, hitsQ2Msg);

    //FC--TC--[1--1]--[2--2]
    foo([thirdThroughFifth, seventhThroughNinth], first, second, null, null);
  });
});
