import { Component, OnInit } from '@angular/core';
import { FormBuilder, AbstractControl, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs';
import { ValidateUtils } from 'app/shared/utils/validate.utils';
import { schema as f1mSchema } from 'fecfile-validate/fecfile_validate_js/dist/F1M';
import { MessageService } from 'primeng/api';
import { Form1M } from 'app/shared/models/form-1m.model';
import { TransactionTemplateMapType } from 'app/shared/models/transaction-type.model';
import { Form1MService } from 'app/shared/services/form-1m.service';
import { Report } from 'app/shared/models/report.model';
import { MainFormBaseComponent } from 'app/reports/shared/main-form-base.component';
import { PrimeOptions, LabelUtils } from 'app/shared/utils/label.utils';
import { ContactTypeLabels, ContactTypes } from 'app/shared/models/contact.model';
import { SelectItem } from 'primeng/api';
import { Contact } from 'app/shared/models/contact.model';
import { selectActiveReport } from 'app/store/active-report.selectors';

@Component({
  selector: 'app-main-form',
  templateUrl: './main-form.component.html',
})
export class MainFormComponent extends MainFormBaseComponent implements OnInit {
  formProperties: string[] = [
    'committee_type',
    'filer_committee_id_number',
    'committee_name',
    'street_1',
    'street_2',
    'city',
    'state',
    'zip',
    'affiliated_date_form_f1_filed',
    'affiliated_committee_fec_id',
    'affiliated_committee_name',
    'statusBy',
    'contactAffiliatedLookup',
  ];
  schema = f1mSchema;
  webprintURL = '/reports/f1m/web-print/';
  templateMap = {
    street_1: 'street_1',
    street_2: 'street_2',
    city: 'city',
    state: 'state',
    zip: 'zip',
  } as TransactionTemplateMapType;

  committeeTypeControl: AbstractControl | null = null;
  contactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.COMMITTEE]);
  statusByControl: AbstractControl | null = null;
  contactAffiliatedLookupControl: AbstractControl | null = null;

  report = new Form1M();

  constructor(
    protected override store: Store,
    protected override fb: FormBuilder,
    protected override reportService: Form1MService,
    protected override messageService: MessageService,
    protected override router: Router,
    protected override activatedRoute: ActivatedRoute
  ) {
    super(store, fb, reportService, messageService, router, activatedRoute);
  }

  getReportPayload(): Report {
    return Form1M.fromJSON(ValidateUtils.getFormValues(this.form, this.schema, this.formProperties));
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((activeReport) => {
        if (this.reportId) {
          this.report = activeReport as Form1M;
        }
      });

    this.committeeTypeControl = this.form.get('committee_type');
    this.statusByControl = this.form.get('statusBy');
    this.statusByControl?.addValidators(Validators.required);
    this.contactAffiliatedLookupControl = this.form.get('contactAffiliatedLookup');
    // this.contactAffiliatedLookupControl?.addValidators(Validators.required);

    this.form.get('statusBy')?.valueChanges.subscribe((value: 'affiliation' | 'qualification') => {
      ValidateUtils.addJsonSchemaValidators(this.form, this.schema, true);
      if (value === 'affiliation') {
        this.contactAffiliatedLookupControl?.addValidators(Validators.required);
        this.contactAffiliatedLookupControl?.updateValueAndValidity();
        this.form.get('affiliated_date_form_f1_filed')?.addValidators(Validators.required);
        this.form.get('affiliated_committee_fec_id')?.addValidators(Validators.required);
        this.form.get('affiliated_committee_name')?.addValidators(Validators.required);
      }
    });
  }

  updateAffiliatedContact($event: SelectItem<Contact>) {
    this.report.contact_affiliated = $event.value;
    this.form.get('affiliated_committee_fec_id')?.setValue($event.value.committee_id);
    this.form.get('affiliated_committee_name')?.setValue($event.value.name);
    this.contactAffiliatedLookupControl?.clearValidators();
    this.contactAffiliatedLookupControl?.updateValueAndValidity();
  }
}
