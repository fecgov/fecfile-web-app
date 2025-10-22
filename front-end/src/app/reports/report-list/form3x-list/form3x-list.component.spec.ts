import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { Form3XListComponent } from './form3x-list.component';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { of, Subject } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { provideMockStore } from '@ngrx/store/testing';
import { FormTypeDialogComponent } from 'app/reports/form-type-dialog/form-type-dialog.component';
import { TableAction } from 'app/shared/components/table-list-base/table-list-base.component';
import { ReportTypes, ReportStatus, Form3X, F3xFormTypes } from 'app/shared/models';
import { ApiService } from 'app/shared/services/api.service';
import { ReportService } from 'app/shared/services/report.service';
import { testMockStore, testActiveReport } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule, Dialog } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ReportListComponent } from '../report-list.component';

describe('Form3XListComponent', () => {
  let component: Form3XListComponent;
  let fixture: ComponentFixture<Form3XListComponent>;
  let router: Router;
  let reportService: Form3XService;
  const actions$ = new Subject<{ type: string }>();

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
        { provide: Actions, useValue: actions$ },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}),
          },
        },
      ],
    }).compileComponents();
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
        expect(action.isAvailable(report)).toBeFalse();
        report.can_unamend = true;
        expect(action.isAvailable(report)).toBeTrue();
      }
    });
  });

  it('#getEmptyItem should return a new Report instance', () => {
    const item = component['getEmptyItem']();
    expect(item.id).toBe(undefined);
  });

  it('#editItem should route properly for report_status undefined', async () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
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
    const navigateSpy = spyOn(router, 'navigateByUrl');
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
    const navigateSpy = spyOn(router, 'navigateByUrl');
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
    const navigateSpy = spyOn(router, 'navigateByUrl');
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
    const navigateSpy = spyOn(router, 'navigateByUrl');
    await component.editItem({ id: '888', report_type: ReportTypes.F3X, report_status: undefined } as Form3X);
    expect(navigateSpy).toHaveBeenCalledWith('/reports/transactions/report/888/list');
    component.editItem({
      id: '777',
      report_type: ReportTypes.F3X,
      report_status: ReportStatus.SUBMIT_FAILURE,
    } as Form3X);
    expect(navigateSpy).toHaveBeenCalledWith('/reports/f3x/submit/status/777');
  });

  it('#amend should hit service', fakeAsync(async () => {
    const amendSpy = spyOn(reportService, 'startAmendment').and.returnValue(Promise.resolve(''));
    await component.amendReport({ id: '999' } as Form3X);
    expect(amendSpy).toHaveBeenCalled();
  }));

  describe('unamend', () => {
    it('should hit service', fakeAsync(async () => {
      const unamendSpy = spyOn(reportService, 'startUnamendment').and.returnValue(Promise.resolve(''));
      await component.unamendReport({ id: '999' } as Form3X);
      expect(unamendSpy).toHaveBeenCalled();
    }));
  });
  it('#onActionClick should route properly', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.onRowActionClick(new TableAction('', component.editItem.bind(component)), {
      id: '888',
      report_type: ReportTypes.F3X,
    } as Form3X);
    expect(navigateSpy).toHaveBeenCalledWith('/reports/transactions/report/888/list');
  });

  it('#onDownload should open download panel properly', async () => {
    const generateSpy = spyOn(component.dotFecService, 'generateFecFile');
    const report = { id: '888', report_type: ReportTypes.F3X } as Form3X;
    spyOn(component.itemService, 'update').and.resolveTo(report);
    await component.onRowActionClick(new TableAction('', component.download.bind(component)), report);
    expect(generateSpy).toHaveBeenCalledWith(report);
  });

  it('#displayName should display the item form_type code', () => {
    const item: Form3X = Form3X.fromJSON({ form_type: F3xFormTypes.F3XT });
    const name: string = component.displayName(item);
    expect(name).toBe(F3xFormTypes.F3XT);
  });

  // it('edit a F24 should go to F24 edit page', () => {
  //   const navigateSpy = spyOn(router, 'navigateByUrl');
  //   const item: Form24 = Form24.fromJSON({ id: '99', report_type: ReportTypes.F24 });
  //   component.editItem(item);
  //   expect(navigateSpy).toHaveBeenCalledWith('/reports/transactions/report/99/list');
  // });

  // it('edit a F1M should go to F1M edit page', () => {
  //   const navigateSpy = spyOn(router, 'navigateByUrl');
  //   const item: Form1M = Form1M.fromJSON({ id: '99', report_type: ReportTypes.F1M });
  //   component.editItem(item);
  //   expect(navigateSpy).toHaveBeenCalledWith('/reports/f1m/edit/99');
  // });

  describe('deleteReport', () => {
    it('should call confirm', () => {
      const confirmSpy = spyOn(component.confirmationService, 'confirm');
      component.confirmDelete(testActiveReport());
      expect(confirmSpy).toHaveBeenCalledTimes(1);
    });

    it('should delete', fakeAsync(async () => {
      const report = testActiveReport();
      const deleteSpy = spyOn(reportService, 'delete').and.returnValue(Promise.resolve(null));
      const messageServiceSpy = spyOn(component.messageService, 'add');
      await component.delete(report);
      expect(deleteSpy).toHaveBeenCalledOnceWith(report);
      expect(messageServiceSpy).toHaveBeenCalledOnceWith({
        severity: 'success',
        summary: 'Successful',
        detail: 'Report Deleted',
        life: 3000,
      });
    }));
  });
});
