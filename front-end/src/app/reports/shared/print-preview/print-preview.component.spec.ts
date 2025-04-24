import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ReportService } from 'app/shared/services/report.service';
import { WebPrintService } from 'app/shared/services/web-print.service';
import { PrintPreviewComponent } from './print-preview.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { of } from 'rxjs';
import { Report } from 'app/shared/models';

describe('PrintPreviewComponent', () => {
  let component: PrintPreviewComponent;
  let reportService: jasmine.SpyObj<ReportService>;
  let webPrintService: jasmine.SpyObj<WebPrintService>;
  let router: jasmine.SpyObj<Router>;
  let route: ActivatedRoute;
  let store: Store;

  const mockReport: Report = {
    id: '1',
    formLabel: 'Form X',
    formSubLabel: 'Quarterly',
    webprint_submission: {
      fec_status: 'COMPLETED',
      fecfile_task_state: 'SUCCEEDED',
      fec_image_url: 'http://example.com/file.pdf',
      created: '2025-04-23',
    },
  } as unknown as Report;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PrintPreviewComponent,
        provideMockStore({
          selectors: [
            { selector: selectActiveReport, value: mockReport },
            { selector: selectCommitteeAccount, value: { id: 1 } },
          ],
        }),
        { provide: ReportService, useValue: jasmine.createSpyObj('ReportService', ['get', 'fecUpdate']) },
        { provide: WebPrintService, useValue: jasmine.createSpyObj('WebPrintService', ['submitPrintJob']) },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigateByUrl']) },
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              getBackUrl: () => '/back',
              getContinueUrl: () => '/continue',
            }),
          },
        },
      ],
    });

    component = TestBed.inject(PrintPreviewComponent);
    reportService = TestBed.inject(ReportService) as jasmine.SpyObj<ReportService>;
    webPrintService = TestBed.inject(WebPrintService) as jasmine.SpyObj<WebPrintService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    route = TestBed.inject(ActivatedRoute);
    store = TestBed.inject(Store);
  });

  it('should compute downloadURL correctly', () => {
    expect(component.downloadURL()).toBe('http://example.com/file.pdf');
  });

  it('should compute submitDate correctly', () => {
    expect(component.submitDate()).toBe(new Date('2025-04-23'));
  });

  it('should detect webPrintStage as "success"', () => {
    expect(component.webPrintStage()).toBe('success');
  });

  it('should open the download URL in a new tab when downloadPDF is called', () => {
    spyOn(window, 'open');
    component.downloadPDF();
    expect(window.open).toHaveBeenCalledWith('http://example.com/file.pdf', '_blank');
  });

  it('should call webPrintService.submitPrintJob and pollPrintStatus on successful submit', async () => {
    const pollSpy = spyOn(component, 'pollPrintStatus').and.stub();
    webPrintService.submitPrintJob.and.resolveTo();
    reportService.fecUpdate.and.resolveTo();

    await component.submitPrintJob();
    expect(webPrintService.submitPrintJob).toHaveBeenCalledWith(mockReport.id!);
    expect(pollSpy).toHaveBeenCalled();
  });

  it('should update report with error on submitPrintJob failure', async () => {
    webPrintService.submitPrintJob.and.rejectWith(new Error('fail'));
    reportService.fecUpdate.and.resolveTo();

    await component.submitPrintJob();

    expect(component.report().webprint_submission?.fecfile_task_state).toBe('FAILED');
    expect(component.report().webprint_submission?.fec_message).toBe('Failed to compile PDF');
  });

  it('should navigate using getBackUrl and getContinueUrl', () => {
    component.router.navigateByUrl(component.getBackUrl()(mockReport));
    expect(router.navigateByUrl).toHaveBeenCalledWith('/back');

    component.router.navigateByUrl(component.getContinueUrl()(mockReport));
    expect(router.navigateByUrl).toHaveBeenCalledWith('/continue');
  });
});
