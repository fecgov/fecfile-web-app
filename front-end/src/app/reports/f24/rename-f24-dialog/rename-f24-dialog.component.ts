import { Component, effect, inject, input, model } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorMessagesComponent } from 'app/shared/components/error-messages/error-messages.component';
import { FormComponent } from 'app/shared/components/form.component';
import { Form24, Report } from 'app/shared/models';
import { Form24Service } from 'app/shared/services/form-24.service';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { F24UniqueNameValidator } from 'app/shared/utils/validators.utils';
import { MessageService } from 'primeng/api';
import { AutoFocusModule } from 'primeng/autofocus';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { Ripple } from 'primeng/ripple';

@Component({
  selector: 'app-rename-f24-dialog',
  templateUrl: './rename-f24-dialog.component.html',
  styleUrls: ['../../styles.scss'],
  imports: [
    Ripple,
    ButtonModule,
    ReactiveFormsModule,
    FormsModule,
    DialogModule,
    InputText,
    AutoFocusModule,
    ErrorMessagesComponent,
  ],
})
export class RenameF24DialogComponent extends FormComponent {
  protected readonly router = inject(Router);
  readonly messageService = inject(MessageService);
  readonly form24Service = inject(Form24Service);
  readonly f24UniqueNameValidator = inject(F24UniqueNameValidator);
  readonly dialogVisible = model(false);
  readonly f24Report = input<Report | undefined>();
  readonly form = new FormGroup(
    {
      typeName: new SubscriptionFormControl(),
      form24Name: new SubscriptionFormControl(),
    },
    {
      asyncValidators: [this.f24UniqueNameValidator.validate.bind(this.f24UniqueNameValidator)],
      updateOn: 'blur',
    },
  );
  readonly formParent: FormGroup = new FormGroup({
    form24NameGroup: this.form,
  });

  constructor() {
    super();
    effect(() => {
      const f24Report = this.f24Report() as Form24 | undefined;
      if (f24Report) {
        const regex = /^(24-Hour:\s|48-Hour:\s)(.*)$/;
        const match = f24Report.name?.match(regex);
        if (match) {
          this.form.get('typeName')?.setValue(match[1]);
          this.form.get('form24Name')?.setValue(match[2]);
        } else {
          this.form.get('typeName')?.setValue('');
          this.form.get('form24Name')?.setValue('');
        }
        if (this.dialogVisible()) {
          this.form.markAsUntouched();
          this.form.markAsPristine();
          this.formSubmitted = false;
        }
      }
    });
  }

  async submit() {
    const typeName = this.form.get('typeName')?.value;
    const form24Name = this.form.get('form24Name')?.value;
    if (!this.form.invalid && typeName && form24Name) {
      const payload = Form24.fromJSON({
        ...this.f24Report(),
        name: `${typeName}${form24Name}`,
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
}
