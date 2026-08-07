import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { LinkedReportInputComponent } from './linked-report-input.component';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { testMockStore, testScheduleATransaction, testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { InputTextModule } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { Component, viewChild } from '@angular/core';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { provideHttpClient } from '@angular/common/http';
import { Form3X } from 'app/shared/models/reports/form-3x.model';
import type { Transaction } from 'app/shared/models/transaction/transaction.model';
import { UploadSubmission } from 'app/shared/models/upload-submission.model';
import { ReportStatus } from 'app/shared/models/reports/report-status.model';

const mockReports: Form3X[] = [
  Form3X.fromJSON({
    id: '1',
    coverage_from_date: '2024-01-01',
    coverage_through_date: '2024-03-31',
    form_type: 'F3XN',
    report_type: 'F3X',
    report_code: 'Q1',
    report_status: ReportStatus.IN_PROGRESS,
    report_code_label: 'MID-YEAR-REPORT',
    upload_submission: UploadSubmission.fromJSON({}),
  }),
  Form3X.fromJSON({
    id: '2',
    coverage_from_date: '2024-04-01',
    coverage_through_date: '2024-06-30',
    form_type: 'F3XN',
    report_type: 'F3X',
    report_code: 'Q2',
    report_status: ReportStatus.IN_PROGRESS,
    report_code_label: 'YEAR-END',
    upload_submission: UploadSubmission.fromJSON({}),
  }),
  Form3X.fromJSON({
    id: '3',
    coverage_from_date: '2024-07-01',
    coverage_through_date: '2024-10-31',
    form_type: 'F3XN',
    report_type: 'F3X',
    report_code: 'Q3',
    report_status: 'Submission success',
    report_code_label: 'YEAR-END',
    upload_submission: UploadSubmission.fromJSON({}),
  }),
];

@Component({
  imports: [LinkedReportInputComponent],
  standalone: true,
  template: `<app-linked-report-input [form]="form" [templateMap]="templateMap" [transaction]="transaction" />`,
})
class TestHostComponent {
  templateMap = testTemplateMap();
  form: FormGroup = new FormGroup({
    [this.templateMap['date']]: new SubscriptionFormControl(null),
    [this.templateMap['date2']]: new SubscriptionFormControl(null),
    [this.templateMap['memo_code']]: new SubscriptionFormControl(),
  });
  transaction: Transaction = testScheduleATransaction();

  component = viewChild.required(LinkedReportInputComponent);

  constructor() {
    this.transaction.reports = mockReports;
  }
}

describe('LinkedReportInputComponent', () => {
  let host: TestHostComponent;
  let component: LinkedReportInputComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let form3XService: Form3XService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LinkedReportInputComponent, InputTextModule, ErrorMessagesComponent],
      providers: [provideMockStore(testMockStore()), provideHttpClient(), FecDatePipe, Form3XService],
    }).compileComponents();
    form3XService = TestBed.inject(Form3XService);
    vi.spyOn(form3XService, 'getAllReports').mockResolvedValue(mockReports);
    vi.spyOn(form3XService, 'get').mockImplementation((id: string) => {
      const report = mockReports.find((r) => r.id === id);
      if (!report) return Promise.reject(new Error('No report found'));
      return Promise.resolve(report);
    });

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    component = host.component();
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load F3X reports on init', async () => {
    expect(form3XService.getAllReports).toHaveBeenCalled();
    expect(component.committeeF3xReports()).toEqual(mockReports);
  });

  it('should set associated F3X based on disbursement date', async () => {
    component.form.get(host.templateMap['date'])?.setValue(new Date('2024-04-15'));
    fixture.detectChanges();
    await fixture.whenStable();

    const associatedF3X = component.associatedF3X();
    expect(associatedF3X).toBeTruthy();
    expect(associatedF3X!.id).toBe('2');
    expect(associatedF3X).not.toBe(component.initialForm3X());
  });

  it('should not set associated F3X if report not in progress', async () => {
    component.form.get(host.templateMap['date'])?.setValue(new Date('2024-04-15'));
    fixture.detectChanges();
    await fixture.whenStable();

    component.form.get(host.templateMap['date'])?.setValue(new Date('2024-09-15'));
    fixture.detectChanges();
    await fixture.whenStable();
    const associatedF3X = component.associatedF3X();
    expect(associatedF3X).toBeFalsy();
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

    const expectedLabel = 'MID-YEAR-REPORT: 01/01/2024 - 03/31/2024';
    const form3XLabel = component.form3XLabel();
    expect(form3XLabel).toEqual(expectedLabel);
  });

  it('should set form controls values on date change', async () => {
    vi.spyOn(component.form.get('linkedF3x')!, 'setValue');
    vi.spyOn(component.form.get('linkedF3xId')!, 'setValue');

    component.form.get(host.templateMap['date'])?.setValue(new Date('2024-01-15'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.form.get('linkedF3x')!.setValue).toHaveBeenCalledWith('MID-YEAR-REPORT: 01/01/2024 - 03/31/2024');
    expect(component.form.get('linkedF3xId')!.setValue).toHaveBeenCalledWith('1');
  });

  it('should have tooltipText defined', () => {
    expect(component.tooltipText).toContain('Transactions created in Form 24 must be linked');
  });

  it('should update associated report when dates change', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.associatedF3X()?.id).toBe('1');

    component.form.get(host.templateMap['date'])?.setValue(new Date('2024-06-15'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.associatedF3X()?.id).toBe('2');
  });

  it('should update associated report when memo changes', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.associatedF3X()?.id).toBe('1');

    component.form.get(host.templateMap['memo_code'])?.setValue(true);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.associatedF3X()?.id).toBeUndefined();
  });
});
