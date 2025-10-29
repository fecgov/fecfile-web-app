import { Component, effect, inject, input, model } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormComponent } from 'app/shared/components/app-destroyer.component';
import { ErrorMessagesComponent } from 'app/shared/components/error-messages/error-messages.component';
import { Form24, Report } from 'app/shared/models';
import { Form24Service } from 'app/shared/services/form-24.service';
import { blurActiveInput, printFormErrors } from 'app/shared/utils/form.utils';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { F24UniqueNameValidator } from 'app/shared/utils/validators.utils';
import { singleClickEnableAction } from 'app/store/single-click.actions';
import { MessageService } from 'primeng/api';
import { AutoFocusModule } from 'primeng/autofocus';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { Ripple } from 'primeng/ripple';

@Component({
  selector: 'app-rename-f24-dialog',
  templateUrl: './rename-f24-dialog.component.html',
  styleUrls: ['./rename-f24-dialog.component.scss'],
  imports: [Ripple, ButtonModule, ReactiveFormsModule, DialogModule, InputText, AutoFocusModule, ErrorMessagesComponent],
})
export class RenameF24DialogComponent extends FormComponent {
  protected readonly router = inject(Router);
  readonly messageService = inject(MessageService);
  readonly form24Service = inject(Form24Service);
  readonly f24UniqueNameValidator = inject(F24UniqueNameValidator);
  readonly dialogVisible = model(false);
  readonly f24Report = input<Report | undefined>();
  readonly form: FormGroup = new FormGroup(
    {
      name: new SubscriptionFormControl('', {
        validators: [Validators.required],
        asyncValidators: [this.f24UniqueNameValidator.validate.bind(this.f24UniqueNameValidator)],
        updateOn: 'blur',
      }),
    },
    { updateOn: 'blur', },
  );

  constructor() {
    super();
    effect(() => {
      this.form.get('name')?.setValue((this.f24Report() as Form24)?.name);
      if (this.dialogVisible()) {
        this.form.markAsUntouched();
        this.form.markAsPristine();
        this.formSubmitted = false;
      }
    });
  }

  async updateName() {
    this.formSubmitted = true;
    blurActiveInput(this.form);
    this.form.updateValueAndValidity();
    if (this.form.invalid) {
      printFormErrors(this.form);
      this.store.dispatch(singleClickEnableAction());
      return;
    }

    const payload = Form24.fromJSON({
      ...this.f24Report(),
      name: this.form.get('name')?.value,
    });
    await this.form24Service.update(payload, ['name']);
    this.dialogVisible.set(false);
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Report Updated',
      life: 3000,
    });
  }
}
