import { Component, EventEmitter, Injectable, Input, Output } from '@angular/core';
import { AbstractControl, AsyncValidator, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { DestroyerComponent } from '../app-destroyer.component';
import { ConfirmationService } from 'primeng/api';
import { CommitteeMemberRoles } from 'app/shared/models/committee-member.model';
import { CommitteeMemberService } from 'app/shared/services/committee-account.service';

@Component({
  selector: 'app-committee-member-dialog',
  templateUrl: './committee-member-dialog.component.html',
})
export class CommitteeMemberDialogComponent extends DestroyerComponent {
  @Input() detailVisible = false;
  @Output() detailVisibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() saveMembership: EventEmitter<{ email: string; role: typeof CommitteeMemberRoles }> = new EventEmitter<{
    email: string;
    role: typeof CommitteeMemberRoles;
  }>();

  roleOptions = Object.keys(CommitteeMemberRoles).map((key) => {
    return {
      label: CommitteeMemberRoles[key as keyof typeof CommitteeMemberRoles],
      value: key,
    };
  });

  form: FormGroup = new FormGroup({});
  formSubmitted = false;

  dialogVisible = false; // We need to hide dialog manually so dynamic layout changes are not visible to the user

  constructor(
    protected confirmationService: ConfirmationService,
    protected committeeMemberService: CommitteeMemberService,
    protected uniqueEmailValidator: UniqueEmailValidator,
  ) {
    super();
    this.form.addControl('role', new FormControl());
    this.form.addControl(
      'email',
      new FormControl('', {
        validators: [Validators.required],
        asyncValidators: [this.uniqueEmailValidator.validate.bind(this.uniqueEmailValidator)],
        updateOn: 'blur',
      }),
    );
  }

  private resetForm() {
    this.form.reset();
    this.formSubmitted = false;
  }

  public openDialog() {
    this.resetForm();
    this.dialogVisible = true;
  }

  public closeDialog(visibleChangeFlag = false) {
    if (!visibleChangeFlag) {
      this.detailVisibleChange.emit(false);
      this.detailVisible = false;
      this.dialogVisible = false;
    }
  }

  public async addUser() {
    const email = this.form.get('email')?.value as string;
    const role = this.form.get('role')?.value;

    this.form.updateValueAndValidity();
    if (this.form.valid) {
      this.saveMembership.emit({
        email,
        role,
      });
    }
  }
}

@Injectable({ providedIn: 'root' })
export class UniqueEmailValidator implements AsyncValidator {
  constructor(protected committeeMemberService: CommitteeMemberService) {}

  async validate(control: AbstractControl): Promise<ValidationErrors | null> {
    if (control.value) {
      const existing_members = await this.committeeMemberService.getMembers();
      const emails = existing_members.map((member) => {
        return member.email;
      });

      if (emails.includes(control.value)) {
        return {
          email: 'taken-in-committee',
        };
      }
    }
    return null;
  }
}
