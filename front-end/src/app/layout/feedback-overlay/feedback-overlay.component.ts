import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback } from 'app/shared/models/feedback.model';
import { FeedbackService } from 'app/shared/services/feedback.service';
import { OverlayPanel } from 'primeng/overlaypanel';

enum SubmissionStates {
  DRAFT,
  SUCCESS,
  FAIL,
}

@Component({
  selector: 'app-feedback-overlay',
  templateUrl: './feedback-overlay.component.html',
  styleUrls: ['./feedback-overlay.component.scss'],
})
export class FeedbackOverlayComponent {
  @ViewChild(OverlayPanel) op!: OverlayPanel;

  form: FormGroup = this.fb.group({
    action: ['', [Validators.required, Validators.maxLength(2000)]],
    feedback: ['', [Validators.maxLength(2000)]],
    about: ['', Validators.maxLength(2000)],
  });
  formSubmitted = false;
  SubmissionStatesEnum = SubmissionStates;
  submitStatus = this.SubmissionStatesEnum.DRAFT;

  constructor(
    private fb: FormBuilder,
    public feedbackService: FeedbackService,
  ) { }

  show(event: any, target: any): void {
    this.reset();
    this.op.show(event, target);
  }

  hide(): void {
    this.reset();
    this.op.hide();
  }

  save() {
    this.formSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    const feedback: Feedback = {
      action: this.form.get('action')?.value,
      feedback: this.form.get('feedback')?.value,
      about: this.form.get('about')?.value,
      location: window.location.href,
    }
    this.feedbackService.submitFeedback(feedback).then(() => {
      this.submitStatus = this.SubmissionStatesEnum.SUCCESS;
    }, () => {
      this.submitStatus = this.SubmissionStatesEnum.FAIL;
    });
  }

  reset() {
    this.form.reset();
    this.formSubmitted = false;
    this.submitStatus = this.SubmissionStatesEnum.DRAFT;
  }

  tryAgain() {
    this.submitStatus = this.SubmissionStatesEnum.DRAFT;
  }

}
