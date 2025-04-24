import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testActiveReport, testMockStore } from 'app/shared/utils/unit-test.utils';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'app/shared/services/api.service';
import { ReportListComponent } from './report-list.component';
import { ActivatedRoute, Router } from '@angular/router';
import { createAction } from 'app/shared/components/table-list-base/table-list-base.component';
import { FormTypeDialogComponent } from '../form-type-dialog/form-type-dialog.component';
import { Dialog, DialogModule } from 'primeng/dialog';
import { ReportService } from 'app/shared/services/report.service';
import { of, Subject } from 'rxjs';
import { Actions } from '@ngrx/effects';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Report, ReportTypes, UploadSubmission, Form3X, F3xFormTypes, Form24, Form1M } from 'app/shared/models';

describe('ReportListComponent', () => {
  let component: ReportListComponent;
  let fixture: ComponentFixture<ReportListComponent>;
  let router: Router;
  let reportService: ReportService;
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
        provideMockStore(testMockStore),
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
    reportService = TestBed.inject(ReportService);
    fixture = TestBed.createComponent(ReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('rowActions', () => {
    it('should have "Unamend" if report can_unamend', () => {
      const report = testActiveReport;
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

  it('#editItem should route properly', async () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    await component.editItem({ id: '888', report_type: ReportTypes.F3X } as Report);
    expect(navigateSpy).toHaveBeenCalledWith('/reports/transactions/report/888/list');
    component.editItem({
      id: '777',
      report_type: ReportTypes.F3X,
      upload_submission: UploadSubmission.fromJSON({ fec_status: 'ACCEPTED' }),
    } as Report);
    expect(navigateSpy).toHaveBeenCalledWith('/reports/f3x/submit/status/777');
  });

  it('#amend should hit service', fakeAsync(async () => {
    const amendSpy = spyOn(reportService, 'startAmendment').and.returnValue(Promise.resolve(''));
    await component.amendReport({ id: '999' } as Report);
    expect(amendSpy).toHaveBeenCalled();
  }));

  describe('unamend', () => {
    it('should hit service', fakeAsync(async () => {
      const unamendSpy = spyOn(reportService, 'startUnamendment').and.returnValue(Promise.resolve(''));
      await component.unamendReport({ id: '999' } as Report);
      expect(unamendSpy).toHaveBeenCalled();
    }));
  });
  it('#onActionClick should route properly', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.onRowActionClick(createAction('', component.editItem.bind(component)), {
      id: '888',
      report_type: ReportTypes.F3X,
    } as Report);
    expect(navigateSpy).toHaveBeenCalledWith('/reports/transactions/report/888/list');
  });

  it('#onDownload should open download panel properly', () => {
    const generateSpy = spyOn(component.dotFecService, 'generateFecFile');
    const report = { id: '888' } as Report;
    component.onRowActionClick(createAction('', component.download.bind(component)), report);
    expect(generateSpy).toHaveBeenCalledWith(report);
  });

  it('#displayName should display the item form_type code', () => {
    const item: Report = Form3X.fromJSON({ form_type: F3xFormTypes.F3XT });
    const name: string = component.displayName(item);
    expect(name).toBe(F3xFormTypes.F3XT);
  });

  it('edit a F24 should go to F24 edit page', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    const item: Report = Form24.fromJSON({ id: '99', report_type: ReportTypes.F24 });
    component.editItem(item);
    expect(navigateSpy).toHaveBeenCalledWith('/reports/transactions/report/99/list');
  });

  it('edit a F1M should go to F1M edit page', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    const item: Report = Form1M.fromJSON({ id: '99', report_type: ReportTypes.F1M });
    component.editItem(item);
    expect(navigateSpy).toHaveBeenCalledWith('/reports/f1m/edit/99');
  });

  describe('deleteReport', () => {
    it('should call confirm', () => {
      const confirmSpy = spyOn(component.confirmationService, 'confirm');
      component.confirmDelete(testActiveReport);
      expect(confirmSpy).toHaveBeenCalledTimes(1);
    });

    it('should delete', fakeAsync(async () => {
      const deleteSpy = spyOn(reportService, 'delete').and.returnValue(Promise.resolve(null));
      const messageServiceSpy = spyOn(component.messageService, 'add');
      await component.delete(testActiveReport);
      expect(deleteSpy).toHaveBeenCalledOnceWith(testActiveReport);
      expect(messageServiceSpy).toHaveBeenCalledOnceWith({
        severity: 'success',
        summary: 'Successful',
        detail: 'Report Deleted',
        life: 3000,
      });
    }));
  });
});
