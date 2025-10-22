import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { Dialog, DialogModule } from 'primeng/dialog';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore, testScheduleATransaction } from 'app/shared/utils/unit-test.utils';
import { Report, ReportStatus, ReportTypes } from 'app/shared/models/report.model';
import { SecondaryReportSelectionDialogComponent } from './secondary-report-selection-dialog.component';
import { TransactionService } from 'app/shared/services/transaction.service';
import { DatePipe } from '@angular/common';
import { LabelPipe } from 'app/shared/pipes/label.pipe';
import { MessageService, ToastMessageOptions } from 'primeng/api';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, signal, viewChild } from '@angular/core';
import { F24FormTypes, Form24, Transaction } from 'app/shared/models';
import { of } from 'rxjs';
import { Form24Service } from 'app/shared/services/form-24.service';

const mockF24Reports = [
  Form24.fromJSON({ id: '1', name: 'test1', created: '2022-12-01', report_status: ReportStatus.IN_PROGRESS }),
  Form24.fromJSON({ id: '2', name: 'test2', created: '2022-12-31', report_status: ReportStatus.IN_PROGRESS }),
  Form24.fromJSON({
    id: '3',
    name: 'test3',
    created: '2023-01-15',
    form_type: F24FormTypes.F24A,
    report_status: ReportStatus.IN_PROGRESS,
  }),
];

@Component({
  imports: [SecondaryReportSelectionDialogComponent],
  standalone: true,
  template: `<app-secondary-report-selection-dialog
    [(dialogVisible)]="visible"
    [reportType]="reportType"
    [transaction]="transaction"
    (create)="reportSelectionCreateMethod()"
    (reloadTables)="refreshTables()"
  />`,
})
class TestHostComponent {
  component = viewChild.required(SecondaryReportSelectionDialogComponent);
  readonly visible = signal(false);
  reportType = ReportTypes.F24;
  transaction: Transaction = testScheduleATransaction();
  reportSelectionCreateMethod = jasmine.createSpy('create');
  refreshTables = jasmine.createSpy('refreshTables');
}

describe('SecondaryReportSelectionDialogComponent', () => {
  let component: SecondaryReportSelectionDialogComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let messageService: MessageService;
  let transactionService: TransactionService;
  let addSpy: jasmine.Spy<(transaction: Transaction, report: Report) => Promise<HttpResponse<string>>>;
  let reportServiceMock: jasmine.SpyObj<Form24Service>;
  let messageSpy: jasmine.Spy<(message: ToastMessageOptions) => void>;

  beforeEach(async () => {
    reportServiceMock = jasmine.createSpyObj('Form24Service', ['getAllReports']);
    reportServiceMock.getAllReports.and.resolveTo(mockF24Reports);

    await TestBed.configureTestingModule({
      imports: [DialogModule, Dialog, SecondaryReportSelectionDialogComponent, LabelPipe],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          {
            path: 'reports/transactions/report/2401/list',
            redirectTo: '',
          },
        ]),
        { provide: Form24Service, useValue: reportServiceMock },
        TransactionService,
        MessageService,
        DatePipe,
        provideMockStore(testMockStore()),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                report: Form24.fromJSON({
                  report_type: ReportTypes.F24,
                }),
              },
            },
            params: of({
              catalog: 'receipt',
            }),
          },
        },
      ],
    }).compileComponents();
    transactionService = TestBed.inject(TransactionService);
    addSpy = spyOn(transactionService, 'addToReport');
    messageService = TestBed.inject(MessageService);
    messageSpy = spyOn(messageService, 'add');
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    component = host.component();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load in-progress reports for given report type', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    expect(reportServiceMock.getAllReports).toHaveBeenCalled();
    const filteredReports = component.reports();
    expect(filteredReports.length).toBe(3);
    expect(filteredReports[0].id).toBe('1');
  });

  it('should correctly compute placeholder text', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    const placeholder = component.placeholder();
    expect(placeholder).toBe('Select a F24 Report');
  });

  it('should successfully link transaction to selected report', async () => {
    addSpy.and.resolveTo(new HttpResponse({ status: 200 }));

    await fixture.whenStable();
    fixture.detectChanges();

    component.selectedReport.set(mockF24Reports[0]);
    await component.linkToSelectedReport();
    expect(addSpy).toHaveBeenCalledWith(host.transaction, mockF24Reports[0]);
    expect(host.reportSelectionCreateMethod).toHaveBeenCalled();
    expect(host.refreshTables).toHaveBeenCalled();
    expect(host.visible()).toBe(false);
    expect(messageSpy).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Successful',
      detail: 'Transaction added to F24 Report',
      key: 'reportLinkToast',
      life: 3000,
    });
  });

  it('should handle service error when adding report', async () => {
    addSpy.and.resolveTo(new HttpResponse({ status: 500 }));

    component.selectedReport.set(mockF24Reports[0]);
    await component.linkToSelectedReport();

    expect(messageSpy).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Transaction was not added to F24 Report',
      key: 'reportLinkToast',
      life: 3000,
    });
  });

  it('should show dialog and focus select when showDialog is called', () => {
    spyOn(component.select(), 'applyFocus');
    component.showDialog();
    expect(component.select().applyFocus).toHaveBeenCalled();
  });

  it('should show "Loading Reports..." if no report selected', () => {
    component.selectedReport.set(undefined);
    fixture.detectChanges();
    expect(component.dropDownFieldText()).toBe('Loading Reports...');
  });

  it('should show correct label if report selected', async () => {
    await fixture.whenStable();
    component.selectedReport.set(mockF24Reports[0]);
    fixture.detectChanges();
    expect(component.dropDownFieldText()).toBe('test1');
  });
});
