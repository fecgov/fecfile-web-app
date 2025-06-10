import { Component, effect } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LabelUtils, PrimeOptions, StatesCodeLabels } from 'app/shared/utils/label.utils';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { FormComponent } from 'app/shared/components/app-destroyer.component';
import { environment } from 'environments/environment';
import { FecInternationalPhoneInputComponent } from '../../shared/components/fec-international-phone-input/fec-international-phone-input.component';
import { ButtonModule } from 'primeng/button';
import { SelectComponent } from 'app/shared/components/select/select.component';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';

@Component({
  selector: 'app-committee-info',
  templateUrl: './committee-info.component.html',
  styleUrls: ['./committee-info.component.scss'],
  imports: [ReactiveFormsModule, FecInternationalPhoneInputComponent, ButtonModule, SelectComponent],
})
export class CommitteeInfoComponent extends FormComponent {
  mostRecentFilingPdfUrl: string | null | undefined = undefined;
  readonly stateOptions: PrimeOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);

  readonly formProperties: string[] = [
    'name',
    'committee_id',
    'committee_type_label',
    'street_1',
    'street_2',
    'city',
    'state',
    'zip',
    'email',
    'website',
    'treasurer_name_1',
    'treasurer_name_2',
    'treasurer_street_1',
    'treasurer_street_2',
    'treasurer_city',
    'treasurer_state',
    'treasurer_zip',
    'treasurer_phone',
    'custodian_name_full',
  ];
  readonly form = this.fb.group(SchemaUtils.getFormGroupFields(this.formProperties), { updateOn: 'blur' });
  readonly stateControl = this.form.get('state') as SubscriptionFormControl;
  readonly treasurerStateControl = this.form.get('treasurer_state') as SubscriptionFormControl;
  constructor() {
    super();
    effect(() => {
      this.mostRecentFilingPdfUrl = undefined; // undefined until requirements are defined https://fecgov.atlassian.net/browse/FECFILE-1704
      this.form.enable();
      const entries = Object.entries(this.committeeAccountSignal());
      for (const [key, value] of entries) {
        if (this.formProperties.includes(key)) {
          this.form.get(key)?.setValue(value);
        }
      }
      this.form.disable();
    });
  }

  /**
   * This sends the user to their Form 1 PDF on fec.gov.
   */
  viewForm1(): void {
    if (this.mostRecentFilingPdfUrl) {
      window.open(this.mostRecentFilingPdfUrl, '_blank');
    }
  }

  /**
   * This sends the user to fec.gov to update their Form 1.
   */
  updateForm1(): void {
    window.open(environment.form1m_link, '_blank', 'noopener');
  }
}
