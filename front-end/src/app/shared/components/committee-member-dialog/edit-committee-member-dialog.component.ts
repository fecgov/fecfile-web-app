import { Component, computed, effect, inject, input, model, output } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommitteeMemberService } from 'app/shared/services/committee-member.service';
import { FormComponent } from '../form.component';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { Roles, CommitteeMember } from 'app/shared/models';
import { SelectComponent } from '../select/select.component';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-edit-committee-member-dialog',
  template: `
    <app-dialog
      tabindex="-1"
      aria-labelledby="dialog-title"
      title="Edit Role"
      submitLabel="Change"
      [(visible)]="detailVisible"
      [submitDisabled]="!form.valid"
      (confirm)="submitForm()"
    >
      <form id="form" [formGroup]="form" [class.ng-submitted]="formSubmitted">
        <div class="dialog-body">
          <div class="field">
            <label class="dialog-label" id="role-label" for="role">CURRENT ROLE</label>
            <input id="role" [disabled]="true" [value]="role()" />
          </div>
          <app-select
            inputId="role"
            label="ROLE"
            [options]="availableRoleOptions()"
            [form]="form"
            formControlName="role"
            labelClass="dialog-label"
          />
        </div>
      </form>
    </app-dialog>
  `,
  styleUrls: ['./committee-member-dialog.component.scss'],
  imports: [ReactiveFormsModule, SelectComponent, DialogComponent],
})
export class EditCommitteeMemberDialogComponent extends FormComponent {
  protected readonly committeeMemberService = inject(CommitteeMemberService);

  readonly detailVisible = model(false);
  readonly member = input.required<CommitteeMember>();
  readonly roleEdited = output<void>();
  readonly form = new FormGroup({
    role: new SubscriptionFormControl<Roles | null>(null, { validators: [Validators.required] }),
  });

  readonly role = computed(() => Roles[this.member().role as keyof typeof Roles]);

  readonly availableRoleOptions = computed(() => {
    const memberRole = this.member().role;
    return Object.entries(Roles)
      .filter(([key]) => key !== memberRole)
      .map(([key, label]) => ({ label, value: key }));
  });

  constructor() {
    super();
    effect(() => {
      if (!this.detailVisible()) this.resetForm();
    });
  }

  async submit(): Promise<void> {
    const { role } = this.form.value;
    try {
      await this.committeeMemberService.update({ ...this.member(), role } as CommitteeMember);
      this.detailVisible.set(false);
      this.roleEdited.emit();
      this.resetForm();
    } catch (error) {
      console.error('Error updating member', error);
    }
  }

  resetForm() {
    this.form.reset({ role: null });
    this.formSubmitted = false;
  }
}
