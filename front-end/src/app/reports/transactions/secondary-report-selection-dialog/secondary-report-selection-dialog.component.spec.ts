import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { Dialog, DialogModule } from 'primeng/dialog';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore, testScheduleATransaction } from 'app/shared/utils/unit-test.utils';
import { firstValueFrom, of } from 'rxjs';
import { F3xFormTypes, Form3X } from 'app/shared/models/form-3x.model';
import { ReportTypes } from 'app/shared/models/report.model';
import { SecondaryReportSelectionDialogComponent } from './secondary-report-selection-dialog.component';
import { ReportService } from 'app/shared/services/report.service';
import { TransactionService } from 'app/shared/services/transaction.service';
import { DatePipe } from '@angular/common';
import { LabelPipe } from 'app/shared/pipes/label.pipe';
import { MessageService } from 'primeng/api';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('SecondaryReportSelectionDialogComponent', () => {
  let component: SecondaryReportSelectionDialogComponent;
  let fixture: ComponentFixture<SecondaryReportSelectionDialogComponent>;
  let transactionService: TransactionService;
  let reportService: ReportService;
  const testReports = [
    Form3X.fromJSON({ id: '1', created: '2022-12-01' }),
    Form3X.fromJSON({ id: '2', created: '2022-12-31' }),
    Form3X.fromJSON({ id: '3', created: '2023-01-15', form_type: F3xFormTypes.F3XA }),
  ];

  beforeEach(async () => {
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
        ReportService,
        TransactionService,
        MessageService,
        DatePipe,
        provideMockStore(testMockStore),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                report: Form3X.fromJSON({
                  report_type: ReportTypes.F3X,
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

    fixture = TestBed.createComponent(SecondaryReportSelectionDialogComponent);
    transactionService = TestBed.inject(TransactionService);
    reportService = TestBed.inject(ReportService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve reports when reportType is set', () => {
    const spy = spyOn(reportService, 'getAllReports').and.returnValue(firstValueFrom(of([])));
    component.reportType = ReportTypes.F3X;
    expect(spy).toHaveBeenCalled();
  });

  it('should set related values when reports are retrieved', () => {
    const fieldSpy = spyOn(component, 'getDropdownText');
    const labelSpy = spyOn(component, 'getReportLabels');
    component.setReports(testReports);

    expect(fieldSpy).toHaveBeenCalled();
    expect(labelSpy).toHaveBeenCalled();
  });

  it('should set the dropdown text correctly', () => {
    component.reports = testReports;
    component._reportType = ReportTypes.F3X;
    expect(component.getDropdownText()).toEqual(`Select a ${ReportTypes.F3X} Report`);
  });

  it('should generate report labels correctly', () => {
    component.reports = testReports;
    component._reportType = ReportTypes.F3X;
    component.reportLabels = component.getReportLabels();
    expect(component.reportLabels.length).toEqual(3);
    expect(component.reportLabels[0][1].endsWith('#1')).toBeTrue();
    expect(component.reportLabels[0][1].includes('2022')).toBeTrue();
    expect(component.reportLabels[1][1].endsWith('#2')).toBeTrue();
    expect(component.reportLabels[2][1].includes('#1')).toBeTrue();
    expect(component.reportLabels[2][1].endsWith('(Amendment)')).toBeTrue();
    expect(component.reportLabels[2][1].includes('2023')).toBeTrue();
  });

  it('should set the dropdown text when choosing a report', () => {
    component.reports = testReports;
    component._reportType = ReportTypes.F3X;
    component.reportLabels = component.getReportLabels();
    component.updateSelectedReport(component.reports[1]);

    expect(component.selectedReport).toEqual(component.reports[1]);
    expect(component.dropDownFieldText).toEqual(`${component.reports[1]?.getLongLabel()} [2022] #2`);

    component.updateSelectedReport(component.reports[2]);
    expect(component.dropDownFieldText).toEqual(`${component.reports[2]?.getLongLabel()} [2023] #1 (Amendment)`);
  });

  it('should add a transaction to a report', () => {
    component.reports = testReports;
    component.transaction = testScheduleATransaction;
    component._reportType = ReportTypes.F3X;
    component.reportLabels = component.getReportLabels();
    component.updateSelectedReport(component.reports[1]);

    const transactionSpy = spyOn(transactionService, 'addToReport').and.returnValue(
      firstValueFrom(
        of({
          status: 200,
        } as HttpResponse<string>),
      ),
    );
    component.linkToSelectedReport();

    expect(transactionSpy).toHaveBeenCalledOnceWith(testScheduleATransaction, component.reports[1]);
  });

  it('should call applyFocus on select when showDialog is called', () => {
    component.select = jasmine.createSpyObj('Select', ['applyFocus']);

    component.showDialog();

    expect(component.select.applyFocus).toHaveBeenCalled();
  });
});
