import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommitteeMemberRoles } from 'app/shared/models/committee-member.model';
import { CommitteeMemberService } from 'app/shared/services/committee-member.service';
import { CommitteeMemberEmailValidator, emailValidator } from 'app/shared/utils/validators.utils';
import { ConfirmationService } from 'primeng/api';
import { DestroyerComponent } from '../app-destroyer.component';

@Component({
  selector: 'app-committee-member-dialog',
  templateUrl: './committee-member-dialog.component.html',
  styleUrls: ['./committee-member-dialog.component.scss'],
})
export class CommitteeMemberDialogComponent extends DestroyerComponent implements OnChanges, AfterViewInit {
  @Input() detailVisible = false;
  @Output() detailVisibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() saveMembership: EventEmitter<{ email: string; role: typeof CommitteeMemberRoles }> = new EventEmitter<{
    email: string;
    role: typeof CommitteeMemberRoles;
  }>();
  @Output() detailClose = new EventEmitter<undefined>();

  roleOptions = Object.keys(CommitteeMemberRoles).map((key) => {
    return {
      label: CommitteeMemberRoles[key as keyof typeof CommitteeMemberRoles],
      value: key,
    };
  });

  form: FormGroup = new FormGroup({}, { updateOn: 'blur' });
  formSubmitted = false;

  @ViewChild('dialog') dialog?: ElementRef;

  constructor(
    protected confirmationService: ConfirmationService,
    protected committeeMemberService: CommitteeMemberService,
    protected uniqueEmailValidator: CommitteeMemberEmailValidator,
  ) {
    super();
    this.form.addControl('role', new FormControl());
    this.form.addControl(
      'email',
      new FormControl('', {
        validators: [Validators.required, emailValidator],
        asyncValidators: [this.uniqueEmailValidator.validate.bind(this.uniqueEmailValidator)],
        updateOn: 'change',
      }),
    );

    this.form.get('role')?.setValue(this.roleOptions[0]);
  }

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
