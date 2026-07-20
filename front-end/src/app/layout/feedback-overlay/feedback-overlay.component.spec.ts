import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PopoverModule } from 'primeng/popover';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { FeedbackOverlayComponent } from './feedback-overlay.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { submit } from '@angular/forms/signals';

describe('FeedbackOverlayComponent', () => {
  let component: FeedbackOverlayComponent;
  let fixture: ComponentFixture<FeedbackOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastModule, TableModule, PopoverModule, ConfirmDialogModule, FeedbackOverlayComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ConfirmationService,
        MessageService,
        provideMockStore(testMockStore()),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackOverlayComponent);
    component = fixture.componentInstance;

    const asideEl = component.aside().nativeElement;
    if (!asideEl.showPopover) {
      asideEl.showPopover = vi.fn();
      asideEl.hidePopover = vi.fn();
    }

    const originalMatches = asideEl.matches;
    asideEl.matches = vi.fn().mockImplementation((selector) => {
      if (selector === ':popover-open') return true;
      return originalMatches.call(asideEl, selector);
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#show happy path', () => {
    component.aside().nativeElement.showPopover();
    expect(component.submitStatus).toEqual(component.SubmissionStates.DRAFT);
  });

  it('#hide happy path', () => {
    component.aside().nativeElement.hidePopover();
    expect(component.submitStatus).toEqual(component.SubmissionStates.DRAFT);
  });

  it('should hide popover on Escape key', () => {
    const asideEl = component.aside().nativeElement;
    const hideSpy = vi.spyOn(asideEl, 'hidePopover');
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(hideSpy).toHaveBeenCalled();
  });

  it('#save happy path', async () => {
    const action = 'test_action';
    const feedback = 'test_feedback';
    const about = 'test_about';
    component.form().reset({ action, about, feedback });

    const submitFeedbackSpy = vi.spyOn(component.feedbackService, 'submitFeedback').mockResolvedValue();
    await submit(component.form);
    expect(submitFeedbackSpy).toHaveBeenCalledTimes(1);
    expect(submitFeedbackSpy).toHaveBeenCalledWith({ action, feedback, about });
    expect(component.submitStatus).toEqual(component.SubmissionStates.SUCCESS);
  });

  it('#save error', async () => {
    const action = 'test_action';
    const feedback = 'test_feedback';
    const about = 'test_about';
    component.form().reset({ action, about, feedback });

    const submitFeedbackSpy = vi
      .spyOn(component.feedbackService, 'submitFeedback')
      .mockRejectedValue(new Error('Async error'));
    await submit(component.form);
    expect(submitFeedbackSpy).toHaveBeenCalledTimes(1);
    expect(submitFeedbackSpy).toHaveBeenCalledWith({ action, feedback, about });
    expect(component.submitStatus).toEqual(component.SubmissionStates.FAIL);
  });

  it('is unable to save without action', async () => {
    component.form().reset({ action: '', feedback: '', about: 'test' });
    expect(component.form().valid()).toBe(false);
    const submitFeedbackSpy = vi.spyOn(component.feedbackService, 'submitFeedback').mockResolvedValue();
    await submit(component.form);
    expect(submitFeedbackSpy).not.toHaveBeenCalled();
    expect(component.submitStatus).toEqual(component.SubmissionStates.DRAFT);
  });

  it('#reset happy path', () => {
    component.reset();
    expect(component.submitStatus).toEqual(component.SubmissionStates.DRAFT);
  });

  it('#tryAgain happy path', () => {
    component.reset(false);
    expect(component.submitStatus).toEqual(component.SubmissionStates.DRAFT);
  });
});
