import { Component, effect, inject, model, output } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommitteeMemberService } from 'app/shared/services/committee-member.service';
import { CommitteeMemberEmailValidator, emailValidator } from 'app/shared/utils/validators.utils';
import { FormComponent } from '../form.component';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { InputText } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';
import { Roles } from 'app/shared/models';
import { SelectComponent } from '../select/select.component';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-add-committee-member-dialog',
  template: `
    <app-dialog
      tabindex="-1"
      aria-labelledby="dialog-title"
      title="Add user"
      submitLabel="Add"
      [(visible)]="detailVisible"
      [submitDisabled]="!form.valid"
      (confirm)="submitForm()"
    >
      <form id="form" [formGroup]="form" [class.ng-submitted]="formSubmitted">
        <div class="dialog-body">
          <div class="field">
            <label class="dialog-label" for="email">EMAIL</label>
            <input autofocus type="text" pInputText id="email" formControlName="email" />
            <app-error-messages [form]="form" fieldName="email" [formSubmitted]="form.controls['email'].touched" />
          </div>
          <app-select
            inputId="role"
            label="ROLE"
            [options]="roleOptions"
            [form]="form"
            formControlName="role"
            labelClass="dialog-label"
          />
        </div>
      </form>
    </app-dialog>
  `,
  styleUrls: ['./committee-member-dialog.component.scss'],
  imports: [ReactiveFormsModule, InputText, ErrorMessagesComponent, SelectComponent, DialogComponent],
})
export class AddCommitteeMemberDialogComponent extends FormComponent {
  protected readonly committeeMemberService = inject(CommitteeMemberService);
  protected readonly uniqueEmailValidator = inject(CommitteeMemberEmailValidator);

  readonly detailVisible = model(false);
  readonly userAdded = output<string>();

  protected readonly roleOptions = Object.keys(Roles).map((key) => {
    return {
      label: Roles[key as keyof typeof Roles],
      value: key,
    };
  });

  readonly form = new FormGroup({
    role: new SubscriptionFormControl<Roles | null>(null, { validators: [Validators.required] }),
    email: new SubscriptionFormControl('', {
      validators: [Validators.required, emailValidator],
      asyncValidators: [this.uniqueEmailValidator.validate.bind(this.uniqueEmailValidator)],
    }),
  });

  constructor() {
    super();
    effect(() => {
      if (!this.detailVisible()) this.resetForm();
    });
  }

  async submit(): Promise<void> {
    const { email, role } = this.form.value;
    try {
      const newUser = await this.committeeMemberService.addMember(email, role);
      this.detailVisible.set(false);
      this.userAdded.emit(newUser.email);
      this.resetForm();
    } catch (error) {
      console.error('Error adding member', error);
    }
  }

  resetForm() {
    this.form.reset({ role: null, email: '' });
    this.formSubmitted = false;
  }
}
