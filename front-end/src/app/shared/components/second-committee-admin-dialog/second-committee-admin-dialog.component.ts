import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { getRoleKey, Roles } from 'app/shared/models';
import { CommitteeMemberService } from 'app/shared/services/committee-member.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormComponent } from '../app-destroyer.component';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';
import { singleClickEnableAction } from 'app/store/single-click.actions';
import { MessageService } from 'primeng/api';
import { CommitteeMemberEmailValidator, emailValidator } from 'app/shared/utils/validators.utils';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';

@Component({
  selector: 'app-second-committee-admin-dialog',
  templateUrl: './second-committee-admin-dialog.component.html',
  styleUrl: './second-committee-admin-dialog.component.scss',
  imports: [ReactiveFormsModule, DialogModule, ButtonModule, ErrorMessagesComponent],
})
export class SecondCommitteeAdminDialogComponent extends FormComponent {
  readonly memberService = inject(CommitteeMemberService);
  private readonly messageService = inject(MessageService);
  private readonly uniqueEmailValidator = inject(CommitteeMemberEmailValidator);
  readonly form: FormGroup = new FormGroup(
    {
      role: new SubscriptionFormControl({ value: Roles.COMMITTEE_ADMINISTRATOR, disabled: true }),
      email: new SubscriptionFormControl('', {
        validators: [Validators.required, emailValidator],
        asyncValidators: [this.uniqueEmailValidator.validate.bind(this.uniqueEmailValidator)],
        updateOn: 'change',
      }),
    },
    { updateOn: 'blur' },
  );

  async save() {
    this.formSubmitted = true;
    if (this.form.invalid) {
      this.store.dispatch(singleClickEnableAction());
      return;
    }

    const email = this.form.get('email')?.value as string;
    const role: Roles = this.form.get('role')?.value;
    const key = getRoleKey(role);
    await this.memberService.addMember(email, key);
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Committee Administrator created',
      life: 3000,
    });
  }
}
