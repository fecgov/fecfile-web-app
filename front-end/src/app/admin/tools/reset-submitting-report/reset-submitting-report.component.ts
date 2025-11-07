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

@Component({
  selector: 'app-reset-submitting-report',
  templateUrl: './reset-submitting-report.component.html',
  styleUrl: './reset-submitting-report.component.scss',
  imports: [ReactiveFormsModule, ButtonDirective, ErrorMessagesComponent],
})
export class ResetSubmittingReportComponent extends DestroyerComponent {
  public readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  public readonly adminService = inject(AdminService);
  readonly reportIdFormControl = new SubscriptionFormControl<string | null>(null, [Validators.required]);

  form: FormGroup = new FormGroup({
    report_id: this.reportIdFormControl,
  });

  resetSubmittingReport(): void {
    if (this.form.valid) {
      const report_id: string | null = this.reportIdFormControl.value;
      if (report_id !== null) {
        this.adminService.resetSubmittingReport(report_id).then((response) => {
          this.messageService.add({
            severity: response.success ? 'success' : 'error',
            summary: response.success ? 'Successful' : 'Error',
            detail: response.success ? response.success : response.error,
            life: 3000,
          });

          if (response.success) {
            this.reportIdFormControl.setValue('');
          }
        });
      }
    } else {
      printFormErrors(this.form);
    }
  }
}
