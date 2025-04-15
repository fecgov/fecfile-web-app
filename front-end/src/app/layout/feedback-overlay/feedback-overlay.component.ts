import { Component, inject, signal, viewChild, ViewChild } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Feedback } from 'app/shared/models';
import { FeedbackService } from 'app/shared/services/feedback.service';
import { blurActiveInput } from 'app/shared/utils/form.utils';
import { singleClickEnableAction } from 'app/store/single-click.actions';
import { Popover, PopoverModule } from 'primeng/popover';
import { ButtonDirective } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { FormComponent } from 'app/shared/components/app-destroyer.component';
import { ErrorMessagesComponent } from 'app/shared/components/error-messages/error-messages.component';
import { SingleClickDirective } from 'app/shared/directives/single-click.directive';

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
    TextareaModule,
    PopoverModule,
  ],
})
export class FeedbackOverlayComponent extends FormComponent {
  public readonly feedbackService = inject(FeedbackService);
  private readonly popover = viewChild.required<Popover>('op');

  readonly form = signal<FormGroup>(
    this.fb.group(
      {
        action: ['', [Validators.required, Validators.maxLength(2000)]],
        feedback: ['', [Validators.maxLength(2000)]],
        about: ['', Validators.maxLength(2000)],
      },
      { updateOn: 'blur' },
    ),
  );
  readonly SubmissionStatesEnum = SubmissionStates;
  submitStatus = this.SubmissionStatesEnum.DRAFT;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  show(event: any): void {
    this.reset();
    this.popover().show(event, 'anchor');
  }

  onHide() {
    this.reset();
  }

  save() {
    this.formSubmitted = true;
    blurActiveInput(this.form());
    if (this.form().invalid) {
      this.store.dispatch(singleClickEnableAction());
      return;
    }
    const feedback: Feedback = {
      action: this.form().get('action')?.value,
      feedback: this.form().get('feedback')?.value,
      about: this.form().get('about')?.value,
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
    this.form().reset();
    this.formSubmitted = false;
    this.submitStatus = this.SubmissionStatesEnum.DRAFT;
  }

  tryAgain() {
    this.submitStatus = this.SubmissionStatesEnum.DRAFT;
  }
}
