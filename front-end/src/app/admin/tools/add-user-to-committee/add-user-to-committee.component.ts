import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DestroyerComponent } from 'app/shared/components/destroyer.component';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { MessageService } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { printFormErrors } from 'app/shared/utils/form.utils';
import { AdminService } from 'app/shared/services/admin-service';
import { ErrorMessagesComponent } from 'app/shared/components/error-messages/error-messages.component';
import { Roles } from 'app/shared/models';
import { SelectComponent } from 'app/shared/components/select/select.component';

@Component({
  selector: 'app-add-user-to-committee',
  templateUrl: './add-user-to-committee.component.html',
  styleUrl: './add-user-to-committee.component.scss',
  imports: [ReactiveFormsModule, ButtonDirective, ErrorMessagesComponent, SelectComponent],
})
export class AddUserToCommitteeComponent extends DestroyerComponent implements OnInit {
  public readonly router = inject(Router);
  protected readonly activatedRoute = inject(ActivatedRoute);
  private readonly messageService = inject(MessageService);
  public readonly adminService = inject(AdminService);
  protected committeeIdReadOnly: boolean = false;
  readonly userEmailFormControl = new SubscriptionFormControl<string | null>(null, [
    Validators.required,
    Validators.email,
  ]);
  readonly committeeIdFormControl = new SubscriptionFormControl<string | null>(null, [
    Validators.required,
    Validators.pattern('C\\d{8}'),
  ]);
  readonly roleFormControl = new SubscriptionFormControl<keyof Roles | null>(null, [Validators.required]);

  protected readonly roleOptions = Object.keys(Roles).map((key) => {
    return {
      label: Roles[key as keyof typeof Roles],
      value: key,
    };
  });

  form: FormGroup = new FormGroup({
    user_email: this.userEmailFormControl,
    committee_id: this.committeeIdFormControl,
    role: this.roleFormControl,
  });

  ngOnInit(): void {
    this.reset_committee_id();
    this.committeeIdReadOnly = !!this.activatedRoute.snapshot.params['committee_id'];
  }

  reset_committee_id() {
    const committee_id = this.activatedRoute.snapshot.params['committee_id'];
    if (committee_id) {
      this.committeeIdFormControl.setValue(committee_id);
    } else {
      this.committeeIdFormControl.setValue(null);
    }
  }

  addUserToCommittee(): void {
    if (this.form.valid) {
      const user_email: string | null = this.userEmailFormControl.value;
      const committee_id: string | null = this.committeeIdFormControl.value;
      const role: keyof Roles | null = this.roleFormControl.value;
      if (user_email !== null && committee_id !== null && role !== null) {
        this.adminService.addUserToCommittee(user_email, committee_id, role).then((response) => {
          this.messageService.add({
            severity: response.success ? 'success' : 'error',
            summary: response.success ? 'Successful' : 'Error',
            detail: response.success ? response.success : response.error,
            life: 3000,
          });

          if (response.success) {
            this.userEmailFormControl.setValue(null);
            this.reset_committee_id();
            this.roleFormControl.setValue(null);
          }
        });
      }
    } else {
      printFormErrors(this.form);
    }
  }

  goBack(): void {
    const committee_id = this.activatedRoute.snapshot.params['committee_id'];
    if (committee_id) {
      this.router.navigateByUrl('/admin/dashboards/committees-overview');
    } else {
      this.router.navigateByUrl('/admin/');
    }
  }
}
