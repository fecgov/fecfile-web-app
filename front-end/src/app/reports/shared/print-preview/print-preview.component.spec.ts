import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { Form3X } from 'app/shared/models/form-3x.model';
import { SharedModule } from 'app/shared/shared.module';
import { DividerModule } from 'primeng/divider';
import { PrintPreviewComponent } from './print-preview.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { of } from 'rxjs';
import { WebPrintService } from 'app/shared/services/web-print.service';

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
    spyOn(reportService, 'get').and.returnValue(of(Form3X.fromJSON({})));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Sets the status messages as expected', fakeAsync(() => {
    const refresh = spyOn(component, 'refreshReportStatus');
    component.pollPrintStatus();
    tick(5001);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(refresh).toHaveBeenCalled();
      expect(component.pollingStatusMessage).toBe('This may take a while...');
    });
  }));

  it('refreshes the active report', () => {
    const refresh = spyOn(webPrintService, 'getStatus');
    component.refreshReportStatus();
    expect(refresh).toHaveBeenCalled();
  });

  it('Updates with a failed report', () => {
    const testF3x: Form3X = Form3X.fromJSON({
      webprint_submission: {
        fec_status: 'FAILED',
        fecfile_error: "Things didn't work out...",
      },
    });

    component.updatePrintStatus(testF3x);
    expect(component.webPrintStage).toBe('failure');
    expect(component.printError).toBe("Things didn't work out...");
  });

  it('Updates with an unsubmitted report', () => {
    const testF3x: Form3X = Form3X.fromJSON({
      webprint_submission: null,
    });

    component.updatePrintStatus(testF3x);
    expect(component.webPrintStage).toBe('not-submitted');
  });

  it('Updates with a processing report', () => {
    const testF3x: Form3X = Form3X.fromJSON({
      webprint_submission: {
        fec_status: 'PROCESSING',
      },
    });

    component.updatePrintStatus(testF3x);
    expect(component.webPrintStage).toBe('checking');
    expect(component.pollingStatusMessage).toBe(
      'Your report is still being processed. Please check back later to access your PDF'
    );
  });

  it('#submitPrintJob() calls the service', fakeAsync(() => {
    const submit = spyOn(webPrintService, 'submitPrintJob');
    const refresh = spyOn(component, 'refreshReportStatus');
    component.submitPrintJob();
    expect(submit).toHaveBeenCalled();
    tick(5001);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(refresh).toHaveBeenCalled();
    });
  }));
});
