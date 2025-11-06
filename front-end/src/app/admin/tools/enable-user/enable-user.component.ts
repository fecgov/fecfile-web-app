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
  selector: 'app-enable-user',
  templateUrl: './enable-user.component.html',
  styleUrl: './enable-user.component.scss',
  imports: [ReactiveFormsModule, ButtonDirective, ErrorMessagesComponent],
})
export class EnableUserComponent extends DestroyerComponent {
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  public readonly adminService = inject(AdminService);
  readonly userEmailFormControl = new SubscriptionFormControl<string | null>(null, [
    Validators.required,
    Validators.email,
  ]);

  form: FormGroup = new FormGroup({
    user_email: this.userEmailFormControl,
  });

  enableUser(): void {
    if (this.form.valid) {
      const user_email: string | null = this.userEmailFormControl.value;
      if (user_email !== null) {
        this.adminService.enableUser(user_email).then((response) => {
          console.log(response);
          this.messageService.add({
            severity: response.success ? 'success' : 'error',
            summary: response.success ? 'Successful' : 'Error',
            detail: response.success ? 'User Enabled' : response.error,
            life: 3000,
          });

          if (response.success) {
            this.userEmailFormControl.setValue('');
          }
        });
      }
    } else {
      printFormErrors(this.form);
    }
  }
}
