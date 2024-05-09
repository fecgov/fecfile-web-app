import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { FeedbackOverlayComponent } from './feedback-overlay.component';

describe('FeedbackOverlayComponent', () => {
  let component: FeedbackOverlayComponent;
  let fixture: ComponentFixture<FeedbackOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastModule, TableModule, OverlayPanelModule, ConfirmDialogModule, HttpClientTestingModule],
      declarations: [FeedbackOverlayComponent],
      providers: [ConfirmationService, MessageService, provideMockStore(testMockStore)],
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
    expect(component.formSubmitted).toBeFalse();
    expect(component.submitStatus).toEqual(component.SubmissionStatesEnum.DRAFT);
  });

  it('#hide happy path', () => {
    component.onHide();
    expect(component.formSubmitted).toBeFalse();
    expect(component.submitStatus).toEqual(component.SubmissionStatesEnum.DRAFT);
  });

  it('#save happy path', fakeAsync(() => {
    const test_action = 'test_action';
    const test_feedback = 'test_feedback';
    const test_about = 'test_about';
    component.form.get('action')?.setValue(test_action);
    component.form.get('feedback')?.setValue(test_feedback);
    component.form.get('about')?.setValue(test_about);

    const submitFeedbackSpy = spyOn(component.feedbackService, 'submitFeedback').and.resolveTo();
    component.save();
    expect(submitFeedbackSpy).toHaveBeenCalledOnceWith(jasmine.objectContaining({
      action: test_action,
      feedback: test_feedback,
      about: test_about,
    }));
    tick(1000);
    expect(component.submitStatus).toEqual(component.SubmissionStatesEnum.SUCCESS);
  }));

  it('#save error', fakeAsync(() => {
    const test_action = 'test_action';
    const test_feedback = 'test_feedback';
    const test_about = 'test_about';
    component.form.get('action')?.setValue(test_action);
    component.form.get('feedback')?.setValue(test_feedback);
    component.form.get('about')?.setValue(test_about);

    const submitFeedbackSpy = spyOn(component.feedbackService, 'submitFeedback').and.rejectWith();
    component.save();
    expect(submitFeedbackSpy).toHaveBeenCalledOnceWith(jasmine.objectContaining({
      action: test_action,
      feedback: test_feedback,
      about: test_about,
    }));
    tick(1000);
    expect(component.submitStatus).toEqual(component.SubmissionStatesEnum.FAIL);
  }));

  it('#reset happy path', () => {
    component.reset();
    expect(component.formSubmitted).toBeFalse();
    expect(component.submitStatus).toEqual(component.SubmissionStatesEnum.DRAFT);
  });

  it('#tryAgain happy path', () => {
    component.tryAgain();
    expect(component.submitStatus).toEqual(component.SubmissionStatesEnum.DRAFT);
  });

});
