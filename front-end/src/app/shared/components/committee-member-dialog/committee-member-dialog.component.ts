import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DestroyerComponent } from '../app-destroyer.component';
import { ConfirmationService } from 'primeng/api';
import { CommitteeMemberRoles } from 'app/shared/models/committee-member.model';
import { CommitteeMemberService } from 'app/shared/services/committee-member.service';
import { CommitteeMemberEmailValidator, emailValidator } from 'app/shared/utils/validators.utils';

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

  form: FormGroup = new FormGroup({});
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
        updateOn: 'blur',
      }),
    );
  }

  ngOnChanges(): void {
    if (this.detailVisible) {
      this.resetForm();
      this.dialog?.nativeElement.showModal();
    }
  }

  ngAfterViewInit() {
    this.dialog?.nativeElement.addEventListener('close', () => this.detailClose.emit());
  }

  private resetForm() {
    this.form.reset();
    this.formSubmitted = false;
  }

  public openDialog() {
    this.resetForm();
    this.detailVisible = true;
  }

  public closeDialog(visibleChangeFlag = false) {
    if (!visibleChangeFlag) {
      this.detailVisibleChange.emit(false);
      this.detailVisible = false;
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
      this.dialog?.nativeElement.close();
    }
  }
}
