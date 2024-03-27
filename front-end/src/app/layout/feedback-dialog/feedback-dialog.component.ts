import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import { Contact, ContactTypeLabels, ContactTypes } from 'app/shared/models/contact.model';
import { Feedback } from 'app/shared/models/feedback.model';
import { DeletedContactService } from 'app/shared/services/contact.service';
import { FeedbackService } from 'app/shared/services/feedback.service';
import { LabelList } from 'app/shared/utils/label.utils';
import { ConfirmationService, MessageService } from 'primeng/api';

enum SubmissionStates {
  DRAFT,
  SUCCESS,
  FAIL,
}

@Component({
  selector: 'app-feedback-dialog',
  templateUrl: './feedback-dialog.component.html',
})
export class FeedbackDialogComponent extends TableListBaseComponent<Contact> implements OnInit, OnChanges {
  @Input() visible = false;
  form: FormGroup = this.fb.group({
    action: ['', [Validators.required, Validators.maxLength(2000)]],
    feedback: ['', [Validators.maxLength(2000)]],
    about: ['', Validators.maxLength(2000)],
  });
  formSubmitted = false;

  submitStatus = SubmissionStates.DRAFT;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() contactsRestored = new EventEmitter<string[]>();
  contactTypeLabels: LabelList = ContactTypeLabels;

  constructor(
    private fb: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private feedbackService: FeedbackService,
    protected override messageService: MessageService,
    protected override confirmationService: ConfirmationService,
    protected override elementRef: ElementRef,
    public override itemService: DeletedContactService
  ) {
    super(messageService, confirmationService, elementRef);
  }

  ngOnChanges(): void {
    this.changeDetectorRef.detectChanges();
  }

  close(): void {
    this.visible = false;
  }

  save(): void {
    this.formSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    const feedback: Feedback = {
      action: this.form.get('action')?.value,
      feedback: this.form.get('feedback')?.value,
      about: this.form.get('about')?.value
    }
    this.feedbackService.submitFeedback(feedback).then(() => {
      this.submitStatus = SubmissionStates.SUCCESS;
    }, () => {
      this.submitStatus = SubmissionStates.FAIL;
    });
  }

  restoreSelected(): void {
    this.itemService.restore(this.selectedItems).subscribe((restoredContacts: string[]) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Contacts Successfully Restored',
        life: 3000,
      });
      this.contactsRestored.emit(restoredContacts);
      this.hide();
    });
  }

  protected getEmptyItem(): Contact {
    return new Contact();
  }

  /**
   * Get the display name for the contact to show in the table column.
   * @param item
   * @returns {string} Returns the appropriate name of the contact for display in the table.
   */
  public displayName(item: Contact): string {
    if ([ContactTypes.INDIVIDUAL, ContactTypes.CANDIDATE].includes(item.type)) {
      return `${item.last_name}, ${item.first_name}`;
    } else {
      return item.name || '';
    }
  }
}
