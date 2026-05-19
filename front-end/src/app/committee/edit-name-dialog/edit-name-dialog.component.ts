import { Component, effect, inject, input, model, output, signal } from '@angular/core';
import { debounce, form, FormField, required } from '@angular/forms/signals';
import { CommitteeMember } from 'app/shared/models';
import { DialogComponent } from 'app/shared/components/dialog/dialog.component';
import { CommitteeMemberService } from 'app/shared/services/committee-member.service';

@Component({
  selector: 'app-edit-name-dialog',
  imports: [DialogComponent, FormField],
  templateUrl: './edit-name-dialog.component.html',
})
export class EditNameDialogComponent {
  protected readonly committeeMemberService = inject(CommitteeMemberService);
  readonly member = input.required<CommitteeMember>();
  readonly visible = model(false);
  readonly nameChanged = output<void>();
  readonly nameModel = signal({
    first: '',
    last: '',
  });

  nameForm = form(this.nameModel, (schema) => {
    debounce(schema.first, 'blur');
    debounce(schema.last, 'blur');
    required(schema.first, {
      message: 'First Name is required',
    });
    required(schema.last, {
      message: 'Last Name is required',
    });
  });

  constructor() {
    effect(() => {
      const member = this.member();
      if (member && this.visible()) {
        this.nameModel.set({
          first: member.first_name || '',
          last: member.last_name || '',
        });
      }
    });
  }

  async submit() {
    if (this.nameForm().invalid()) {
      this.nameForm.first().markAsTouched();
      this.nameForm.last().markAsTouched();
      return;
    }
    const { first: first_name, last: last_name } = this.nameForm().value();
    try {
      await this.committeeMemberService.update({ ...this.member(), first_name, last_name } as CommitteeMember);
      this.visible.set(false);
      this.nameChanged.emit();
    } catch (error) {
      console.error('Error updating member', error);
    }
  }
}
