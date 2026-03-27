import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Form3X } from 'app/shared/models/reports/form-3x.model';
import { Form99 } from 'app/shared/models/reports/form-99.model';
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
  let reportService: ReportService<Form3X>;
  let webPrintService: WebPrintService<Form3X>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PrintPreviewComponent, DividerModule, PrintPreviewComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideMockStore(testMockStore()),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(PrintPreviewComponent);
    reportService = TestBed.inject(ReportService<Form3X>);
    webPrintService = TestBed.inject(WebPrintService<Form3X>);
    component = fixture.componentInstance;
    vi.spyOn(reportService, 'get').mockResolvedValue(Form3X.fromJSON({}));
    vi.spyOn(reportService, 'update').mockResolvedValue(Form3X.fromJSON({}));
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

  it('#submitPrintJob() calls the service', async () => {
    component.report = Form3X.fromJSON({ id: '123' });
    component.pollingTime = 0;
    const submit = vi.spyOn(webPrintService, 'submitPrintJob').mockResolvedValue({});
    const poll = vi.spyOn(component, 'pollPrintStatus');
    const update = vi.spyOn(reportService, 'fecUpdate').mockResolvedValue(component.report as Form3X);
    await component.submitPrintJob();

    fixture.detectChanges();
    expect(update).toHaveBeenCalled();
    expect(submit).toHaveBeenCalled();
    expect(poll).toHaveBeenCalled();
  });

  it('#submitPrintJob() calls the service for a non-F3X report', async () => {
    component.report = Form99.fromJSON({ id: '123' });
    component.pollingTime = 0;
    const submit = vi.spyOn(webPrintService, 'submitPrintJob').mockImplementation(() => Promise.resolve({}));
    const poll = vi.spyOn(component, 'pollPrintStatus');
    await component.submitPrintJob();

    fixture.detectChanges();
    expect(submit).toHaveBeenCalled();
    expect(poll).toHaveBeenCalled();
  });

  it('#submitPrintJob() sets failure state on failure', async () => {
    component.report = Form3X.fromJSON({ id: '123' });
    component.pollingTime = 0;
    vi.spyOn(webPrintService, 'submitPrintJob').mockReturnValue(Promise.reject('failed'));
    const poll = vi.spyOn(component, 'pollPrintStatus');
    vi.spyOn(reportService, 'fecUpdate').mockResolvedValue(component.report as Form3X);
    await component.submitPrintJob();

    fixture.detectChanges();
    expect(poll).not.toHaveBeenCalled();
    expect(component.webPrintStage).toBe('failure');
    expect(component.printError).toBe('Failed to compile PDF');
  });

  it('should format submitDate correctly with "at" and parentheses', () => {
    const testDate = new Date(2024, 9, 28, 17, 2);
    component.submitDate.set(testDate);

    const result = component.formattedDate();

    expect(result).toContain('Monday, October 28, 2024');
    expect(result).toContain(', at 5:02 PM');
    expect(result).toMatch(/\([a-zA-Z\s]+\)$/);
    expect(result).not.toContain('Standard Time)');
    expect(result).not.toContain('Daylight Time)');
  });

  it('should return an empty string if submitDate is undefined', () => {
    component.submitDate.set(undefined);
    expect(component.formattedDate()).toBe('');
  });
});
