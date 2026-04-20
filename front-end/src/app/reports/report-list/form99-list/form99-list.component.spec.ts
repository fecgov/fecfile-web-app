import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Form99ListComponent } from './form99-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { FormTypeDialogComponent } from 'app/reports/form-type-dialog/form-type-dialog.component';
import { ApiService } from 'app/shared/services/api.service';
import { ScannedActionsSubject } from '@ngrx/store';
import { ReportService } from 'app/shared/services/report.service';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule, Dialog } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { of } from 'rxjs';
import { ReportListComponent } from '../report-list.component';
import { Form99, ReportStatus, ReportTypes } from 'app/shared/models';
import { ROUTES } from 'app/routes';

function getStatusLink(report: Form99): string {
  return `/reports/f99/submit/status/${report.id}`;
}

function getEditLink(report: Form99): string {
  return `/reports/f99/edit/${report.id}`;
}

const successForm = Form99.fromJSON({
  id: 'success_id',
  report_type: ReportTypes.F99,
  report_status: ReportStatus.SUBMIT_SUCCESS,
});
const failureForm = Form99.fromJSON({
  id: 'failure_id',
  report_type: ReportTypes.F99,
  report_status: ReportStatus.SUBMIT_FAILURE,
});
const inprogForm = Form99.fromJSON({
  id: 'inprog_id',
  report_type: ReportTypes.F99,
  report_status: ReportStatus.IN_PROGRESS,
});

describe('Form99List', () => {
  let router: Router;
  let component: Form99ListComponent;
  let fixture: ComponentFixture<Form99ListComponent>;

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
        ScannedActionsSubject,
        provideMockStore(testMockStore()),
        provideRouter(ROUTES),
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
    fixture = TestBed.createComponent(Form99ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#editItem should route to list link for in-progress report', async () => {
    const navigateSpy = vi.spyOn(router, 'navigateByUrl');
    await component.editItem(inprogForm);
    expect(navigateSpy).toHaveBeenCalledWith(getEditLink(inprogForm));
  });
  it('#reviewItem should route to status link for success report', async () => {
    const navigateSpy = vi.spyOn(router, 'navigateByUrl');
    await component.reviewItem(successForm);
    expect(navigateSpy).toHaveBeenCalledWith(getStatusLink(successForm));
  });

  it('#reviewItem should route to status link for failure report', async () => {
    const navigateSpy = vi.spyOn(router, 'navigateByUrl');
    await component.reviewItem(failureForm);
    expect(navigateSpy).toHaveBeenCalledWith(getStatusLink(failureForm));
  });
});
