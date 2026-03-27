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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#show happy path', () => {
    component.show(null);
    expect(component.formSubmitted).toBe(false);
    expect(component.submitStatus).toEqual(component.SubmissionStatesEnum.DRAFT);
  });

  it('#hide happy path', () => {
    component.onHide();
    expect(component.formSubmitted).toBe(false);
    expect(component.submitStatus).toEqual(component.SubmissionStatesEnum.DRAFT);
  });

  it('#save happy path', async () => {
    const test_action = 'test_action';
    const test_feedback = 'test_feedback';
    const test_about = 'test_about';
    component.form.get('action')?.setValue(test_action);
    component.form.get('feedback')?.setValue(test_feedback);
    component.form.get('about')?.setValue(test_about);

    const submitFeedbackSpy = vi.spyOn(component.feedbackService, 'submitFeedback').mockResolvedValue();
    await component.submitForm();
    expect(submitFeedbackSpy).toHaveBeenCalledTimes(1);
    expect(submitFeedbackSpy).toHaveBeenCalledWith({
      action: test_action,
      feedback: test_feedback,
      about: test_about,
      location: window.location.href,
    });
    expect(component.submitStatus).toEqual(component.SubmissionStatesEnum.SUCCESS);
  });

  it('#save error', async () => {
    const test_action = 'test_action';
    const test_feedback = 'test_feedback';
    const test_about = 'test_about';
    component.form.get('action')?.setValue(test_action);
    component.form.get('feedback')?.setValue(test_feedback);
    component.form.get('about')?.setValue(test_about);

    const submitFeedbackSpy = vi
      .spyOn(component.feedbackService, 'submitFeedback')
      .mockRejectedValue(new Error('Async error'));
    await component.submitForm();
    expect(submitFeedbackSpy).toHaveBeenCalledTimes(1);
    expect(submitFeedbackSpy).toHaveBeenCalledWith({
      action: test_action,
      feedback: test_feedback,
      about: test_about,
      location: window.location.href,
    });
    expect(component.submitStatus).toEqual(component.SubmissionStatesEnum.FAIL);
  });

  it('#reset happy path', () => {
    component.reset();
    expect(component.formSubmitted).toBe(false);
    expect(component.submitStatus).toEqual(component.SubmissionStatesEnum.DRAFT);
  });

  it('#tryAgain happy path', () => {
    component.tryAgain();
    expect(component.submitStatus).toEqual(component.SubmissionStatesEnum.DRAFT);
  });
});
