import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ApiService } from 'app/shared/services/api.service';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { FeedbackDialogComponent } from './feedback-dialog.component';

describe('FeedbackDialogComponent', () => {
  let component: FeedbackDialogComponent;
  let fixture: ComponentFixture<FeedbackDialogComponent>;
  let testApiService: ApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastModule, TableModule, DialogModule, ConfirmDialogModule, HttpClientTestingModule],
      declarations: [FeedbackDialogComponent],
      providers: [ConfirmationService, MessageService, provideMockStore(testMockStore)],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackDialogComponent);
    component = fixture.componentInstance;
    testApiService = TestBed.inject(ApiService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#openDialog happy path', () => {
    component.openDialog();
    expect(component.formSubmitted).toBeFalse();
    expect(component.submitStatus).toEqual(component.SubmissionStatesEnum.DRAFT);
  });

  it('#closeDialog happy path', () => {
    component.closeDialog();
    expect(component.visible).toBeFalse();
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
