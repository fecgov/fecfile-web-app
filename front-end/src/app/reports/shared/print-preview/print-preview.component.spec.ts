import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Form3X } from 'app/shared/models/form-3x.model';
import { Form99 } from 'app/shared/models/form-99.model';
import { ReportService } from 'app/shared/services/report.service';
import { WebPrintService } from 'app/shared/services/web-print.service';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { DividerModule } from 'primeng/divider';
import { PrintPreviewComponent } from './print-preview.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('PrintPreviewComponent', () => {
  let component: PrintPreviewComponent;
  let fixture: ComponentFixture<PrintPreviewComponent>;
  let reportService: ReportService;
  let webPrintService: WebPrintService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PrintPreviewComponent, DividerModule, PrintPreviewComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([]), provideMockStore(testMockStore)],
    }).compileComponents();
    fixture = TestBed.createComponent(PrintPreviewComponent);
    reportService = TestBed.inject(ReportService);
    webPrintService = TestBed.inject(WebPrintService);
    component = fixture.componentInstance;
    spyOn(reportService, 'get').and.returnValue(Promise.resolve(Form3X.fromJSON({})));
    spyOn(reportService, 'update').and.returnValue(Promise.resolve(Form3X.fromJSON({})));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('is not-submitted when there is no submission object', () => {
    const testF3x: Form3X = Form3X.fromJSON({
      webprint_submission: undefined,
    });

    component.updatePrintStatus(testF3x);
    expect(component.webPrintStage).toBe('not-submitted');
  });

  it('is checking when the report is processing', () => {
    const testF3x: Form3X = Form3X.fromJSON({
      webprint_submission: {
        fec_status: 'PROCESSING',
      },
    });

    component.updatePrintStatus(testF3x);
    expect(component.webPrintStage).toBe('checking');
  });

  it('is success when the report is complete', () => {
    const testF3x: Form3X = Form3X.fromJSON({
      webprint_submission: {
        fec_status: 'COMPLETED',
        fecfile_task_state: 'SUCCEEDED',
        fec_image_url: 'http://example.com',
      },
    });
    component.updatePrintStatus(testF3x);
    expect(component.webPrintStage).toBe('success');
    expect(component.downloadURL).toBe('http://example.com');
  });

  it('is failure when the report is failed', () => {
    const testF3x: Form3X = Form3X.fromJSON({
      webprint_submission: {
        fec_status: 'FAILED',
        fec_message: 'Something failed on efo.',
      },
    });
    component.updatePrintStatus(testF3x);
    expect(component.printError).toBe('Something failed on efo.');
  });

  it('Updates with a failed report', () => {
    const testF3x: Form3X = Form3X.fromJSON({
      webprint_submission: {
        fecfile_task_state: 'FAILED',
        fecfile_error: 'fecfile+ dropped the ball',
      },
    });

    component.updatePrintStatus(testF3x);
    expect(component.webPrintStage).toBe('failure');
    expect(component.printError).toBe('fecfile+ dropped the ball');
  });

  it('#submitPrintJob() calls the service', fakeAsync(() => {
    const submit = spyOn(webPrintService, 'submitPrintJob').and.callFake(() =>
      Promise.resolve({ submission_id: '123' }),
    );
    const poll = spyOn(component, 'listenForPrintStatus');
    const update = spyOn(reportService, 'fecUpdate').and.callFake(() => Promise.resolve(component.report()));
    component.submitPrintJob();

    tick();
    expect(update).toHaveBeenCalled();
    expect(submit).toHaveBeenCalled();
    expect(poll).toHaveBeenCalled();
  }));

  it('#submitPrintJob() calls the service for a non-F3X report', fakeAsync(() => {
    component.report.set(Form99.fromJSON({ id: '123' }));
    const submit = spyOn(webPrintService, 'submitPrintJob').and.callFake(() =>
      Promise.resolve({ submission_id: '123' }),
    );
    const poll = spyOn(component, 'listenForPrintStatus');
    component.submitPrintJob();

    tick();
    expect(submit).toHaveBeenCalled();
    expect(poll).toHaveBeenCalled();
  }));

  it('#submitPrintJob() sets failure state on failure', fakeAsync(() => {
    spyOn(webPrintService, 'submitPrintJob').and.returnValue(Promise.reject('failed'));
    const poll = spyOn(component, 'listenForPrintStatus');
    spyOn(reportService, 'fecUpdate').and.returnValue(Promise.resolve(component.report()));
    component.submitPrintJob();

    tick();
    expect(poll).not.toHaveBeenCalled();
    expect(component.webPrintStage).toBe('failure');
    expect(component.printError).toBe('Failed to compile PDF');
  }));
});
