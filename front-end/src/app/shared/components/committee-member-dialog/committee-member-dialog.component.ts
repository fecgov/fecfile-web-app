import { Component, computed, effect, inject, input, model, output } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommitteeMemberService } from 'app/shared/services/committee-member.service';
import { CommitteeMemberEmailValidator, emailValidator } from 'app/shared/utils/validators.utils';
import { ConfirmationService } from 'primeng/api';
import { FormComponent } from '../form.component';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { InputText } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';
import { Roles, CommitteeMember } from 'app/shared/models';
import { SelectComponent } from '../select/select.component';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-committee-member-dialog',
  templateUrl: './committee-member-dialog.component.html',
  styleUrls: ['./committee-member-dialog.component.scss'],
  imports: [ReactiveFormsModule, InputText, ErrorMessagesComponent, SelectComponent, DialogComponent],
})
export class CommitteeMemberDialogComponent extends FormComponent {
  protected readonly confirmationService = inject(ConfirmationService);
  protected readonly committeeMemberService = inject(CommitteeMemberService);
  protected readonly uniqueEmailValidator = inject(CommitteeMemberEmailValidator);

  protected readonly roleOptions = Object.keys(Roles).map((key) => {
    return {
      label: Roles[key as keyof typeof Roles],
      value: key,
    };
  });

  readonly detailVisible = model(false);
  readonly member = input<CommitteeMember>();
  readonly userAdded = output<string>();
  readonly roleEdited = output<void>();

  readonly form: FormGroup = new FormGroup(
    {
      role: new SubscriptionFormControl(this.roleOptions[0].value),
      email: new SubscriptionFormControl('', {
        validators: [Validators.required, emailValidator],
        asyncValidators: [this.uniqueEmailValidator.validate.bind(this.uniqueEmailValidator)],
        updateOn: 'change',
      }),
    },
    { updateOn: 'blur' },
  );

  readonly roleControl = this.form.get('role') as SubscriptionFormControl;
  readonly role = computed(() => {
    const member = this.member();
    if (!member) return '';
    return Roles[member.role as keyof typeof Roles];
  });

  constructor() {
    super();
    effect(() => {
      if (!this.detailVisible()) this.resetForm();
    });
  }

  updateSelected(roleOption: (typeof this.roleOptions)[0]) {
    this.form.get('role')?.setValue(roleOption);
  }

  submit(): Promise<void> {
    if (this.member()) {
      return this.editRole();
    } else {
      return this.addUser();
    }
  }

  override validateForm(): Promise<boolean> {
    const member = this.member();
    if (member) {
      this.form.controls['email'].setAsyncValidators([]);
      this.form.controls['email'].setValue(member.email);
    } else {
      this.form.controls['email'].setAsyncValidators(
        this.uniqueEmailValidator.validate.bind(this.uniqueEmailValidator),
      );
    }

    return super.validateForm();
  }

  resetForm() {
    this.form.reset({ role: this.roleOptions[0].value, email: '' });
    this.formSubmitted = false;
  }

  async editRole() {
    const role = this.form.get('role')?.value;
    try {
      await this.committeeMemberService.update({ ...this.member(), role } as CommitteeMember);
      this.detailVisible.set(false);
      this.roleEdited.emit();
      this.form.controls['email'].addAsyncValidators(this.uniqueEmailValidator.validate);
      this.resetForm();
    } catch (error) {
      console.error('Error updating member', error);
    }
  }

  async addUser() {
    const email = this.form.get('email')?.value as string;
    const role = this.form.get('role')?.value;
    try {
      const newUser = await this.committeeMemberService.addMember(email, role);
      this.detailVisible.set(false);
      this.userAdded.emit(newUser.email);
      this.resetForm();
    } catch (error) {
      console.error('Error adding member', error);
    }
  }
}
