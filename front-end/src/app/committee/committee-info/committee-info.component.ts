import { AfterViewInit, ChangeDetectorRef, Component, effect, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LabelUtils, PrimeOptions, StatesCodeLabels } from 'app/shared/utils/label.utils';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { FormComponent } from 'app/shared/components/app-destroyer.component';
import { environment } from 'environments/environment';
import { Select } from 'primeng/select';
import { FecInternationalPhoneInputComponent } from '../../shared/components/fec-international-phone-input/fec-international-phone-input.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-committee-info',
  templateUrl: './committee-info.component.html',
  styleUrls: ['./committee-info.component.scss'],
  imports: [ReactiveFormsModule, Select, FecInternationalPhoneInputComponent, ButtonModule],
})
export class CommitteeInfoComponent extends FormComponent implements OnInit, AfterViewInit {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  mostRecentFilingPdfUrl: string | null | undefined = undefined;
  stateOptions: PrimeOptions = [];
  form = this.fb.group({}, { updateOn: 'blur' });
  formProperties: string[] = [
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

  ngOnInit(): void {
    this.form = this.fb.group(SchemaUtils.getFormGroupFields(this.formProperties), { updateOn: 'blur' });
    this.stateOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
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
