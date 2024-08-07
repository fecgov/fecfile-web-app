import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Feedback } from 'app/shared/models/feedback.model';
import { FeedbackService } from 'app/shared/services/feedback.service';
import { blurActiveInput } from 'app/shared/utils/form.utils';
import { singleClickEnableAction } from 'app/store/single-click.actions';
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

  form: FormGroup = this.fb.group(
    {
      action: ['', [Validators.required, Validators.maxLength(2000)]],
      feedback: ['', [Validators.maxLength(2000)]],
      about: ['', Validators.maxLength(2000)],
    },
    { updateOn: 'blur' },
  );
  formSubmitted = false;
  SubmissionStatesEnum = SubmissionStates;
  submitStatus = this.SubmissionStatesEnum.DRAFT;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    public feedbackService: FeedbackService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  show(event: any): void {
    this.reset();
    this.op.show(event, 'anchor');
  }

  onHide() {
    this.reset();
  }

  save() {
    this.formSubmitted = true;
    blurActiveInput(this.form);
    if (this.form.invalid) {
      this.store.dispatch(singleClickEnableAction());
      return;
    }
    const feedback: Feedback = {
      action: this.form.get('action')?.value,
      feedback: this.form.get('feedback')?.value,
      about: this.form.get('about')?.value,
      location: window.location.href,
    };
    this.feedbackService.submitFeedback(feedback).then(
      () => {
        this.submitStatus = this.SubmissionStatesEnum.SUCCESS;
      },
      () => {
        this.submitStatus = this.SubmissionStatesEnum.FAIL;
      },
    );
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
