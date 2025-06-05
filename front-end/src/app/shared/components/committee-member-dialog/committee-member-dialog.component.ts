import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  OnChanges,
  output,
  ViewChild,
} from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommitteeMemberService } from 'app/shared/services/committee-member.service';
import { CommitteeMemberEmailValidator, emailValidator } from 'app/shared/utils/validators.utils';
import { ConfirmationService } from 'primeng/api';
import { FormComponent } from '../app-destroyer.component';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { InputText } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { Roles, CommitteeMember } from 'app/shared/models';
import { SelectComponent } from '../select/select.component';

@Component({
  selector: 'app-committee-member-dialog',
  templateUrl: './committee-member-dialog.component.html',
  styleUrls: ['./committee-member-dialog.component.scss'],
  imports: [ReactiveFormsModule, InputText, ErrorMessagesComponent, ButtonDirective, Ripple, SelectComponent],
})
export class CommitteeMemberDialogComponent extends FormComponent implements OnChanges, AfterViewInit {
  protected readonly confirmationService = inject(ConfirmationService);
  protected readonly committeeMemberService = inject(CommitteeMemberService);
  protected readonly uniqueEmailValidator = inject(CommitteeMemberEmailValidator);

  protected readonly roleOptions = Object.keys(Roles).map((key) => {
    return {
      label: Roles[key as keyof typeof Roles],
      value: key,
    };
  });

  readonly detailVisible = input(false);
  readonly member = input<CommitteeMember>();
  readonly detailVisibleChange = output<boolean>();
  readonly userAdded = output<string>();
  readonly roleEdited = output<void>();
  readonly detailClose = output<void>();

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

  readonly roleControl = this.form.get('role') as SubscriptionFormControl;
  readonly role = computed(() => {
    const member = this.member();
    if (!member) return '';
    return Roles[member.role as keyof typeof Roles];
  });

  @ViewChild('dialog') dialog?: ElementRef;

  ngAfterViewInit() {
    this.dialog?.nativeElement.addEventListener('close', () => this.detailClose.emit());
  }

  ngOnChanges(): void {
    if (this.detailVisible()) {
      this.resetForm();
      this.dialog?.nativeElement.showModal();
    }
  }

  updateSelected(roleOption: (typeof this.roleOptions)[0]) {
    this.form.get('role')?.setValue(roleOption);
  }

  public submit() {
    this.formSubmitted = true;
    if (this.member()) {
      this.editRole();
    } else {
      this.addUser();
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
          this.dialog?.nativeElement.close();
          this.roleEdited.emit();
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
    Object.values(this.form.controls).forEach((control) => {
      control.markAsDirty();
    });

    if (this.form.valid && email) {
      try {
        const newUser = await this.committeeMemberService.addMember(email, role);
        this.dialog?.nativeElement.close();
        this.userAdded.emit(newUser.email);
        this.resetForm();
      } catch (error) {
        console.error('Error adding member', error);
      }
    }
  }
}
