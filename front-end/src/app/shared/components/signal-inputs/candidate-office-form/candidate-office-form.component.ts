import { Component, computed, effect, input, untracked } from '@angular/core';
import { SelectInput } from '../select-input/select.input';
import { CandidateOfficeTypeLabels, CandidateOfficeTypes, Contact } from 'app/shared/models/contact.model';
import { disabled, FieldTree, required, schema, FormField } from '@angular/forms/signals';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { requiredMessage } from 'app/shared/utils/signal-schema.utils';

export interface CandidateOfficeData {
  candidate_office: CandidateOfficeTypes | '';
  candidate_state: string;
  candidate_district: string;
}

export const defaultCandidateOfficeData: CandidateOfficeData = {
  candidate_office: '',
  candidate_state: '',
  candidate_district: '',
};

export function populateOffice(contact: Contact): CandidateOfficeData {
  return {
    candidate_office: contact.candidate_office ?? '',
    candidate_state: contact.candidate_state ?? '',
    candidate_district: contact.candidate_district ?? '',
  };
}

export const candidateOfficeSchema = schema<CandidateOfficeData>((schemaPath) => {
  disabled(schemaPath.candidate_state, ({ valueOf }) => {
    const office = valueOf(schemaPath.candidate_office);
    return office === '' || office === CandidateOfficeTypes.PRESIDENTIAL;
  });
  disabled(schemaPath.candidate_district, ({ valueOf }) => {
    const options = LabelUtils.getDistrictOptionsForState(valueOf(schemaPath.candidate_state));
    return valueOf(schemaPath.candidate_office) !== CandidateOfficeTypes.HOUSE || options.length < 2;
  });
  required(schemaPath.candidate_state, {
    when: ({ valueOf }) => valueOf(schemaPath.candidate_office) !== CandidateOfficeTypes.PRESIDENTIAL,
    message: requiredMessage,
  });
  required(schemaPath.candidate_district, {
    when: ({ valueOf }) => valueOf(schemaPath.candidate_office) == CandidateOfficeTypes.HOUSE,
    message: requiredMessage,
  });
});

@Component({
  selector: 'app-candidate-office-form',
  imports: [SelectInput, FormField],
  templateUrl: './candidate-office-form.component.html',
  styleUrl: './candidate-office-form.component.scss',
})
export class CandidateOfficeFormComponent {
  readonly fields = input.required<FieldTree<CandidateOfficeData, string>>();
  readonly candidateOfficeTypeOptions = LabelUtils.getPrimeOptions(CandidateOfficeTypeLabels);
  readonly stateOptions = LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary());
  readonly candidateDistrictOptions = computed(() =>
    LabelUtils.getDistrictOptionsForState(this.fields().candidate_state().value()),
  );

  constructor() {
    effect(() => {
      const office = this.fields().candidate_office().value();
      const state = this.fields().candidate_state();
      const district = this.fields().candidate_district();
      switch (office) {
        case CandidateOfficeTypes.PRESIDENTIAL: {
          untracked(() => {
            if (state.value() !== '') state.value.set('');
            if (district.value() !== '') district.value.set('');
          });
          return;
        }
        case CandidateOfficeTypes.SENATE: {
          if (district.value() !== '') untracked(() => district.value.set(''));
          return;
        }
        case CandidateOfficeTypes.HOUSE: {
          const districtOptions = this.candidateDistrictOptions();
          untracked(() => {
            if (districtOptions.length === 1) district.value.set(districtOptions[0].value);
            else if (+district.value() > districtOptions.length) {
              district.value.set('');
            }
          });

          return;
        }
      }
    });
  }
}
