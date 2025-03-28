import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, flush, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { provideRouter, Router } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { F3xCoverageDates, ListRestResponse } from 'app/shared/models';
import { Form3X } from 'app/shared/models/form-3x.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { LabelPipe } from 'app/shared/pipes/label.pipe';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { ReportService } from 'app/shared/services/report.service';
import { F3xReportCodes } from 'app/shared/utils/report-code.utils';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { testActiveReport, testMockStore } from 'app/shared/utils/unit-test.utils';
import { buildNonOverlappingCoverageValidator } from 'app/shared/utils/validators.utils';
import { MessageService } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { firstValueFrom, of } from 'rxjs';
import { CreateF3XStep1Component, F3xReportTypeCategories } from './create-f3x-step1.component';

describe('CreateF3XStep1Component', () => {
  let component: CreateF3XStep1Component;
  let router: Router;
  let fixture: ComponentFixture<CreateF3XStep1Component>;
  let form3XService: Form3XService;
  let reportService: ReportService;

  const f3x: Form3X = Form3X.fromJSON({
    id: '999',
    coverage_from_date: '2022-05-25',
    coverage_through_date: '2022-06-25',
    form_type: 'F3XN',
    report_code: 'Q1',
  });

  const thisYear = new Date().getFullYear();
  const first = new Date(thisYear, 0, 1);
  const second = new Date(thisYear, 0, 2);
  const third = new Date(thisYear, 0, 3);
  const fourth = new Date(thisYear, 0, 4);
  const fifth = new Date(thisYear, 0, 5);
  const sixth = new Date(thisYear, 0, 6);
  const seventh = new Date(thisYear, 0, 7);
  const eighth = new Date(thisYear, 0, 8);
  const ninth = new Date(thisYear, 0, 9);
  const tenth = new Date(thisYear, 0, 10);
  const thirdThroughFifth = F3xCoverageDates.fromJSON(
    {
      report_code: 'Q1',
      coverage_from_date: third,
      coverage_through_date: fifth,
    },
    'APRIL 15 QUARTERLY REPORT (Q1)',
  );
  const seventhThroughNinth = F3xCoverageDates.fromJSON(
    {
      report_code: 'Q2',
      coverage_from_date: seventh,
      coverage_through_date: ninth,
    },
    'JULY 15 QUARTERLY REPORT (Q2)',
  );

  beforeAll(async () => {
    await import(`fecfile-validate/fecfile_validate_js/dist/F3X.validator`);
  });

  beforeEach(async () => {
    testMockStore.initialState.fecfile_online_activeReport = testActiveReport;

    await TestBed.configureTestingModule({
      imports: [SelectButtonModule, RadioButtonModule, DatePickerModule, ReactiveFormsModule, CreateF3XStep1Component],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        Form3XService,
        FormBuilder,
        MessageService,
        FecDatePipe,
        LabelPipe,
        provideMockStore(testMockStore),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    form3XService = TestBed.inject(Form3XService);
    form3XService.getF3xCoverageDates = () => firstValueFrom(of([]));
    reportService = TestBed.inject(ReportService);
    fixture = TestBed.createComponent(CreateF3XStep1Component);
    component = fixture.componentInstance;
    component.ngOnInit();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update form when filing frequency changes', () => {
    component.form.controls['filing_frequency'].setValue('M');
    fixture.detectChanges();
    expect(component.form.controls['report_type_category'].value).toEqual(F3xReportTypeCategories.ELECTION_YEAR);
  });

  it('should update codes when report_type_category changes', () => {
    component.form.controls['filing_frequency'].setValue('Q');
    fixture.detectChanges();
    component.form.controls['report_type_category'].setValue(F3xReportTypeCategories.NON_ELECTION_YEAR);
    fixture.detectChanges();
    expect(component.form.controls['report_code'].value).toEqual(F3xReportCodes.MY);
    component.form.controls['report_type_category'].setValue(undefined);
    fixture.detectChanges();
    expect(component.form.controls['report_code'].value).toEqual(undefined);
  });

  describe('with existing coverage', () => {
    beforeEach(async () => {
      router = TestBed.inject(Router);
      form3XService = TestBed.inject(Form3XService);
      form3XService.getF3xCoverageDates = () => firstValueFrom(of([thirdThroughFifth]));
      reportService = TestBed.inject(ReportService);
      fixture = TestBed.createComponent(CreateF3XStep1Component);
      component = fixture.componentInstance;

      fixture.detectChanges();
    });
    it('should pick first unused report code', () => {
      component.form.controls['filing_frequency'].setValue('Q');
      component.form.controls['report_type_category'].setValue(F3xReportTypeCategories.ELECTION_YEAR);
      fixture.detectChanges();
      expect(component.form.controls['report_code'].value).toEqual(F3xReportCodes.Q2);
    });
  });

  it('#save should save a new f3x record', async () => {
    const listResponse = {
      count: 0,
      next: '/',
      previous: '/',
      results: [],
      pageNumber: 0,
    } as ListRestResponse;
    spyOn(form3XService, 'create').and.returnValue(Promise.resolve(f3x));
    spyOn(reportService, 'getTableData').and.returnValue(Promise.resolve(listResponse));
    const navigateSpy = spyOn(router, 'navigateByUrl');

    component.form.patchValue({ ...f3x });
    await component.save();
    expect(component.form.invalid).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith('/reports');

    navigateSpy.calls.reset();
    component.form.patchValue({ ...f3x });
    await component.save('continue');
    expect(navigateSpy).toHaveBeenCalledWith('/reports/transactions/report/999/list');
  });

  xit('#save should not save with invalid f3x record', () => {
    spyOn(form3XService, 'create').and.returnValue(Promise.resolve(f3x));
    component.form.patchValue({ ...f3x });
    component.form.patchValue({ form_type: 'NO-GOOD' });
    component.form.updateValueAndValidity();
    flush();
    tick(1000);
    component.save();
    flush();
    tick(1000);
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
      expectedThroughMessage: string | null,
    ) => {
      const validator = buildNonOverlappingCoverageValidator(existingCoverage);
      const group = new FormGroup(
        {
          coverage_from_date: new SubscriptionFormControl(controlFromDate),
          coverage_through_date: new SubscriptionFormControl(controlThroughDate),
        },
        { updateOn: 'blur' },
      );
      validator(group);

      expect(group.get('coverage_from_date')?.errors).toEqual(
        expectedFromMessage ? { invaliddate: { msg: expectedFromMessage } } : null,
      );
      expect(group.get('coverage_through_date')?.errors).toEqual(
        expectedThroughMessage ? { invaliddate: { msg: expectedThroughMessage } } : null,
      );
    };
    const hitsQ1Msg = `You have entered coverage dates that overlap the coverage dates of the following report: APRIL 15 QUARTERLY REPORT (Q1)  01/03/${thisYear} - 01/05/${thisYear}`;
    const hitsQ2Msg = `You have entered coverage dates that overlap the coverage dates of the following report: JULY 15 QUARTERLY REPORT (Q2)  01/07/${thisYear} - 01/09/${thisYear}`;

    /**
     * FC, TC: from/through control
     * [1--1]: existing coverage
     * FC--[1--1]--TC--[2--2]
     */
    foo([thirdThroughFifth, seventhThroughNinth], first, tenth, hitsQ1Msg, hitsQ1Msg);

    //FC--[1--TC--1]--[2--2]
    foo([thirdThroughFifth, seventhThroughNinth], first, fourth, null, hitsQ1Msg);

    //FC--[1--1]--[2--TC--2]
    foo([thirdThroughFifth, seventhThroughNinth], first, eighth, hitsQ1Msg, hitsQ1Msg);

    //[1--FC--1]--[2--TC--2]
    foo([thirdThroughFifth, seventhThroughNinth], fourth, eighth, hitsQ1Msg, hitsQ2Msg);

    //[1--1]--FC--[2--TC--2]
    foo([thirdThroughFifth, seventhThroughNinth], sixth, eighth, null, hitsQ2Msg);

    //FC--TC--[1--1]--[2--2]
    foo([thirdThroughFifth, seventhThroughNinth], first, second, null, null);
  });
});
