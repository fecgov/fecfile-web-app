import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'app/shared/services/api.service';
import { ReportListComponent } from './report-list.component';
import { Form3X, F3xFormTypes } from '../../shared/models/form-3x.model';
import { Report, ReportTypes } from '../../shared/models/report.model';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { UploadSubmission } from 'app/shared/models/upload-submission.model';
import { TableAction } from 'app/shared/components/table-list-base/table-list-base.component';
import { FormTypeDialogComponent } from '../form-type-dialog/form-type-dialog.component';
import { Dialog, DialogModule } from 'primeng/dialog';
import { ReportService } from 'app/shared/services/report.service';
import { Form1M } from 'app/shared/models/form-1m.model';
import { Form24 } from 'app/shared/models/form-24.model';
import { of } from 'rxjs';

describe('ReportListComponent', () => {
  let component: ReportListComponent;
  let fixture: ComponentFixture<ReportListComponent>;
  let router: Router;
  let reportService: ReportService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TableModule, ToolbarModule, RouterTestingModule.withRoutes([]), DialogModule],
      declarations: [ReportListComponent, FormTypeDialogComponent, Dialog],
      providers: [ConfirmationService, MessageService, ApiService, provideMockStore(testMockStore)],
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

  it('#getEmptyItem should return a new Report instance', () => {
    const item = component['getEmptyItem']();
    expect(item.id).toBe(undefined);
  });

  it('#editItem should route properly', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.editItem({ id: '999', is_first: true, report_type: ReportTypes.F3X } as Form3X); // 999 is the cash on hand report
    expect(navigateSpy).toHaveBeenCalledWith('/reports/f3x/create/cash-on-hand/999');
    component.editItem({ id: '888', report_type: ReportTypes.F3X } as Report);
    expect(navigateSpy).toHaveBeenCalledWith('/reports/transactions/report/888/list');
    component.editItem({
      id: '777',
      report_type: ReportTypes.F3X,
      upload_submission: UploadSubmission.fromJSON({ fec_status: 'ACCEPTED' }),
    } as Report);
    expect(navigateSpy).toHaveBeenCalledWith('/reports/f3x/submit/status/777');
  });

  it('#amend should hit service', () => {
    const amendSpy = spyOn(reportService, 'startAmendment').and.returnValue(of(''));
    component.amendReport({ id: '999' } as Report);
    expect(amendSpy).toHaveBeenCalled();
  });

  it('#onActionClick should route properly', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.onRowActionClick(new TableAction('', component.editItem.bind(component)), {
      id: '888',
      report_type: ReportTypes.F3X,
    } as Report);
    expect(navigateSpy).toHaveBeenCalledWith('/reports/transactions/report/888/list');
    component.onRowActionClick(new TableAction('', component.goToTest.bind(component)), { id: '888' } as Report);
    expect(navigateSpy).toHaveBeenCalledWith('/reports/f3x/test-dot-fec/888');
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
});
