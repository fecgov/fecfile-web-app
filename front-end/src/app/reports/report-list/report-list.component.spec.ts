import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'app/shared/services/api.service';
import { ReportListComponent } from './report-list.component';
import { F3xSummary, F3xFormTypes } from '../../shared/models/f3x-summary.model';
import { Report } from '../../shared/interfaces/report.interface';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { UploadSubmission } from 'app/shared/models/upload-submission.model';
import { TableAction } from 'app/shared/components/table-list-base/table-list-base.component';
import { FormTypeDialogComponent } from '../form-type-dialog/form-type-dialog.component';
import { Dialog, DialogModule } from 'primeng/dialog';
import { ReportService } from 'app/shared/services/report.service';
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

  it('#getEmptyItem should return a new F3xSummary instance', () => {
    const item: F3xSummary = component['getEmptyItem']();
    expect(item.id).toBe(undefined);
  });

  it('#editItem should route properly', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.editItem({ id: '999' } as F3xSummary); // 999 is the cash on hand report
    expect(navigateSpy).toHaveBeenCalledWith('/reports/f3x/create/cash-on-hand/999');
    component.editItem({ id: '888' } as F3xSummary);
    expect(navigateSpy).toHaveBeenCalledWith('/reports/transactions/report/888/list');
    component.editItem({
      id: '777',
      upload_submission: UploadSubmission.fromJSON({ fec_status: 'ACCEPTED' }),
    } as F3xSummary);
    expect(navigateSpy).toHaveBeenCalledWith('/reports/f3x/submit/status/777');
  });

  it('#amend should hit service', () => {
    const amendSpy = spyOn(reportService, 'startAmendment').and.returnValue(of(''));
    component.amendReport({ id: '999' } as F3xSummary);
    expect(amendSpy).toHaveBeenCalled();
  });

  it('#onActionClick should route properly', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.onRowActionClick(new TableAction('', component.editItem.bind(component)), { id: '888' } as F3xSummary);
    expect(navigateSpy).toHaveBeenCalledWith('/reports/transactions/report/888/list');
    component.onRowActionClick(new TableAction('', component.goToTest.bind(component)), { id: '888' } as F3xSummary);
    expect(navigateSpy).toHaveBeenCalledWith('/reports/f3x/test-dot-fec/888');
  });

  it('#displayName should display the item form_type code', () => {
    const item: Report = F3xSummary.fromJSON({ form_type: F3xFormTypes.F3XT });
    const name: string = component.displayName(item);
    expect(name).toBe(F3xFormTypes.F3XT);
  });
});
