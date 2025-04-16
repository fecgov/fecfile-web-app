import { Component, computed, ElementRef, inject, Injector, input, output, signal, viewChild } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule, FormBuilder, FormControl } from '@angular/forms';
import { CommitteeMemberService } from 'app/shared/services/committee-member.service';
import { CommitteeMemberEmailValidator, emailValidator } from 'app/shared/utils/validators.utils';
import { ConfirmationService } from 'primeng/api';
import { InputText } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';
import { Select } from 'primeng/select';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { Roles, CommitteeMember } from 'app/shared/models';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { effectOnceIf } from 'ngxtension/effect-once-if';
import { SignalFormControl } from 'app/shared/utils/signal-form-control';

@Component({
  selector: 'app-committee-member-dialog',
  templateUrl: './committee-member-dialog.component.html',
  styleUrls: ['./committee-member-dialog.component.scss'],
  imports: [ReactiveFormsModule, InputText, ErrorMessagesComponent, Select, ButtonDirective, Ripple],
})
export class CommitteeMemberDialogComponent {
  readonly injector = inject(Injector);
  protected readonly fb = inject(FormBuilder);
  protected readonly store = inject(Store);
  protected readonly committeeAccount = this.store.selectSignal(selectCommitteeAccount);
  protected readonly report = this.store.selectSignal(selectActiveReport);

  formSubmitted = false;

  protected readonly confirmationService = inject(ConfirmationService);
  protected readonly committeeMemberService = inject(CommitteeMemberService);
  protected readonly uniqueEmailValidator = inject(CommitteeMemberEmailValidator);

  protected readonly roleOptions = Object.keys(Roles).map((key) => {
    return {
      label: Roles[key as keyof typeof Roles],
      value: key,
    };
  });

  readonly role = computed(() => {
    if (!this.member().id) return '';
    return Roles[this.member().role as keyof typeof Roles];
  });

  readonly detailVisible = input(false, {
    transform: (value: boolean) => {
      if (value) {
        this.resetForm();
        this.dialog()?.nativeElement.showModal();
      }

      return value;
    },
  });
  readonly member = input.required<CommitteeMember>();
  readonly membershipSubmitText = computed(() => (this.member().id ? 'Change' : 'Add'));

  readonly userAdded = output<string>();
  readonly roleEdited = output<undefined>();
  readonly detailClose = output<undefined>();

  readonly form = new FormGroup(
    {
      role: new SignalFormControl(this.injector),
      email: new SignalFormControl(this.injector, '', {
        validators: [Validators.required, emailValidator],
        asyncValidators: [this.uniqueEmailValidator.validate.bind(this.uniqueEmailValidator)],
        updateOn: 'change',
      }),
    },
    { updateOn: 'blur' },
  );

  private readonly dialog = viewChild<ElementRef>('dialog');

  constructor() {
    effectOnceIf(
      () => this.dialog(),
      () => {
        this.dialog()?.nativeElement.addEventListener('close', () => this.detailClose.emit(undefined));
      },
    );
  }

  public submit() {
    this.formSubmitted = true;
    this.member().id ? this.editRole() : this.addUser();
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
          this.closeDialog();
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
        this.closeDialog();
        this.userAdded.emit(newUser.email);
        this.resetForm();
      } catch (error) {
        console.error('Error adding member', error);
      }
    }
  }

  private closeDialog() {
    this.dialog()?.nativeElement.close();
  }

  get emailControl() {
    return this.form.get('email') as SignalFormControl;
  }

  get roleControl() {
    return this.form.get('role') as SignalFormControl;
  }
}
