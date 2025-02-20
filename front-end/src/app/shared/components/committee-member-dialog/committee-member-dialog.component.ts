import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommitteeMemberRoles } from 'app/shared/models/committee-member.model';
import { CommitteeMemberService } from 'app/shared/services/committee-member.service';
import { CommitteeMemberEmailValidator, emailValidator } from 'app/shared/utils/validators.utils';
import { ConfirmationService } from 'primeng/api';
import { DestroyerComponent } from '../app-destroyer.component';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { InputText } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';
import { Select } from 'primeng/select';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';

@Component({
  selector: 'app-committee-member-dialog',
  templateUrl: './committee-member-dialog.component.html',
  styleUrls: ['./committee-member-dialog.component.scss'],
  imports: [ReactiveFormsModule, InputText, ErrorMessagesComponent, Select, ButtonDirective, Ripple],
})
export class CommitteeMemberDialogComponent extends DestroyerComponent implements OnChanges, AfterViewInit {
  protected readonly confirmationService = inject(ConfirmationService);
  protected readonly committeeMemberService = inject(CommitteeMemberService);
  protected readonly uniqueEmailValidator = inject(CommitteeMemberEmailValidator);

  @Input() detailVisible = false;
  @Output() readonly detailVisibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() readonly saveMembership: EventEmitter<{ email: string; role: typeof CommitteeMemberRoles }> =
    new EventEmitter<{
      email: string;
      role: typeof CommitteeMemberRoles;
    }>();
  @Output() readonly detailClose = new EventEmitter<undefined>();

  readonly roleOptions = Object.keys(CommitteeMemberRoles).map((key) => {
    return {
      label: CommitteeMemberRoles[key as keyof typeof CommitteeMemberRoles],
      value: key,
    };
  });

  form: FormGroup = new FormGroup(
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
  formSubmitted = false;

  @ViewChild('dialog') dialog?: ElementRef;

  ngAfterViewInit() {
    this.dialog?.nativeElement.addEventListener('close', () => this.detailClose.emit());
  }

  ngOnChanges(): void {
    if (this.detailVisible) {
      this.form.reset();
      this.form.get('role')?.setValue(this.roleOptions[0].value);
      this.formSubmitted = false;
      this.dialog?.nativeElement.showModal();
    }
  }

  updateSelected(roleOption: (typeof this.roleOptions)[0]) {
    this.form.get('role')?.setValue(roleOption);
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
      this.dialog?.nativeElement.close();
    }
  }
}
