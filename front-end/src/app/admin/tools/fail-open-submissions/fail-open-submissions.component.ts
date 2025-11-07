import { Component, inject } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DestroyerComponent } from 'app/shared/components/destroyer.component';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { MessageService } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { printFormErrors } from 'app/shared/utils/form.utils';
import { AdminService } from 'app/shared/services/admin-service';
import { ErrorMessagesComponent } from 'app/shared/components/error-messages/error-messages.component';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-fail-open-submissions',
  templateUrl: './fail-open-submissions.component.html',
  styleUrl: './fail-open-submissions.component.scss',
  imports: [ReactiveFormsModule, ButtonDirective, ErrorMessagesComponent, CheckboxModule, DialogModule],
})
export class FailOpenSubmissionsComponent extends DestroyerComponent {
  public readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  public readonly adminService = inject(AdminService);
  readonly warningAcknowledgedFormControl = new SubscriptionFormControl<string | null>(null, [
    Validators.pattern("^I know what I'm doing$"),
  ]);

  form: FormGroup = new FormGroup({
    warning_acknowledged: this.warningAcknowledgedFormControl,
  });

  failOpenSubmissions(): void {
    if (this.form.valid) {
      const warningAcknowledged: string | null = this.warningAcknowledgedFormControl.value;
      if (warningAcknowledged === "I know what I'm doing") {
        this.adminService.failOpenSubmissions(true).then((response) => {
          this.messageService.add({
            severity: response.success ? 'success' : 'error',
            summary: response.success ? 'Successful' : 'Error',
            detail: response.success ? response.success : response.error,
            life: 3000,
          });

          if (response.success) {
            this.warningAcknowledgedFormControl.setValue(null);
          }
        });
      }
    } else {
      printFormErrors(this.form);
    }
  }
}
