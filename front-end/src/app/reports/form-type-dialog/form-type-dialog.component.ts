import { Component, computed, inject, model, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FORM_TYPES, FormType, FormTypes } from 'app/shared/utils/form-type.utils';
import { Ripple } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { CreateF24Component } from './create-f24/create-f24.component';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-form-type-dialog',
  templateUrl: './form-type-dialog.component.html',
  styleUrls: ['./form-type-dialog.component.scss'],
  imports: [Ripple, ButtonModule, SelectModule, FormsModule, DialogModule, CreateF24Component],
})
export class FormTypeDialogComponent {
  readonly messageService = inject(MessageService);
  readonly router = inject(Router);
  readonly formTypeOptions: FormTypes[] = Array.from(FORM_TYPES, (mapping) => mapping[0]);

  readonly dialogVisible = model(false);

  readonly selectedType = signal<FormTypes | undefined>(undefined);
  readonly isF24 = computed(() => this.selectedType() === FormTypes.F24);
  readonly formType = computed(() => this.getFormType(this.selectedType()));
  readonly isSubmitDisabled = computed(() =>
    this.isF24() ? this.f24().isSubmitDisabled() : !this.formType()?.createRoute,
  );

  readonly f24 = viewChild.required(CreateF24Component);

  async goToReportForm(): Promise<void> {
    const type = this.selectedType();
    if (!type) return;
    try {
      if (this.isF24()) {
        await this.f24().createF24();
      } else if (this.formType()?.createRoute) {
        await this.router.navigateByUrl(this.formType()?.createRoute ?? '');
      }
      this.selectedType.set(undefined);
      this.dialogVisible.set(false);
    } catch (err) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'There was an error creating this Form 24',
        life: 3000,
      });
      throw err;
    }
  }

  /**
   * Called when the dialog is hidden/closed. Reset the selected form type so
   * the next time the dialog opens it's cleared.
   */
  onDialogHide(): void {
    this.selectedType.set(undefined);
  }

  getFormType(type?: FormTypes): FormType | undefined {
    return type ? FORM_TYPES.get(type) : undefined;
  }
}
