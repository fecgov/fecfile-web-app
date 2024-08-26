import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Form3X } from 'app/shared/models/form-3x.model';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { WebPrintService } from 'app/shared/services/web-print.service';
import { SharedModule } from 'app/shared/shared.module';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { DividerModule } from 'primeng/divider';
import { of } from 'rxjs';
import { PrintPreviewComponent } from './print-preview.component';

describe('PrintPreviewComponent', () => {
  let component: PrintPreviewComponent;
  let fixture: ComponentFixture<PrintPreviewComponent>;
  let reportService: Form3XService;
  let webPrintService: WebPrintService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule, DividerModule, SharedModule],
      declarations: [PrintPreviewComponent],
      providers: [PrintPreviewComponent, provideMockStore(testMockStore)],
    }).compileComponents();
    fixture = TestBed.createComponent(PrintPreviewComponent);
    reportService = TestBed.inject(Form3XService);
    webPrintService = TestBed.inject(WebPrintService);
    component = fixture.componentInstance;
    reportSpy = spyOn(reportService, 'get').and.returnValue(of(Form3X.fromJSON({})));
    spyOn(reportService, 'update').and.returnValue(of(Form3X.fromJSON({})));
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
        fecfile_error: 'fecfile dropped the ball',
      },
    });

    component.updatePrintStatus(testF3x);
    expect(component.webPrintStage).toBe('failure');
    expect(component.printError).toBe('fecfile dropped the ball');
  });

  it('#submitPrintJob() calls the service', fakeAsync(() => {
    component.report = Form3X.fromJSON({ id: '123' });
    component.pollingTime = 0;
    const submit = spyOn(webPrintService, 'submitPrintJob').and.callFake(() => Promise.resolve());
    const poll = spyOn(component, 'pollPrintStatus');
    const update = spyOn(reportService, 'fecUpdate').and.callFake(() => of(component.report));
    component.submitPrintJob();

    tick(100);
    expect(update).toHaveBeenCalled();
    expect(submit).toHaveBeenCalled();
    expect(poll).toHaveBeenCalled();
  }));

  it('#submitPrintJob() sets failure state on failure', fakeAsync(() => {
    component.report = Form3X.fromJSON({ id: '123' });
    component.pollingTime = 0;
    spyOn(webPrintService, 'submitPrintJob').and.returnValue(Promise.reject('failed'));
    const poll = spyOn(component, 'pollPrintStatus');
    spyOn(reportService, 'fecUpdate').and.returnValue(of(component.report));
    component.submitPrintJob();

    tick(100);
    expect(poll).not.toHaveBeenCalled();
    expect(component.webPrintStage).toBe('failure');
    expect(component.printError).toBe('Failed to compile PDF');
  }));
});
