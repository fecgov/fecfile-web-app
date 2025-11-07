import { Component, inject, ViewChild } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Feedback } from 'app/shared/models';
import { FeedbackService } from 'app/shared/services/feedback.service';
import { Popover, PopoverModule } from 'primeng/popover';
import { ButtonDirective } from 'primeng/button';
import { FormComponent } from 'app/shared/components/form.component';
import { ErrorMessagesComponent } from 'app/shared/components/error-messages/error-messages.component';
import { SingleClickDirective } from 'app/shared/directives/single-click.directive';
import { AutoResizeDirective } from 'app/shared/directives/auto-resize.directive';

enum SubmissionStates {
  DRAFT,
  SUCCESS,
  FAIL,
}

@Component({
  selector: 'app-feedback-overlay',
  templateUrl: './feedback-overlay.component.html',
  styleUrls: ['./feedback-overlay.component.scss'],
  imports: [
    ReactiveFormsModule,
    ErrorMessagesComponent,
    SingleClickDirective,
    ButtonDirective,
    PopoverModule,
    AutoResizeDirective,
  ],
})
export class FeedbackOverlayComponent extends FormComponent {
  public readonly feedbackService = inject(FeedbackService);
  @ViewChild('op') op!: Popover;

  form: FormGroup = this.fb.group(
    {
      action: ['', [Validators.required, Validators.maxLength(2000)]],
      feedback: ['', [Validators.maxLength(2000)]],
      about: ['', Validators.maxLength(2000)],
    },
    { updateOn: 'blur' },
  );
  SubmissionStatesEnum = SubmissionStates;
  submitStatus = this.SubmissionStatesEnum.DRAFT;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  show(event: any): void {
    this.reset();
    this.op.show(event, 'anchor');
  }

  onHide() {
    this.reset();
  }

  async submit() {
    const feedback: Feedback = {
      action: this.form.get('action')?.value,
      feedback: this.form.get('feedback')?.value,
      about: this.form.get('about')?.value,
      location: window.location.href,
    };
    try {
      await this.feedbackService.submitFeedback(feedback);
      this.submitStatus = this.SubmissionStatesEnum.SUCCESS;
    } catch {
      this.submitStatus = this.SubmissionStatesEnum.FAIL;
    }
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
