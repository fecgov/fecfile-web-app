import { Component, computed, effect, inject, input, model, output } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommitteeMemberService } from 'app/shared/services/committee-member.service';
import { CommitteeMemberEmailValidator, emailValidator } from 'app/shared/utils/validators.utils';
import { ConfirmationService } from 'primeng/api';
import { FormComponent } from '../app-destroyer.component';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { InputText } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';
import { Select } from 'primeng/select';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { Roles, CommitteeMember, RoleTypeLabels } from 'app/shared/models';
import { DialogModule } from 'primeng/dialog';
import { LabelUtils } from 'app/shared/utils/label.utils';

@Component({
  selector: 'app-committee-member-dialog',
  templateUrl: './committee-member-dialog.component.html',
  styleUrls: ['./committee-member-dialog.component.scss'],
  imports: [ReactiveFormsModule, InputText, ErrorMessagesComponent, Select, ButtonDirective, Ripple, DialogModule],
})
export class CommitteeMemberDialogComponent extends FormComponent {
  protected readonly confirmationService = inject(ConfirmationService);
  protected readonly committeeMemberService = inject(CommitteeMemberService);
  protected readonly uniqueEmailValidator = inject(CommitteeMemberEmailValidator);

  protected readonly roleOptions = LabelUtils.getPrimeOptions(RoleTypeLabels);

  readonly role = computed(() => {
    if (this.isNew()) return '';
    return Roles[this.member().role as keyof typeof Roles];
  });

  readonly detailVisible = model.required<boolean>();
  readonly member = input.required<CommitteeMember>();
  readonly isNew = computed(() => !this.member().id);
  readonly headerText = computed(() => `${this.isNew() ? 'Add' : 'Edit'} User`);
  readonly membershipSubmitText = computed(() => (this.isNew() ? 'Add' : 'Change'));

  readonly userAdded = output<string>();
  readonly roleEdited = output<undefined>();

  readonly form: FormGroup = new FormGroup(
    {
      role: new SubscriptionFormControl(),
      email: new SubscriptionFormControl('', {
        validators: [Validators.required, emailValidator],
        asyncValidators: [this.uniqueEmailValidator.validate.bind(this.uniqueEmailValidator)],
        updateOn: 'change',
      }),
    },
    { updateOn: 'blur' },
  );

  constructor() {
    super();
    effect(() => {
      if (!this.detailVisible()) {
        this.resetForm();
      }
    });

    effect(() => {
      console.log(this.member());
    });
  }

  public submit() {
    this.formSubmitted = true;
    if (this.isNew()) {
      this.addUser();
    } else {
      this.editRole();
    }
  }

  resetForm() {
    this.form.reset({ role: this.roleOptions[0].value, email: '' });
    this.formSubmitted = false;
  }

  async editRole() {
    if (this.form.get('role')?.valid) {
      const role = this.form.get('role')?.value;
      if (this.form.get('role')?.valid) {
        try {
          await this.committeeMemberService.update({ ...this.member(), role } as CommitteeMember);
          this.detailVisible.set(false);
          this.roleEdited.emit(undefined);
          this.resetForm();
        } catch (error) {
          console.error('Error updating member', error);
        }
      }
    }
  }

  async addUser() {
    const email = this.form.get('email')?.value as string;
    const role = this.form.get('role')?.value;
    this.form.updateValueAndValidity();
    this.form.markAllAsTouched();

    if (this.form.valid && email) {
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
}
