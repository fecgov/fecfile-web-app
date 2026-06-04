import { Component, computed, effect, inject, input, model, output } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommitteeMemberService } from 'app/shared/services/committee-member.service';
import { FormComponent } from '../form.component';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { Roles, CommitteeMember } from 'app/shared/models';
import { SelectComponent } from '../select/select.component';
import { DialogComponent } from '../dialog/dialog.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-edit-committee-member-dialog',
  template: `
    <app-dialog
      tabindex="-1"
      aria-labelledby="dialog-title"
      title="Edit Role"
      submitLabel="Change"
      [(visible)]="detailVisible"
      [submitDisabled]="submitDisabled()"
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

  readonly roleControl = new SubscriptionFormControl<Roles | null>(null, { validators: [Validators.required] });
  readonly form = new FormGroup({ role: this.roleControl });
  readonly roleValue = toSignal(this.roleControl.valueChanges);

  readonly role = computed(() => Roles[this.member().role as keyof typeof Roles]);

  protected readonly allRoleOptions = Object.keys(Roles).map((key) => ({
    label: Roles[key as keyof typeof Roles],
    value: key,
  }));

  readonly availableRoleOptions = computed(() => {
    const member = this.member();
    return this.allRoleOptions.filter((option) => option.value !== member.role);
  });

  readonly submitDisabled = computed(() => !this.roleValue());

  constructor() {
    super();
    effect(() => {
      if (!this.detailVisible()) this.resetForm();
    });
  }

  updateSelected(roleOption: (typeof this.allRoleOptions)[0]) {
    this.form.get('role')?.setValue(roleOption);
  }

  submit(): Promise<void> {
    return this.editRole();
  }

  resetForm() {
    this.form.reset({ role: null });
    this.formSubmitted = false;
  }

  async editRole() {
    const role = this.form.get('role')?.value;
    try {
      await this.committeeMemberService.update({ ...this.member(), role } as CommitteeMember);
      this.detailVisible.set(false);
      this.roleEdited.emit();
      this.resetForm();
    } catch (error) {
      console.error('Error updating member', error);
    }
  }
}
