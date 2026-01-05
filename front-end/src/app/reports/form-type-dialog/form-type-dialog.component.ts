import { Component, computed, effect, inject, model, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormType, getFormTypes } from 'app/shared/utils/form-type.utils';
import { Ripple } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { CreateF24Component } from './create-f24/create-f24.component';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { environment } from 'environments/environment';
import { ReportTypes } from 'app/shared/models';
import { DialogComponent } from 'app/shared/components/dialog/dialog.component';

@Component({
  selector: 'app-form-type-dialog',
  templateUrl: './form-type-dialog.component.html',
  styleUrls: ['./form-type-dialog.component.scss'],
  imports: [Ripple, ButtonModule, SelectModule, FormsModule, DialogModule, CreateF24Component, DialogComponent],
})
export class FormTypeDialogComponent {
  readonly messageService = inject(MessageService);
  readonly router = inject(Router);
  readonly formTypeOptions: ReportTypes[] = Array.from(getFormTypes(environment.showForm3), (mapping) => mapping[0]);

  readonly dialogVisible = model(false);

  readonly selectedType = signal<ReportTypes | undefined>(undefined);
  readonly isF24 = computed(() => this.selectedType() === ReportTypes.F24);
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
        this.router.navigateByUrl(this.formType()?.createRoute ?? '');
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

  getFormType(type?: ReportTypes): FormType | undefined {
    return type ? getFormTypes(environment.showForm3).get(type) : undefined;
  }

  constructor() {
    effect(() => {
      if (!this.dialogVisible()) {
        if (this.isF24()) {
          this.f24().reset();
        }
        this.selectedType.set(undefined);
      }
    });
  }
}
