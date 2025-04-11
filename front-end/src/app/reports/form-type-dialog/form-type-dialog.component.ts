import { Component, inject, model, output } from '@angular/core';
import { Router } from '@angular/router';
import { FORM_TYPES, FormType, FormTypes } from 'app/shared/utils/form-type.utils';
import { Form24Service } from 'app/shared/services/form-24.service';
import { Form24 } from 'app/shared/models/form-24.model';
import { Store } from '@ngrx/store';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { Ripple } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
  selector: 'app-form-type-dialog',
  templateUrl: './form-type-dialog.component.html',
  styleUrls: ['./form-type-dialog.component.scss'],
  imports: [Ripple, ButtonModule, SelectModule, FormsModule, DialogModule, SelectButtonModule],
})
export class FormTypeDialogComponent extends DestroyerComponent {
  public readonly router = inject(Router);
  private readonly form24Service = inject(Form24Service);
  private readonly store = inject(Store);

  readonly formTypes = FormTypes;

  readonly dialogVisible = model(false);
  readonly dialogClose = output<void>();
  readonly refreshReports = output<void>();

  formTypeOptions: FormTypes[] = Array.from(FORM_TYPES, (mapping) => mapping[0]);
  selectedType?: FormTypes;
  committeeAccountSignal = this.store.selectSignal(selectCommitteeAccount);
  street = undefined;

  selectedForm24Type: '24' | '48' | null = null;

  form24Options = [
    { label: '24 Hour ', value: '24' },
    { label: '48 Hour', value: '48' },
  ];

  goToReportForm(): void {
    this.closeDialog();
    if (this.getFormType(this.selectedType)?.createRoute) {
      this.router.navigateByUrl(this.getFormType(this.selectedType)?.createRoute || '');
    } else if (this.selectedType === FormTypes.F24) {
      this.createForm24();
    }
  }

  getFormType(type?: FormTypes): FormType | undefined {
    return type ? FORM_TYPES.get(type) : undefined;
  }

  updateSelected(type: FormTypes) {
    this.selectedType = type;
  }

  createForm24() {
    const form24 = Form24.fromJSON({
      report_type_24_48: this.selectedForm24Type,
      street_1: this.committeeAccountSignal().street_1,
      street_2: this.committeeAccountSignal().street_2,
      city: this.committeeAccountSignal().city,
      state: this.committeeAccountSignal().state,
      zip: this.committeeAccountSignal().zip,
      filer_committee_id_number: this.committeeAccountSignal().committee_id,
      committee_name: this.committeeAccountSignal().name,
    });
    const create$ = this.form24Service.create(form24, ['report_type_24_48']);

    create$.then((report) => {
      this.router.navigateByUrl(`/reports/transactions/report/${report.id}/list`);
    });

    this.selectedType = undefined;
  }

  closeDialog() {
    this.dialogClose.emit();
  }

  get isSubmitDisabled(): boolean {
    return (
      !this.getFormType(this.selectedType)?.createRoute &&
      (this.selectedType !== this.formTypes.F24 || !this.selectedForm24Type)
    );
  }
}
