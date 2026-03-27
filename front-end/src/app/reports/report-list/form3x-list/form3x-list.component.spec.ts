import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { FormTypeDialogComponent } from 'app/reports/form-type-dialog/form-type-dialog.component';
import { CommitteeAccount, Form3X, ReportStatus, ReportTypes } from 'app/shared/models';
import { ApiService } from 'app/shared/services/api.service';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { ReportService } from 'app/shared/services/report.service';
import { testActiveReport, testMockStore } from 'app/shared/utils/unit-test.utils';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Dialog, DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { of, Subject } from 'rxjs';
import { ReportListComponent } from '../report-list.component';
import { Form3XListComponent } from './form3x-list.component';
import { ROUTES } from 'app/routes';

describe('Form3XListComponent', () => {
  let component: Form3XListComponent;
  let fixture: ComponentFixture<Form3XListComponent>;
  let router: Router;
  let reportService: Form3XService;
  const actions$ = new Subject<{
    type: string;
  }>();
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableModule, ToolbarModule, DialogModule, ReportListComponent, FormTypeDialogComponent, Dialog],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ReportService,
        ConfirmationService,
        MessageService,
        ApiService,
        provideMockStore(testMockStore()),
        provideRouter(ROUTES),
        { provide: Actions, useValue: actions$ },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}),
          },
        },
      ],
    }).compileComponents();
    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    router = TestBed.inject(Router);
    reportService = TestBed.inject(Form3XService);
    fixture = TestBed.createComponent(Form3XListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('rowActions', () => {
    it('should have "Unamend" if report can_unamend', () => {
      const report = testActiveReport();
      report.can_unamend = false;
      const action = component.rowActions.find((action) => action.label === 'Unamend');
      if (action) {
        expect(action.isAvailable(report)).toBe(false);
        report.can_unamend = true;
        expect(action.isAvailable(report)).toBe(true);
      }
    });
  });

  it('#getEmptyItem should return a new Report instance', () => {
    const item = component['getEmptyItem']();
    expect(item.id).toBe(undefined);
  });

  it('#editItem should route properly for report_status undefined', async () => {
    const navigateSpy = vi.spyOn(router, 'navigateByUrl');
    await component.editItem({ id: '888', report_type: ReportTypes.F3X, report_status: undefined } as Form3X);
    expect(navigateSpy).toHaveBeenCalledWith('/reports/transactions/report/888/list');
    component.editItem({
      id: '777',
      report_type: ReportTypes.F3X,
      report_status: undefined,
    } as Form3X);
    expect(navigateSpy).toHaveBeenCalledWith('/reports/transactions/report/777/list');
  });

  it('#editItem should route properly for in-progress report', async () => {
    const navigateSpy = vi.spyOn(router, 'navigateByUrl');
    await component.editItem({ id: '888', report_type: ReportTypes.F3X, report_status: undefined } as Form3X);
    expect(navigateSpy).toHaveBeenCalledWith('/reports/transactions/report/888/list');
    component.editItem({
      id: '777',
      report_type: ReportTypes.F3X,
      report_status: ReportStatus.IN_PROGRESS,
    } as Form3X);
    expect(navigateSpy).toHaveBeenCalledWith('/reports/transactions/report/777/list');
  });

  it('#editItem should route properly for report with submission pending', async () => {
    const navigateSpy = vi.spyOn(router, 'navigateByUrl');
    await component.editItem({ id: '888', report_type: ReportTypes.F3X, report_status: undefined } as Form3X);
    expect(navigateSpy).toHaveBeenCalledWith('/reports/transactions/report/888/list');
    component.editItem({
      id: '777',
      report_type: ReportTypes.F3X,
      report_status: ReportStatus.SUBMIT_PENDING,
    } as Form3X);
    expect(navigateSpy).toHaveBeenCalledWith('/reports/f3x/submit/status/777');
  });

  it('#editItem should route properly for report with submission success', async () => {
    const navigateSpy = vi.spyOn(router, 'navigateByUrl');
    await component.editItem({ id: '888', report_type: ReportTypes.F3X, report_status: undefined } as Form3X);
    expect(navigateSpy).toHaveBeenCalledWith('/reports/transactions/report/888/list');
    component.editItem({
      id: '777',
      report_type: ReportTypes.F3X,
      report_status: ReportStatus.SUBMIT_SUCCESS,
    } as Form3X);
    expect(navigateSpy).toHaveBeenCalledWith('/reports/f3x/submit/status/777');
  });

  it('#editItem should route properly for report with submission failure', async () => {
    const navigateSpy = vi.spyOn(router, 'navigateByUrl');
    await component.editItem({ id: '888', report_type: ReportTypes.F3X, report_status: undefined } as Form3X);
    expect(navigateSpy).toHaveBeenCalledWith('/reports/transactions/report/888/list');
    component.editItem({
      id: '777',
      report_type: ReportTypes.F3X,
      report_status: ReportStatus.SUBMIT_FAILURE,
    } as Form3X);
    expect(navigateSpy).toHaveBeenCalledWith('/reports/f3x/submit/status/777');
  });

  it('#amend should hit service', async () => {
    const amendSpy = vi.spyOn(reportService, 'startAmendment').mockReturnValue(Promise.resolve(''));
    await component.amendReport({ id: '999' } as Form3X);
    expect(amendSpy).toHaveBeenCalled();
  });

  describe('unamend', () => {
    it('should hit service', async () => {
      const unamendSpy = vi.spyOn(reportService, 'startUnamendment').mockReturnValue(Promise.resolve(''));
      await component.unamendReport({ id: '999' } as Form3X);
      expect(unamendSpy).toHaveBeenCalled();
    });
  });
  it('#onActionClick should route properly', async () => {
    const navigateSpy = vi.spyOn(router, 'navigateByUrl');
    await component.editItem({
      id: '888',
      report_type: ReportTypes.F3X,
    } as Form3X);

    expect(navigateSpy).toHaveBeenCalledWith('/reports/transactions/report/888/list');
  });

  it('#onDownload should open download panel properly', async () => {
    const testCommitteeAccount = new CommitteeAccount();
    testCommitteeAccount.id = '12346';
    store.overrideSelector(selectCommitteeAccount, testCommitteeAccount);
    const report = { id: '888', report_type: ReportTypes.F3X } as Form3X;
    const mockDownload = {
      taskId: 'test-task-123',
      isComplete: false,
      name: '',
      report,
    };

    const generateSpy = vi.spyOn(component.dotFecService, 'generateFecFile').mockResolvedValue(mockDownload);
    const checkSpy = vi.spyOn(component.dotFecService, 'checkFecFileTask').mockResolvedValue(undefined);
    const fecUpdateSpy = vi.spyOn(component.itemService, 'fecUpdate').mockResolvedValue(report);

    await component.download(report);

    expect(fecUpdateSpy).toHaveBeenCalledWith(report, testCommitteeAccount);
    expect(generateSpy).toHaveBeenCalledWith(report);
    expect(checkSpy).toHaveBeenCalledWith(mockDownload);
  });

  describe('deleteReport', () => {
    it('should call confirm', () => {
      const confirmSpy = vi.spyOn(component.confirmationService, 'confirm');
      component.confirmDelete(testActiveReport());
      expect(confirmSpy).toHaveBeenCalledTimes(1);
    });

    it('should delete', async () => {
      const report = testActiveReport();
      const deleteSpy = vi.spyOn(reportService, 'delete').mockReturnValue(Promise.resolve(null));
      const messageServiceSpy = vi.spyOn(component.messageService, 'add');
      await component.delete(report);
      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(deleteSpy).toHaveBeenCalledWith(report);
      expect(messageServiceSpy).toHaveBeenCalledTimes(1);
      expect(messageServiceSpy).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Successful',
        detail: 'Report Deleted',
        life: 3000,
      });
    });
  });
});
