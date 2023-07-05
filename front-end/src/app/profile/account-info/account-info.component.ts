import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { FecFiling } from 'app/shared/models/fec-filing.model';
import { FecApiService } from 'app/shared/services/fec-api.service';
import { LabelUtils, PrimeOptions, StatesCodeLabels } from 'app/shared/utils/label.utils';
import { ValidateUtils } from 'app/shared/utils/validate.utils';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss'],
})
export class AccountInfoComponent implements OnInit, AfterViewInit, OnDestroy {
  committeeAccount$: Observable<CommitteeAccount> | undefined;
  mostRecentFilingPdfUrl: string | null | undefined = undefined;
  destroy$: Subject<boolean> = new Subject<boolean>();
  stateOptions: PrimeOptions = [];
  form: FormGroup = this.fb.group({});
  formProperties: string[] = [
    'name',
    'committee_id',
    'committee_type_full',
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

  constructor(private store: Store, private fecApiService: FecApiService, private fb: FormBuilder) { }
  ngAfterViewInit(): void {
    this.committeeAccount$ = this.store.select(selectCommitteeAccount);
    this.committeeAccount$?.pipe(takeUntil(this.destroy$)).subscribe((committee: CommitteeAccount) => {
      this.fecApiService.getCommitteeRecentFiling(committee.committee_id)
        .subscribe((mostRecentFiling: FecFiling | undefined) => {
          this.mostRecentFilingPdfUrl = mostRecentFiling?.pdf_url;
        });

      this.form.enable();
      const entries = Object.entries(committee);
      for (const [key, value] of entries) {
        if (this.formProperties.includes(key)) {
          if (key.includes('phone')) {
            let prefix = '';
            if (value.length > 0 && value[0] !== '+') {
              if (value.length < 11) {
                prefix = '1';
              }
              prefix = '+' + prefix;
            }
            const adjustedValue = prefix + ' ' + value;
            this.form.get(key)?.setValue(adjustedValue);
          } else {
            this.form.get(key)?.setValue(value);
          }
          this.form.get(key)?.updateValueAndValidity();
        }
      }
      this.form.disable();
    });
  }

  ngOnInit(): void {
    this.form = this.fb.group(ValidateUtils.getFormGroupFields(this.formProperties));
    this.stateOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
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
    window.open('https://webforms.fec.gov/webforms/form1/index.htm', '_blank');
  }
}
