import { Component, computed, effect, input, model, OnInit, untracked } from '@angular/core';
import { CandidateOfficeTypeLabels, CandidateOfficeTypes } from 'app/shared/models/contact.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { ScheduleIds, Transaction } from 'app/shared/models/transaction.model';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { FormGroup, FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { InputText } from 'primeng/inputtext';
import { SignalControl } from '../../contact-dialog/contact-dialog.component';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Candidate';

@Component({
  selector: 'app-candidate-office-input',
  styleUrls: ['./candidate-office-input.component.scss'],
  templateUrl: './candidate-office-input.component.html',
  imports: [FormsModule, Select, ErrorMessagesComponent, InputText],
})
export class CandidateOfficeInputComponent implements OnInit {
  readonly formSubmitted = input.required<boolean>();
  readonly transaction = input<Transaction>();
  readonly form = input<FormGroup>();

  readonly officeFormControlName = input<string>();
  readonly stateFormControlName = input<string>();
  readonly districtFormControlName = input<string>();

  readonly electionCode = input<string>();

  readonly candidateOfficeTypeOptions = LabelUtils.getPrimeOptions(CandidateOfficeTypeLabels);
  readonly candidateStateOptions = LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary());
  readonly candidateDistrictOptions = computed(() => {
    const state = this.state().value();
    const office = this.office().value();
    if (!!state && office === CandidateOfficeTypes.HOUSE) {
      return LabelUtils.getPrimeOptions(LabelUtils.getCongressionalDistrictLabels(state));
    }
    return [];
  });

  readonly isScheduleE = computed(() => this.transaction()?.transactionType.scheduleId === ScheduleIds.E);

  readonly officeControl = computed(() => {
    const name = this.officeFormControlName();
    const form = this.form();
    if (!name || !form) return null;
    return form.get(name) as SubscriptionFormControl;
  });

  readonly stateControl = computed(() => {
    const name = this.stateFormControlName();
    const form = this.form();
    if (!name || !form) return null;
    return form.get(name) as SubscriptionFormControl;
  });

  readonly districtControl = computed(() => {
    const name = this.districtFormControlName();
    const form = this.form();
    if (!name || !form) return null;
    return form.get(name) as SubscriptionFormControl;
  });

  readonly office = model(new SignalControl<string>('candidate_office'));
  readonly state = model(new SignalControl<string>('candidate_state'));
  readonly district = model(new SignalControl<string>('candidate_district'));

  constructor() {
    effect(() => {
      const office = this.office().value();
      untracked(() => {
        const electionCode = this.electionCode() ?? '';
        if (!office || office === CandidateOfficeTypes.PRESIDENTIAL) {
          // Handle special case for Schedule E where presidential primaries require the candidate state to have a value.
          if (this.isScheduleE() && electionCode.startsWith('P')) {
            this.district().value.set(null);
            this.state().disabled.set(false);
            this.district().disabled.set(true);
          } else {
            this.state().value.set(null);
            this.district().value.set(null);
            this.state().disabled.set(true);
            this.district().disabled.set(true);
          }
        } else if (office === CandidateOfficeTypes.SENATE) {
          this.district().value.set(null);
          this.state().disabled.set(false);
          this.district().disabled.set(true);
        } else if (!this.transaction()?.reatt_redes) {
          this.state().disabled.set(false);
          this.district().disabled.set(false);
        }
      });
    });

    effect(() => {
      this.state().value();
      untracked(() => {
        const district = this.district().value() ?? '';
        const options = this.candidateDistrictOptions();
        if (!options.map((option) => option.value).includes(district)) {
          this.district().value.set(options.length === 1 ? options[0]?.value : null);
        }
      });
    });

    // effect(() => {
    //   if (this.isScheduleE() && this.electionCode()) this.updateCandidateFieldAvailability();
    // });
  }

  ngOnInit(): void {
    const officeControl = this.officeControl();
    if (officeControl) {
      this.office().value.set(officeControl.value);
    }

    const stateControl = this.stateControl();
    if (stateControl) {
      this.state().value.set(stateControl.value);
    }

    const districtControl = this.districtControl();
    if (districtControl) {
      this.district().value.set(districtControl.value);
    }
  }
}
