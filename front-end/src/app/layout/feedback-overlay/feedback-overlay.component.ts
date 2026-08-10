import { Component, ElementRef, HostListener, inject, signal, viewChild } from '@angular/core';
import { FeedbackService } from 'app/shared/services/feedback.service';
import { ButtonDirective } from 'primeng/button';
import { Feedback } from 'app/shared/models/feedback.model';
import { form, maxLength, required, FormRoot, FormField } from '@angular/forms/signals';
import { maxLengthMessage, requiredMessage } from 'app/shared/utils/signal-schema.utils';
import { TextAreaInput } from 'app/shared/components/signal-inputs/text-area-input/text-area.input';
import { SignalFormComponent } from 'app/shared/components/signal-form/signal-form.component';

enum SubmissionStates {
  DRAFT,
  SUCCESS,
  FAIL,
}

@Component({
  selector: 'app-feedback-overlay',
  templateUrl: './feedback-overlay.component.html',
  styleUrls: ['./feedback-overlay.component.scss'],
  imports: [TextAreaInput, ButtonDirective, FormRoot, FormField],
})
export class FeedbackOverlayComponent extends SignalFormComponent<Feedback> {
  public readonly feedbackService = inject(FeedbackService);
  private readonly container = viewChild.required<ElementRef<HTMLDivElement>>('container');
  readonly aside = viewChild.required<ElementRef>('aside');

  readonly model = signal<Feedback>({ action: '', feedback: '', about: '' });
  readonly form = form(
    this.model,
    (schemaPath) => {
      const length = 2000;
      required(schemaPath.action, { message: requiredMessage });
      maxLength(schemaPath.action, length, { message: maxLengthMessage(length) });
      maxLength(schemaPath.feedback, length, { message: maxLengthMessage(length) });
      maxLength(schemaPath.about, length, { message: maxLengthMessage(length) });
    },
    {
      submission: {
        action: async () => {
          this.fixHeight();
          try {
            await this.feedbackService.submitFeedback(this.form().value());
            this.submitStatus = SubmissionStates.SUCCESS;
          } catch {
            this.submitStatus = SubmissionStates.FAIL;
          }
        },
      },
    },
  );

  SubmissionStates = SubmissionStates;
  submitStatus = SubmissionStates.DRAFT;
  minHeight: number | undefined;

  @HostListener('document:keydown.escape')
  onKeydownHandler() {
    const aside = this.aside().nativeElement;
    if (aside?.matches(':popover-open')) {
      aside.hidePopover();
    }
  }

  reset(clearData = true) {
    if (clearData) this.form().reset({ action: '', feedback: '', about: '' });
    this.submitStatus = SubmissionStates.DRAFT;
    this.minHeight = undefined;
  }

  private fixHeight() {
    const aside = this.aside().nativeElement;
    const container = this.container().nativeElement;
    const visibleHeight = Math.min(container.scrollHeight, aside.clientHeight);
    this.minHeight = visibleHeight;
  }
}
