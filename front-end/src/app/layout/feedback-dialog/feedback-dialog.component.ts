import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback } from 'app/shared/models/feedback.model';
import { FeedbackService } from 'app/shared/services/feedback.service';

enum SubmissionStates {
  DRAFT,
  SUCCESS,
  FAIL,
}

@Component({
  selector: 'app-feedback-dialog',
  templateUrl: './feedback-dialog.component.html',
  styleUrls: ['./feedback-dialog.component.scss'],
})
export class FeedbackDialogComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  form: FormGroup = this.fb.group({
    action: ['', [Validators.required, Validators.maxLength(2000)]],
    feedback: ['', [Validators.maxLength(2000)]],
    about: ['', Validators.maxLength(2000)],
  });
  formSubmitted = false;
  SubmissionStatesEnum = SubmissionStates;
  submitStatus = this.SubmissionStatesEnum.DRAFT;
  uri = '';

  constructor(
    private fb: FormBuilder,
    public feedbackService: FeedbackService,
  ) { }

  openDialog(): void {
    this.reset();
  }

  closeDialog(): void {
    this.reset();
    this.visibleChange.emit(false);
    this.visible = false;
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
