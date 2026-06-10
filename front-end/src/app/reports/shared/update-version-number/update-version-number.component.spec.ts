import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateVersionNumberComponent } from './update-version-number.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { ReportService } from 'app/shared/services/report.service';
import { MessageService } from 'primeng/api';
import { testActiveReport, testF24, testMockStore } from 'app/shared/utils/unit-test.utils';
import { submit } from '@angular/forms/signals';

describe('UpdateVersionNumberComponent', () => {
  let component: UpdateVersionNumberComponent;
  let fixture: ComponentFixture<UpdateVersionNumberComponent>;
  let store: MockStore;
  let reportServiceMock: any;
  let messageService: MessageService;

  beforeEach(async () => {
    reportServiceMock = {
      updateVersionNumber: vi.fn().mockResolvedValue(undefined),
      setActiveReportById: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [UpdateVersionNumberComponent],
      providers: [
        provideMockStore(testMockStore()),
        MessageService,
        { provide: ReportService, useValue: reportServiceMock },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    messageService = TestBed.inject(MessageService);
    fixture = TestBed.createComponent(UpdateVersionNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sync original version from store selector on initialization', () => {
    expect(component.versionForm.original().value()).toBe(0);
  });

  it('should disable previousSubmissionDate if report is NOT F24', () => {
    expect(component.isF24()).toBe(false);
    expect(component.versionForm.previousSubmissionDate().disabled()).toBe(true);
  });

  it('should enable previousSubmissionDate if report is F24', () => {
    store.overrideSelector(selectActiveReport, testF24());
    store.refreshState();
    fixture.detectChanges();

    expect(component.isF24()).toBe(true);
    expect(component.versionForm.previousSubmissionDate().disabled()).toBe(false);
  });

  it('should validate amendment constraints (required, min, pattern)', () => {
    const amendmentField = component.versionForm.amendment;
    expect(amendmentField().valid()).toBe(false);

    amendmentField().value.set('0');
    expect(amendmentField().valid()).toBe(false);

    amendmentField().value.set('1.5');
    expect(amendmentField().valid()).toBe(false);

    amendmentField().value.set('1');
    expect(amendmentField().valid()).toBe(true);
  });

  it('should catch invalid date string formats on previousSubmissionDate', () => {
    store.overrideSelector(selectActiveReport, testF24());
    store.refreshState();
    fixture.detectChanges();

    const dateField = component.versionForm.previousSubmissionDate;

    dateField().value.set('01/01/20YY');
    expect(dateField().valid()).toBe(false);
    expect(dateField().errors()[0].kind).toBe('pattern');

    dateField().value.set('11/24/2026');
    expect(dateField().valid()).toBe(true);
  });

  it('should trigger error banner and reject submission if form is invalid', async () => {
    vi.spyOn(messageService, 'add');
    await submit(component.versionForm);
    expect(component.formSubmitted).toBe(true);
    expect(reportServiceMock.updateVersionNumber).not.toHaveBeenCalled();
  });

  it('should successfully update and reset form on a valid submission', async () => {
    const report = testActiveReport();
    const messageSpy = vi.spyOn(messageService, 'add');
    component.versionForm.amendment().value.set('3');
    component.versionForm.eFilingId().value.set('FEC-123456');

    await submit(component.versionForm);

    expect(reportServiceMock.updateVersionNumber).toHaveBeenCalledWith(report, {
      original: 0,
      amendment: '3',
      eFilingId: 'FEC-123456',
      previousSubmissionDate: null,
    });
    expect(reportServiceMock.setActiveReportById).toHaveBeenCalledWith(report.id);

    expect(component.versionForm.amendment().value()).toBe('');
    expect(component.versionForm.eFilingId().value()).toBe('');

    expect(messageSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'success',
        summary: 'Successful',
      }),
    );
  });

  it('should handle service errors gracefully during submission rejection cascades', async () => {
    const messageSpy = vi.spyOn(messageService, 'add');
    reportServiceMock.updateVersionNumber.mockRejectedValueOnce(new Error('Server Drop'));

    component.versionForm.amendment().value.set('1');
    component.versionForm.eFilingId().value.set('FEC-0000');

    await submit(component.versionForm);

    expect(messageSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'error',
        summary: 'Error',
      }),
    );
  });

  it('should prevent invalid keys on blockInvalidKeys', () => {
    const preventDefaultSpy = vi.fn();
    const minusEvent = new KeyboardEvent('keydown', { key: '-' });
    minusEvent.preventDefault = preventDefaultSpy;

    component['blockInvalidKeys'](minusEvent);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should allow valid numeric keys on blockInvalidKeys', () => {
    const preventDefaultSpy = vi.fn();
    const numberEvent = new KeyboardEvent('keydown', { key: '5' });
    numberEvent.preventDefault = preventDefaultSpy;

    component['blockInvalidKeys'](numberEvent);
    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });
});
