import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { LinkedReportInputComponent } from './linked-report-input.component';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { ReportService } from 'app/shared/services/report.service';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { testMockStore, testScheduleATransaction, testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { InputTextModule } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { Transaction, Form3X, Report, UploadSubmission, SchATransaction } from 'app/shared/models';
import { Component, OnDestroy, viewChild } from '@angular/core';

const mockReports: Report[] = [
  Form3X.fromJSON({
    id: '1',
    coverage_from_date: '2024-01-01',
    coverage_through_date: '2024-03-31',
    form_type: 'F3XN',
    report_type: 'F3X',
    report_code: 'Q1',
    report_status: 'In progress',
    report_code_label: 'APRIL 15 QUARTERLY REPORT (Q1)',
    upload_submission: UploadSubmission.fromJSON({}),
    webprint_submission: {
      fec_email: 'test@test.com',
      fec_batch_id: '1234',
      fec_image_url: 'image.test.com',
      fec_submission_id: 'FEC-1234567',
      fec_message: 'Message Goes Here',
      fec_status: 'COMPLETED',
      fecfile_error: '',
      fecfile_task_state: 'COMPLETED',
      id: 0,
      created: '10/10/2010',
      updated: '10/12/2010',
    },
  }),
  Form3X.fromJSON({
    id: '2',
    coverage_from_date: '2024-04-01',
    coverage_through_date: '2024-06-30',
    form_type: 'F3XN',
    report_type: 'F3X',
    report_code: 'Q1',
    report_status: 'In progress',
    report_code_label: 'YEAR-END',
    upload_submission: UploadSubmission.fromJSON({}),
    webprint_submission: {
      fec_email: 'test@test.com',
      fec_batch_id: '1234',
      fec_image_url: 'image.test.com',
      fec_submission_id: 'FEC-1234567',
      fec_message: 'Message Goes Here',
      fec_status: 'COMPLETED',
      fecfile_error: '',
      fecfile_task_state: 'COMPLETED',
      id: 0,
      created: '10/10/2010',
      updated: '10/12/2010',
    },
  }),
];

@Component({
  imports: [LinkedReportInputComponent],
  standalone: true,
  template: `<app-linked-report-input [form]="form" [templateMap]="templateMap" [transaction]="transaction" />`,
})
class TestHostComponent implements OnDestroy {
  form: FormGroup = new FormGroup({
    [testTemplateMap['date']]: new SubscriptionFormControl(new Date('06/01/2024')),
    [testTemplateMap['date2']]: new SubscriptionFormControl(new Date('06/01/2024')),
    [testTemplateMap['memo_code']]: new SubscriptionFormControl(),
  });
  templateMap = testTemplateMap;
  transaction: Transaction = { ...testScheduleATransaction } as SchATransaction;

  component = viewChild.required(LinkedReportInputComponent);

  constructor() {
    this.transaction.reports = mockReports;
  }
  ngOnDestroy(): void {
    testScheduleATransaction.reports = [mockReports[0]];
  }
}

describe('LinkedReportInputComponent', () => {
  let component: LinkedReportInputComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let reportServiceMock: jasmine.SpyObj<ReportService>;

  beforeEach(async () => {
    reportServiceMock = jasmine.createSpyObj('ReportService', ['getAllReports', 'get']);
    reportServiceMock.getAllReports.and.returnValue(Promise.resolve(mockReports));
    reportServiceMock.get.and.callFake((id: string) => Promise.resolve(mockReports.find((r) => r.id === id)!));

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LinkedReportInputComponent, InputTextModule, ErrorMessagesComponent],
      providers: [
        provideMockStore(testMockStore),
        FecDatePipe,
        { provide: ReportService, useValue: reportServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance.component();
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load F3X reports on init', async () => {
    expect(reportServiceMock.getAllReports).toHaveBeenCalled();
    expect(component.committeeF3xReports()).toEqual(mockReports as Form3X[]);
  });

  it('should set associated F3X based on disbursement date', async () => {
    component.form.get(testTemplateMap['date'])?.setValue(new Date('2024-06-15'));
    fixture.detectChanges();
    await fixture.whenStable();

    const associatedF3X = component.associatedF3X();
    expect(associatedF3X).toBeTruthy();
    expect(associatedF3X!.id).toBe('2');
  });

  it('should set associated F3X based on dissemination date if disbursement date missing', async () => {
    component.disbursementDate.set(undefined);
    component.disseminationDate.set(new Date('2024-01-20'));
    fixture.detectChanges();
    await fixture.whenStable();

    const associatedF3X = component.associatedF3X();
    expect(associatedF3X).toBeTruthy();
    expect(associatedF3X!.id).toBe('1');
  });

  it('should correctly format the label of the associated F3X report', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const expectedLabel = 'APRIL 15 (Q1): 01/01/2024 - 03/31/2024';
    const form3XLabel = component.form3XLabel();
    expect(form3XLabel).toEqual(expectedLabel);
  });

  it('should set form controls values on date change', async () => {
    spyOn(component.form.get('linkedF3x')!, 'setValue');
    spyOn(component.form.get('linkedF3xId')!, 'setValue');

    component.form.get(testTemplateMap['date'])?.setValue(new Date('2024-01-15'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.form.get('linkedF3x')!.setValue).toHaveBeenCalledWith('APRIL 15 (Q1): 01/01/2024 - 03/31/2024');
    expect(component.form.get('linkedF3xId')!.setValue).toHaveBeenCalledWith('1');
  });

  it('should have tooltipText defined', () => {
    expect(component.tooltipText).toContain('Transactions created in Form 24 must be linked');
  });

  it('should update associated report when dates change', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.associatedF3X()?.id).toBe('1');

    component.form.get(testTemplateMap['date'])?.setValue(new Date('2024-06-15'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.associatedF3X()?.id).toBe('2');
  });

  it('should update associated report when memo changes', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.associatedF3X()?.id).toBe('1');

    component.form.get(testTemplateMap['memo_code'])?.setValue(true);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.associatedF3X()?.id).toBe('2');
  });
});
